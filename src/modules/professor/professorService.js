export class ProfessorService {
  constructor(professorRepository) {
    this.professorRepository = professorRepository;
  }

  async createProfessor (professor) {
    try{
      console.log(professor);
      return await this.professorRepository.writeOne(professor);
    }catch(error) {
      throw error;
    }
  }

  async findProfessors(filters) {
    try{
      return await this.professorRepository.find(filters);
    }catch(error) {
      throw error;
    }
  }
}