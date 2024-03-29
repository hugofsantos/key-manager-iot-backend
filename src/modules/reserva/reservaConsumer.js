import connectToBrokerMQTT from '../../configs/mqtt.js';

export class ReservaConsumer {
  constructor(reservaService, professorService, emprestimoService) {
    this.reservaService = reservaService;
    this.professorService = professorService;
    this.emprestimoService = emprestimoService;

    this.clientMQTT = null;
    this.baseTopic = '';
    this.sockets = {};
  }

  async initConsumer(clientId, brokerUrl, username, password) {
    this.clientMQTT = await connectToBrokerMQTT(clientId, brokerUrl, username, password);
    this.baseTopic = username;

    this.clientMQTT.on('connect', () => console.log('Conectado ao broker MQTT pelo reservaConsumer'));
    
    this.clientMQTT.subscribe(this.baseTopic + '/rfid');
    this.clientMQTT.subscribe(this.baseTopic + '/cadastrar');
  
    this.clientMQTT.on('message', (topic, message) => {
      if (topic === this.baseTopic + '/cadastrar') this.#onMessageCadastrar(message.toString());
      if (topic === this.baseTopic + '/rfid') this.#onMessageRFID(message.toString());
    });
  }

  async #onMessageCadastrar(rfid) {
    try{
      this.sendWebsocketMessage('cadastrar', rfid);
    }catch(e) {
      console.error(e.message);
    }
  }

  async #onMessageRFID(rfid) {
    try{
      const [professor] = await this.professorService.findProfessors({uid: rfid});

      if(!professor) {
        this.clientMQTT.publish(this.baseTopic + '/erro', 'UNKNOWN_RFID');
        console.error('Não têm nenhum professor cadastrado com esse código RFID!' + rfid);
        return;
      }

      const lastEmprestimo = await this.emprestimoService.getLastEmprestimoByProfessorId(professor._id);

      if(lastEmprestimo?.horarioEmprestimo != null && lastEmprestimo?.horarioDevolucao === null){
        // SOLICITAR DEVOLUÇÃO DA SALA
        console.log(`SOLICITAÇÃO PARA DEVOLVER A SALA ${lastEmprestimo.sala}`);

        this.clientMQTT.publish(this.baseTopic + '/solicitar_devolucao', lastEmprestimo.sala);
        this.sendWebsocketMessage('solicitar', {
          borrower: professor.nome,
          room: lastEmprestimo.sala           
        });
        return;
      }

      const reserva = await this.reservaService.getReserva(professor._id);
      
      if(!reserva) {
        this.clientMQTT.publish(this.baseTopic + '/erro', 'NO_RESERVATION');
        console.error('Esse professor não têm reserva nesse horário!');
        return;
      }

      const pendentes = await this.emprestimoService.findPendings({sala: reserva.sala});

      if(pendentes?.length) {
        console.error('A chave dessa sala ainda não foi devolvida!');
        return;
      }

      const emprestimoCriado = await this.emprestimoService.createEmprestimo({
        professor: professor._id,
        sala: reserva.sala,
        horarioSolicitacao: Date.now()
      });

      console.log(`SALA ${reserva.sala} SOLICITADA`);

      this.clientMQTT.publish(this.baseTopic + "/solicitar_retirada", reserva.sala);
      this.sendWebsocketMessage('solicitar', {
        borrower: professor.nome,
        room: reserva.sala 
      });
    }catch(error) {
      throw error;
    }
  }

  addSocket(socket) {
    this.sockets[socket.id] = socket;
  }

  removeSocket(socket) {
    delete this.sockets[socket.id];
  }

  sendWebsocketMessage(topic, message) {
    console.log(topic, message);

    Object.values(this.sockets).forEach(socket => {
      socket.emit(topic, message);
    });
  }

  publicMQTTMessage(topic, message) {
    this.clientMQTT.publish(this.baseTopic + topic, message);

  }
}