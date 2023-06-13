export class ReservaController {
  constructor(reservaService) {
    this.base = '/reserva';
    this.reservaService = reservaService;
  }

  async postReserva(request, response) {
    try {
      const reserva = await this.reservaService.createReserva(request.body);

      response.status(201).json(reserva);
    }catch(error) {
      response.status(500).json(error);
    }
  }

  async getReservas(request, response) {
    try{
      const reservas = await this.reservaService.findReservas(request.query);

      response.status(201).json(reservas);
    }catch(error) {
      response.status(500).json(error);
    }
  }
}