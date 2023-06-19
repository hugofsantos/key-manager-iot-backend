import { ReservaRepository } from './repositories/reservaRepository.js';
import { ReservaService } from './reservaService.js'; 
import { ReservaController } from './reservaController.js'; 
import { ReservaConsumer } from './reservaConsumer.js';
import { professorService } from '../professor/index.js';
import { emprestimoService } from '../emprestimo/index.js';


let reservaServiceInstance = null;
let reservaControllerInstance = null;
let reservaConsumerInstance = null;

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

export async function getReservaConsumerInstance() {
  if(!reservaConsumerInstance) {
    reservaConsumerInstance = new ReservaConsumer(getReservaServiceInstance(), professorService, emprestimoService);
  }

  return reservaConsumerInstance;
}

export const reservaService = getReservaServiceInstance();
export const reservaController = getReservaControllerInstance();
export const reservaConsumer = await getReservaConsumerInstance();

