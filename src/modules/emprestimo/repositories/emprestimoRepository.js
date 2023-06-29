import { emprestimoModel } from "./schemas/emprestimoSchema.js";

export class EmprestimoRepository {
  constructor () {
    this.model = emprestimoModel
  }

  async writeOne(emprestimo) {
    try{
      return this.model.create(emprestimo);
    }catch(error) {
      throw error;
    }
  }

  async getLastEmprestimoByProfessorId(professor) {
    try {
      return (await this.model.find({professor}).sort('-horarioEmprestimo').limit(1))[0];
    }catch(error) {
      throw error;
    }
  }

  async findPendings(filters) {
    try {
      const { inicio, fim, sala } = filters;

      return await this.model.find({
        ... ((inicio || inicio === 0) && {horarioEmprestimo: {$gte: inicio}}),
        ... ((fim || fim === 0) && { horarioEmprestimo: { $lte: fim } }),
        ... (sala && {sala}),
        horarioDevolucao: null
      });
    }catch(error) {
      throw error;
    }    
  }

  async updateHorarioDevolucao(id) {
    try{
      return await this.model.findOneAndUpdate(
        {_id: id, horarioDevolucao: null},
        {$set: {horarioDevolucao: Date.now()}},
        {new: true}
      );

    }catch(error) {
      throw error;
    }
  }
}