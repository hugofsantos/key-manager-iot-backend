import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export default async function connectToDatabase(host, port, database) {
  try{
    await mongoose.connect(`mongodb://${host}:${port}/${database}`,{ useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Conectado ao mongodb (host ${host}, porta ${port}, banco ${database})`);
  }catch(err) {
    console.error(`Ocorreu algum erro na conexão com o mongo: ${e.message}`)
    throw err;
  }
}