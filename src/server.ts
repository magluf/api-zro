import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.all('*', (req: Request, res: Response) => {
  res
    .status(404)
    .send({ message: `Endpoint ${req.method} ${req.originalUrl} not found.` });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}...`);
});

export default app;
