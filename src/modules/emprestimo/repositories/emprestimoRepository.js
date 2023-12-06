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

  async getEmprestimoById(id, populate) {
    try {
      if(populate) {
        return await this.model.findById(id).populate('professor');
      }

      return await this.model.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async getLastEmprestimoByProfessorId(professor) {
    try {
      return (await this.model.find({professor}).sort('-horarioSolicitacao').limit(1))[0];
    }catch(error) {
      throw error;
    }
  }

  async findPendings(filters) {
    try {
      const { inicio, fim, sala, comProfessor } = filters;

      const findObj = {
        ... ((inicio || inicio === 0) && { horarioSolicitacao: { $gte: inicio } }),
        ... ((fim || fim === 0) && { horarioSolicitacao: { $lte: fim } }),
        ... (sala && { sala }),
        horarioEmprestimo: {$ne: null}, // Se o horário de empréstimo não for nulo
        horarioDevolucao: null
      }

      if(comProfessor)
        return await this.model.find(findObj).populate('professor').exec();
        
      return await this.model.find(findObj);
    }catch(error) {
      throw error;
    }    
  }

  async findLastByRoom(room) {
    try {
      const last = (await this.model.find({sala: room}).sort('-horarioSolicitacao').limit(1))[0];

      return last || null;
    } catch (error) {
      throw error;
    }
  }

  async updateEmprestimo(emprestimo) {
    try {
      const {_id, professor, sala, horarioSolicitacao, horarioDevolucao, horarioEmprestimo} = emprestimo;

      return await this.model.findOneAndUpdate(
        {_id }, 
        {
          $set: {
            professor,
            sala,
            horarioSolicitacao,
            horarioDevolucao,
            horarioEmprestimo
          }
        },
        {new: true}
      );
    } catch (error) {
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