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
      this.emprestimoRepository.writeOne(emprestimo);
    }catch(error) {
      throw error;
    }
  }
}