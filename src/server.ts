import express, {Express, Request, Response} from 'express';
import userRouter from './routes/user';

const app: Express = express();
const port = 3000;

app.use('/user',userRouter);

app.listen(port, ()=> {
    console.log(`[Server]: I am running at https://localhost:${port}`);
});