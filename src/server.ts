import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import { correctPassword } from './controllers/auth.controller';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.all('*', (req: Request, res: Response) => {
  res.status(404).send({ message: `Endpoint ${req.originalUrl} not found.` });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}...`);
});

export default app;
