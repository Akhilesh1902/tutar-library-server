import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoDBIntegration } from './mongo.js';
import { AWSInstance } from './awsIntegration.js';
import bodyParcer from 'body-parser';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParcer.json());
app.use(bodyParcer.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3030;
const CORS = {
  origin: ['https://tutar-webapp.netlify.app', 'http://localhost:3000'],
};
const server = http.createServer(app, { cors: CORS });

//monog connections
const MongoURL = process.env.MONGO_DB_CONNECTION_URL;
const databaseName = 'tutAR-webApp-db';
const mongoDBClient = new MongoDBIntegration(MongoURL, databaseName);

//aws connections

const AWS_Access_Id = process.env.AWS_ACCESS_ID;
const AWS_Access_key = process.env.AWS_ACCESS_KEY;
const region = 'ap-south-1';
const awsInstance = new AWSInstance(region, AWS_Access_Id, AWS_Access_key);

app.get('/', (req, res) => {
  res.send('This is the home page for the tutar library server');
});

app.get('/model-metadata', async (req, res) => {
  res.send(await mongoDBClient._getCollectionData('model-metadata'));
});
app.get('/alluser', async (req, res) => {
  res.send(await mongoDBClient._getCollectionData('userData'));
});

app.get('/models/:modelName', async (req, res) => {
  res.send({
    modelName: req.params.modelName,
    model: await awsInstance.getObject('models/' + req.params.modelName),
  });
});

app.post('/login', async (req, res) => {
  const { username } = req.body;
  console.log({ username });
  const userData = await mongoDBClient._getCollectionData('userData');
  const data = userData.find((data) => data.username === username);

  if (data) {
    res.send({ ...data, statusCode: 200 });
  } else
    res.status(401).send({
      error: 'invalid user',
      description: 'Please enter valid username and password',
    });
});

const downloadHandeler = async (data, type, messages) => {
  const user = (await mongoDBClient._getCollectionData('userData')).find(
    (item) => item.username === data.username
  );
  console.log({ user });
  if (user[type].includes(data.name)) {
    return {
      status: 200,
      message: (type = 'requestedModels'
        ? 'You already requseted please wait for the admin to confirm your request'
        : 'You already approved this model'),
    };
  }
  const newData = {
    ...user,
    [type]: [...user.requestedModels, data.name],
  };
  const resp = await mongoDBClient.addData(newData, 'userData');
  return {
    status: 200,
    message: (type = 'requestedModels'
      ? 'Your request is received please wait for the admin to confirm your request'
      : 'Your approval is received in the server'),
  };
};

app.post('/reqdownload', async (req, res) => {
  const { body } = req;
  console.log(body);

  const result = await downloadHandeler(body, 'requestedModels');
  res.send(result);
});

app.post('/approveDownload', async (req, res) => {
  const { body } = req;
  const user = (await mongoDBClient._getCollectionData('userData')).find(
    (item) => (item.username = body.username)
  );
});

app.post('/adduser', async (req, res) => {
  const { body } = req;
  console.log(body);
  res.send(await mongoDBClient.addData(body, 'userData'));
});

server.listen(PORT, () => {
  console.log('connected to port ' + PORT);
});
