//Conectar a um banco de dados////////////////////////////////////////////////
import mysql from 'mysql2/promise';

let connection = null;

export async function getConexaoBD(){
    if(connection=null){
        connection = await mysql.createConnection({
            host: "localhost",
            user: "seuUsuario",
            password: "suaSenha",
            database: "seuBancoDeDados",
            dateStrings: true //Formata as datas e horas para yyyy-mm-dd HH:mm:ss
        });
    }
    return connection;
}
