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
      return await this.emprestimoRepository.updateEmprestimo(emprestimo);
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
      return await this.emprestimoRepository.updateEmprestimo(emprestimo);
    }catch(error) {
      throw error;
    }
  } 
}