import { getConexaoBD } from "./conexao.js";

export async function inserirUsuario(){
    let conexao = await getConexaoBD();

    const [results] = await conexao.execute(
        "INSERT INTO tabela (campo1, campo2) VALUES (?, ?)"
        [valor1, valor2]
    );
    if (results.affectedRows>0){
        //Comando deu certo
    }
}
