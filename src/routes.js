import express from 'express';
import professorController from './modules/professor/index.js';

const routes = express.Router();

routes.get(professorController.base, (req, res) => professorController.getProfessors(req, res));
routes.post(professorController.base, (req, res) => professorController.postProfessor(req, res));

export default routes;