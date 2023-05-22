import * as express from 'express';
import * as dotenv from 'dotenv'

dotenv.config();
const app = express();

app.listen(process.env.APP_PORT, () => {
  console.log('BACKEND do projeto IOT iniciado');
});

