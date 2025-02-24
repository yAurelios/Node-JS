import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
//import { enableJWTAuthenticationMiddleware } from './auth.js';

const app = express();

app.use(cors(
    {
        origin: 'http://127.0.0.1:5500',
        credentials: true,
    }
));

app.use(cookieParser()); 

app.use(express.json()); 

app.get('/', async (req, res) => {
    //let conteudoRequisicao = req.body;
    //res.status(200).json("{}");
    res.status(200).send("FUNCIONA!!!");
});

//Descomente este comando caso queira habilitar segurança por meio de tokens JWT
//enableJWTAuthenticationMiddleware({ app: app, validateUserFunction: validarUsuario });

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});