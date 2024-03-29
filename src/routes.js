import express from 'express';
import { emprestimoController } from './modules/emprestimo/index.js';
import {professorController} from './modules/professor/index.js';
import {reservaController} from './modules/reserva/index.js';

const routes = express.Router();

// Professor
routes.get(professorController.base, (req, res) => professorController.getProfessors(req, res));
routes.post(professorController.base, (req, res) => professorController.postProfessor(req, res));

// Reserva
routes.get(reservaController.base, (req, res) => reservaController.getReservas(req, res));
routes.post(reservaController.base, (req, res) => reservaController.postReserva(req, res));


// Emprestimos
routes.get(emprestimoController.base + "/pendings", (req, res) => emprestimoController.getPendings(req, res));
routes.put(emprestimoController.base + '/give-room', (req, res) => emprestimoController.giveRoom(req, res));
routes.put(emprestimoController.base + '/give-back-room', (req, res) => emprestimoController.giveBackRoom(req, res));

export default routes;