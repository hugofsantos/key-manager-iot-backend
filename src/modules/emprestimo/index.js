import { EmprestimoRepository } from './repositories/emprestimoRepository.js';
import { EmprestimoService } from './emprestimoService.js';
import { EmprestimoController } from './emprestimoController.js';

let emprestimoServiceInstance = null;
let emprestimoControllerInstance = null;

export function getEmprestimoServiceInstance() {
  if (!emprestimoServiceInstance)
    emprestimoServiceInstance = new EmprestimoService(new EmprestimoRepository());

  return emprestimoServiceInstance;
}

export function getEmprestimoControllerInstance() {
  if (!emprestimoControllerInstance) {
    emprestimoControllerInstance = new EmprestimoController(getEmprestimoServiceInstance());
  }

  return emprestimoControllerInstance;
}

export const emprestimoService = getEmprestimoServiceInstance();
export const emprestimoController = getEmprestimoControllerInstance();

