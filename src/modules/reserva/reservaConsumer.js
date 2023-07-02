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
    
  
    this.clientMQTT.on('message', (topic, message) => {
      if (topic === this.baseTopic + '/rfid')
        this.#onMessageRFID(message.toString());
    });
  }

  async #onMessageRFID(rfid) {
    try{
      this.sendWebsocketMessage('rfid', rfid);

      const [professor] = await this.professorService.findProfessors({uid: rfid});

      if(!professor) {
        console.error('Não têm nenhum professor cadastrado com esse código RFID!' + rfid);
        return;
      }

      const lastEmprestimo = await this.emprestimoService.getLastEmprestimoByProfessorId(professor._id);

      if(lastEmprestimo?.horarioDevolucao === null){
        console.log(`Sala ${lastEmprestimo.sala} devolvida`);

        this.clientMQTT.publish(this.baseTopic + '/trancar', lastEmprestimo.sala);
        this.emprestimoService.updateHorarioDevolucao(lastEmprestimo._id);
        this.sendWebsocketMessage('trancar', lastEmprestimo.sala);
        return;
      }

      const reserva = await this.reservaService.getReserva(professor._id);
      
      if(!reserva) {
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
        horarioEmprestimo: Date.now()
      });

      console.log(`Sala ${reserva.sala} emprestada`);

      this.clientMQTT.publish(this.baseTopic + "/liberar", reserva.sala);
      this.sendWebsocketMessage('liberar', {
        sala: emprestimoCriado.sala,
        horarioEmprestimo: emprestimoCriado.horarioEmprestimo,
        professor: {
          _id: professor._id,
          nome: professor.nome
        }
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
}