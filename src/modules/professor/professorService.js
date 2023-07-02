export class ProfessorService {
  constructor(professorRepository) {
    this.professorRepository = professorRepository;
  }

  async createProfessor (professor) {
    try{
      const {nome, matricula, uid} = professor;

      const rfidProfessor = await this.findProfessors({uid});

      if(rfidProfessor.length) throw new Error('Esse UID já foi cadastrado!');

      const matriculaProfessor = await this.findProfessors({matricula});

      if(matriculaProfessor.length) throw new Error('Um professor com essa matrícula já foi cadastrado!');
      
      return await this.professorRepository.writeOne({nome, matricula, uid});
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