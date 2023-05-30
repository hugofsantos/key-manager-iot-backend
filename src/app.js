import express from 'express';
import * as dotenv from 'dotenv'
import connectToDatabase from './configs/mongoose.js';
import routes from './routes.js';

dotenv.config();

connectToDatabase(process.env.MONGO_HOST, process.env.MONGO_PORT, process.env.MONGO_DATABASE)
.catch(e => console.error(e.message));

const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.APP_PORT, () => {
  console.log('BACKEND do projeto IOT iniciado');
});

