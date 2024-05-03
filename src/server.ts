import 'express-async-errors';
import express, {Express, Request, Response} from 'express';
import userRouter from './routes/userRouter';
import BodyParser from 'body-parser';
import { errorMiddleware } from './middleware/errors';
import "reflect-metadata"
import { AppDataSource } from './data-source';
import * as dotenv from 'dotenv'
import shortenerRoute from './routes/shortenerRouter';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

dotenv.config()
AppDataSource.initialize().then(() =>{
        const options = {
            definition: {
            openapi: '3.0.0',
            info: {
                title: 'Desafio Teddy',
                version: '1.0.0',
            },
            },
            servers: [
                {
                  url: 'http://localhost:3000',
                  description: 'Development server',
                },
              ],
            apis: ['./src/routes/*.ts'],
        };
      
        const openapiSpecification = swaggerJsdoc(options);
        const app: Express = express();
        const port = process.env.PORT;
        app.use( BodyParser.urlencoded( { extended: false } ) );
        app.use( BodyParser.json() );
        app.use("/", shortenerRoute)
        app.use("/", userRouter);
        app.use("/docs", swaggerUI.serve, swaggerUI.setup(openapiSpecification))
        app.use(errorMiddleware)
        
        app.listen(port, ()=> {
            console.log(`[Server]: I am running at https://localhost:${port}`);
        });
    }
)

