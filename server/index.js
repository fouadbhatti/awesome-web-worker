import config from './config/config';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const publicPath  = config.root + 'public';
app.use(express.static(publicPath));

// Listen
app.listen(config.port, ()=> {
  console.log('Listening on', config.port);
});
