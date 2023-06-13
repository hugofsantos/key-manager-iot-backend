import { ReservaRepository } from './repositories/reservaRepository.js';
import { ReservaService } from './reservaService.js'; 
import { ReservaController } from './reservaController.js'; 

let reservaServiceInstance = null;
let reservaControllerInstance = null;

export function getReservaServiceInstance() {
  if (!reservaServiceInstance)
    reservaServiceInstance = new ReservaService(new ReservaRepository());

  return reservaServiceInstance;
}

export function getReservaControllerInstance() {
  if (!reservaControllerInstance) {
    reservaControllerInstance = new ReservaController(getReservaServiceInstance());
  }

  return reservaControllerInstance;
}

export const reservaService = getReservaServiceInstance();
export const reservaController = getReservaControllerInstance();

