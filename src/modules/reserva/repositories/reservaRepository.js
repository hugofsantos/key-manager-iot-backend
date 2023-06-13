import { reservaModel } from "./schemas/reservaSchema.js";

export class ReservaRepository {
  constructor() {
    this.model = reservaModel
  }

  async writeOne(reserva) {    
    try{
      return await this.model.create(reserva);
    }catch(error) {
      throw error;
    }
  }

  async find(filters) {
    const {professor, horarioInicial, horarioFinal, sala, withProfessors} = filters;

    try{
      const findObj = {
        ...((horarioInicial || horarioInicial === 0)  && {horarioInicial: {$gte: horarioInicial}}),
        ...((horarioFinal || horarioFinal === 0) && { horarioFinal: {$lte: horarioFinal} }),
        ...(professor && { professor }),
        ...(sala && { sala })
      };

      if(withProfessors) 
        return await this.model.find(findObj).populate('professor').exec();

      return await this.model.find(findObj); 
    }catch(error) {
      throw error;
    }
  }

  async findReservasInRange(horarioInicial, horarioFinal, sala) {
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
          },
          {
           horarioInicial: {$lte: horarioInicial},
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