import { professorModel } from "./schemas/professorSchema.js";

export class ProfessorRepository {
  constructor() {
    this.model = professorModel;
  }

  async writeOne(data) {
    try{
      return await this.model.create(data);
    }catch(error) {
      throw error;
    }
  }

  async find(filters) {
    const {nome, matricula, uid, _id} = filters;

    if(_id) return await this.model.findById(_id);

    return await this.model.find({
      ...(nome && {nome: new RegExp(nome, 'ig')}),
      ...(matricula && {matricula}),
      ...(uid && {uid})
    });
  }
}