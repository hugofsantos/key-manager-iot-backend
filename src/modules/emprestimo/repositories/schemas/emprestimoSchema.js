import mongoose from "mongoose";

export const emprestimoSchema = mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true },
  sala: {type: String, required: true},
  horarioSolicitacao: {type: Number, required: true},
  horarioEmprestimo: {type: Number, default: null},
  horarioDevolucao: {type: Number, default: null}
}, { collection: 'emprestimos' });

export const emprestimoModel = mongoose.model('Emprestimo', emprestimoSchema);