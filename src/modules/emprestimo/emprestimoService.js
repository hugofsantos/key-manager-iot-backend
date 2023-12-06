import { reservaConsumer } from "../reserva/index.js";

export class EmprestimoService {
  constructor(emprestimoRepository) {
    this.emprestimoRepository = emprestimoRepository;
  }

  async getLastEmprestimoByProfessorId(professorId) {
    try{
      return await this.emprestimoRepository.getLastEmprestimoByProfessorId(professorId);
    }catch(error) {
      throw error;
    }
  }

  async updateHorarioDevolucao(id) {
    try{
      return await this.emprestimoRepository.updateHorarioDevolucao(id);
    }catch(error) {
      throw error;
    }
  }

  async findPendings(filters) {
    try{
      return this.emprestimoRepository.findPendings(filters);
    }catch(error) {
      throw error;
    }
  }

  async createEmprestimo(emprestimo) {
    try{
      return await this.emprestimoRepository.writeOne(emprestimo);
    }catch(error) {
      throw error;
    }
  }

  async giveBackRoom(room) {
    try {
      const emprestimo = await this.emprestimoRepository.findLastByRoom(room);

      if(emprestimo == null || emprestimo.horarioEmprestimo == null) throw new Error('Essa sala não foi emprestada!');
      if(emprestimo.horarioDevolucao != null) throw new Error('Essa sala já foi devolvida');

      emprestimo.horarioDevolucao = Date.now();
      const newEmprestimo = await this.emprestimoRepository.updateEmprestimo(emprestimo); 

      this.#sendConfirmation(emprestimo._id, 'devolucao');
      return newEmprestimo;
    } catch (error) {
      throw error;
    }
  }

  async giveRoom(room) {
    try{
      const emprestimo = await this.emprestimoRepository.findLastByRoom(room);

      if(emprestimo == null) throw new Error('O empréstimo dessa sala não foi solicitado');
      if(emprestimo.horarioEmprestimo != null) throw new Error('Essa sala já foi emprestada');

      emprestimo.horarioEmprestimo = Date.now();
      const newEmprestimo = await this.emprestimoRepository.updateEmprestimo(emprestimo);

      this.#sendConfirmation(emprestimo._id, 'retirada');
      return newEmprestimo;
    }catch(error) {
      throw error;
    }
  } 

  async #sendConfirmation(emprestimoId, event) {
    try {
      const emprestimo = await this.emprestimoRepository.getEmprestimoById(emprestimoId, true);

      reservaConsumer.publicMQTTMessage(`/${event}`, emprestimo.sala);
      reservaConsumer.sendWebsocketMessage(event, emprestimo);
    } catch (error) {
      console.error(error);
    }
  }
}