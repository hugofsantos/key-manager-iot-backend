import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import * as dotenv from 'dotenv'
import connectToDatabase from './configs/mongoose.js';
import routes from './routes.js';
import { reservaConsumer } from './modules/reserva/index.js';
dotenv.config();

connectToDatabase(process.env.MONGO_HOST, process.env.MONGO_PORT, process.env.MONGO_DATABASE)
.catch(e => console.error(e.message));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `http://${process.env.ORIGIN_HOST}:${process.env.ORIGIN_PORT}`);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());
app.use(routes);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: `http://${process.env.ORIGIN_HOST}:${process.env.ORIGIN_PORT}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  }
});

server.listen(process.env.APP_PORT, async () => {
  console.log('BACKEND do projeto IOT iniciado');
  
  await reservaConsumer.initConsumer(
    'key-manager-iot-backend',
    `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
    process.env.MQTT_USERNAME ?? "",
    process.env.MQTT_PASSWORD ?? ""
  );  

  io.on('connection', socket => {
    console.log('Novo cliente Websocket conectado.');

    // Armazena o socket conectado
    reservaConsumer.addSocket(socket);

    // Lida com a desconexão do cliente
    socket.on('disconnect', () => {
      console.log('Cliente desconectado.');
      // Remove o socket desconectado
      reservaConsumer.removeSocket(socket);
    });
  });  
});



