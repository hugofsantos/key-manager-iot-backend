import express from 'express';
import * as dotenv from 'dotenv'
import connectToDatabase from './configs/mongoose.js';
import routes from './routes.js';
import { reservaConsumer } from './modules/reserva/index.js';

dotenv.config();

connectToDatabase(process.env.MONGO_HOST, process.env.MONGO_PORT, process.env.MONGO_DATABASE)
.catch(e => console.error(e.message));

const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.APP_PORT, async () => {
  console.log('BACKEND do projeto IOT iniciado');

  await reservaConsumer.initConsumer(
    'key-manager-iot-backend',
    `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
    process.env.MQTT_USERNAME ?? "",
    process.env.MQTT_PASSWORD ?? ""
  );  
});



