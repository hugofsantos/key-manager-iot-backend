import mongoose from "mongoose";

export const reservaSchema = mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true },
  datas: [{ type: String }], // Um array de string
  horarioInicial: { type: Number, required: true }, // Tempo inicial (em ms)
  horarioFinal: { type: Number, required: true }
}, { collection: 'reservas' });

export const reservaModel = mongoose.Model('Reserva', reservaSchema);