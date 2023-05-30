import mongoose from "mongoose";

export const professorSchema = mongoose.Schema({
  nome: {type: String, required: true},
  matricula: {type: String, required: true},
  uid: {type: String, required: true}
}, { collection: 'professores' });

export const professorModel = mongoose.model('Professor', professorSchema);