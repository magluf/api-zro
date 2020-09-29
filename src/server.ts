import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { User } from './model/user.model';

const user = new User(1, 'Test User');

const app: Application = express();

// const readStream = fs.createReadStream(`${__dirname}/package.json`); // /home/magluf/repos/work/node-ts/package.json

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello, ${user.name}`);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
