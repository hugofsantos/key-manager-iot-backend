import * as mqtt from 'mqtt';

export default async function connectToBrokerMQTT(clientId, brokerUrl, username, password) {
  try {
    return mqtt.connect(brokerUrl, {
      clientId,
      username,
      password
    });
  }catch(error) {
    console.log('Erro ao se conectar ao broker MQTT ' + brokerUrl);
    console.log(error.message);
    throw error;
  }
}
