import { reservaModel } from "./schemas/reservaSchema";

export class ReservaRepository {
  constructor() {
    this.model = reservaModel
  }

  async writeOne(reserva) {
    if(reserva?.horarioInicial >= reserva.horarioFinal)
      throw new Error('Horários de reserva inválidos!');
    
    try{
      return await this.model.create(reserva);
    }catch(error) {
      throw error;
    }
  }

  async find(filters) {
    const {professor, horarioInicial, horarioFinal, sala} = filters;

    try{
      return await this.model.find({
        horarioInicial: {$gte: horarioInicial ?? 0},
        horarioFinal: { $lte: horarioFinal ?? Date.now()},
        ...(professor & {professor}),
        ...(sala & {sala})
      }); 
    }catch(error) {
      throw error;
    }
  }

  async findReservasInRange(horarioInicial, horarioFinal, sala) {
    if(!horarioInicial || !horarioFinal || !sala)
      throw new Error('Todos os parâmetros (horarioInicial, horarioFinal e Sala) precisam ter valor!');

    try {
      return await this.model.find({
        $or: [
          {
            horarioInicial: {$lte: horarioInicial},
            horarioFinal: {$gt: horarioInicial}
          },
          {
            horarioInicial: {$lt: horarioFinal},
            horarioFinal: {$gte: horarioFinal}
          }
        ],
        sala 
      });
    }catch(error) {
      throw error;
    }
  }
}