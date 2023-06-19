import mongoose from "mongoose";

export const emprestimoSchema = mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true },
  sala: {type: String, required: true},
  horarioEmprestimo: {type: Number, required: true},
  horarioDevolucao: {type: Number, default: null}
}, { collection: 'emprestimos' });

export const emprestimoModel = mongoose.model('Emprestimo', emprestimoSchema);