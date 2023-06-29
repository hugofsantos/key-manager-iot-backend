export class ProfessorService {
  constructor(professorRepository) {
    this.professorRepository = professorRepository;
  }

  async createProfessor (professor) {
    try{
      const {nome, matricula, uid} = professor;

      const rfidProfessor = await this.findProfessors({uid});
      
      if(rfidProfessor) throw new Error('Esse UID já foi cadastrado!');

      const matriculaProfessor = await this.findProfessors({matricula});

      if(matriculaProfessor) throw new Error('Um professor com essa matrícula já foi cadastrado!');

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