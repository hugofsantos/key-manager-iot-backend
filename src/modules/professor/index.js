import {ProfessorRepository} from './repositories/professorRepository.js';
import {ProfessorService} from './professorService.js';
import {ProfessorController} from './professorController.js';

const professorRepository = new ProfessorRepository();
const professorService = new ProfessorService(professorRepository);
const professorController = new ProfessorController(professorService);

export default professorController;
