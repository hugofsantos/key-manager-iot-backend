export class ProfessorController {
  constructor (professorService) {
    this.base = '/professor';
    this.professorService = professorService;
  }

  async postProfessor(request, response) {
    try {
      const {nome, matricula, uid} = request.body;

      const professor = await this.professorService.createProfessor({nome, matricula, uid});
      response.status(201).json(professor);
    }catch(error) {
      response.status(500).json(error);
    }
  }

  async getProfessors(request, response) {
    try {
      const {nome, matricula, uid, id} = request.query;

      const professors = await this.professorService.findProfessors({nome, matricula, uid, _id: id});
      
      return response.status(200).json(professors);
    }catch(error) {
      response.status(500).json(error);
    }
  }
}