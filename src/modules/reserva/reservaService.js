export class ReservaService {
  constructor(reservaRepository) {
    this.reservaRepository = reservaRepository;
  }

  async createReserva(reserva) {
    try{
      const {professor, datas, horarioInicial, horarioFinal, sala} = reserva;

      const conflicts = await this.#getDatesWithTimeConflict(datas, horarioInicial, horarioFinal, sala);
      
      if (horarioInicial >= horarioFinal) throw new Error('Horários inválidos!');
      if(conflicts.length){
        const error = new Error();
        error.message = 'Algumas datas já estão reservadas nesse horário';
        error.conflicts = conflicts;
        error.stack = (new Error()).stack;

        throw error;
      }

      return await this.reservaRepository.writeOne({professor, datas, horarioInicial, horarioFinal, sala});
    }catch(error) {
      throw error;
    }
  }

  async findReservas(filters) {
    try{
      const {professor, horarioInicial, horarioFinal, sala, withProfessors} = filters;
      
      const query = {
        ...(horarioInicial && { horarioInicial: Number(horarioInicial) }),
        ...(horarioFinal && { horarioFinal: Number(horarioFinal) }),
        ...(professor && { professor }),
        ...(sala && { sala }),
        withProfessors: withProfessors === 'true'
      };

      return await this.reservaRepository.find(query);
    }catch(error) {
      throw error;
    }
  }

  async getReserva(professorId) {
    const now = new Date();
    const nowOnlyWithHoursAndMinutes = new Date(0, 0, 0, now.getHours(), now.getMinutes()); 

    try {
      return await this.reservaRepository.findReserva(
        professorId,
        nowOnlyWithHoursAndMinutes.getTime(),
        now.toLocaleDateString('pt-BR')
      );
    }catch(error) {
      throw error;
    }
  }    

  async #getDatesWithTimeConflict(datas, horarioInicial, horarioFinal, sala) {
    try{
      const reservedDates = new Set();

      const reservas = await this.reservaRepository.findReservasInRange(horarioInicial, horarioFinal, sala);

      reservas.forEach(reserva => {
        reserva.datas.forEach(data => reservedDates.add(data));
      });

      return datas.filter(data => reservedDates.has(data));
    }catch(error) {
      throw error;
    }
  }
}