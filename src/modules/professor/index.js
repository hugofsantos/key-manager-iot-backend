import {ProfessorRepository} from './repositories/professorRepository.js';
import {ProfessorService} from './professorService.js';
import {ProfessorController} from './professorController.js';

let professorServiceInstance = null;
let professorControllerInstance = null;

export function getProfessorServiceInstance() {
  if(!professorServiceInstance)
    professorServiceInstance = new ProfessorService(new ProfessorRepository());

  return professorServiceInstance;
}

export function getProfessorControllerInstance() {
  if (!professorControllerInstance) {
    professorControllerInstance = new ProfessorController(getProfessorServiceInstance());
  }

  return professorControllerInstance;
}

export const professorService = getProfessorServiceInstance();
export const professorController = getProfessorControllerInstance();

