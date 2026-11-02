const express = require("express"); //importa o pacote Express que é instalada pelo  npm
const pool = require("./db"); //"importa" as conexões sql(pool) do db.js
const app = express(); //cria a aplicação Express.
const bodyParser = require("body-parser");
app.use(bodyParser.json()); //Quando uma requisição chega contendo  JSON, esse middleware interpreta o corpo da requisição e disponibiliza os dados em req.body, facilitando manipular o conteúdo do corpo da requisição


app.use(express.static("public"));//verifica se existe os arquivos da pasta declarada e se existir disponibiliza os arquivos dessa pasta no servidor por meio de requisições HTTP(nesse caso o frontend(pasta public))

app.get("/tarefas", async (req, res) => {
//OBS: req é a requisição http recebida e res é um objeto usado para criar a resposta que o servidor enviará para o ambiente
    try {
        //OBS: para armazenarmos as tarefas precisamos desestruturar pois o pool.query retorna dados e metadados dessa maneira -> [dados, metadados], ao desestruturar esse array com [tarefas] = await pool.query a variável tarefas receberá o valor do primeiro elemento do array, os dados
        const [tarefas] = await pool.query(
            "SELECT id, nome, TIME_FORMAT(horario, '%H:%i') AS horario, concluido FROM tarefas ORDER BY id DESC"
            //pool.query é equivalente ao cursor.execute do SQLITE, ou seja, executa scripts SQL
            //cursor.fetchall é o equivalente a linhas retornadas por await pool.query(sql)
            //OBS: não existe um equivalente de conexão do mysql com o sqlite pois o mysql gerencia diversas conexões ao mesmo tempo
            //OBS: pool é
        );
        //Promisse: é um objeto JavaScript que representa o resultado futuro de uma operação, possui tres estados: -pendente, Fulfiled(concluida) e Rejected(Concluida com erro), uma função assincrona(async function) é uma função que retorna um promisse(pode ser uma tarefa demorada (como baixar dados de um servidor, ler um arquivo ou consultar um banco de dados)), o await suspende a continuação dessa função assincrona enquanto espera o resultado da promisse sem bloquear o servidor, permitindo o node.js continuar efetuando outras operações

        res.json(tarefas); //envia os dados em formato json para o front-end
        //OBS: se não passar res.status(), o express já considera status 200

    } catch (erro) {
        console.error("Erro ao buscar tarefas:", erro);

        res.status(500).json({
            erro: "Erro interno ao buscar tarefas"
        //Nesse caso res.status(500) criando a resposta que será enviada configurando status da resposta, e o res.json() o conteúdo do corpo, nesse caso o erro
            //como da pra ver 500 é retornado quando a requisição possui dados inválidos
        });
    }
});


app.post("/tarefas", async (req, res) => {
    try {
        const { nome, horario } = req.body ?? {}; //contém o conteúdo do corpo da requisição enviado pelo cliente, após o processamento pelo middleware(bodyParser).

        if (
            typeof nome !== "string" ||
            nome.trim() === "" ||
            typeof horario !== "string" ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)
            //verifica se nome é uma string não vazia, desconsiderando espaços nas extremidades.
        ) {
            return res.status(400).json({
                erro: "Informe um nome e um horário válido (HH:MM)"
                //como da pra ver 400 é quando o servidor não consegue processar a solicitação enviada, nesse caso por conta dos dados inválidos
            });
        }

        await pool.execute(
            "INSERT INTO tarefas (nome, horario) VALUES (?, ?)",
            [nome.trim(), horario]
        /*Diferença entre pool.query e pool.execute
        Pool.query: incorpora os parametros na query antes de enviala, enviando apenas a query com os parametros já presentes
        Pool.execute, manda a query primeiro, o sql detecta o ? e então é enviado o parametro, ou seja, query e parametros são enviados separados
        Na prática pool.query é melhor para consultas sem parametros e pool.execute para execuções com passagem de parametros
        Em caso de uso de interpolação direta do parametro na query o sistema fica vulnerável a SQL Injection
        */
        );

        res.status(201).end();
            //OBS: status 201 é retornado quando um recurso é criado COM SUCESSO (nesse caso) a tarefa
            
    } catch (erro) {
        console.error("Erro ao cadastrar tarefa:", erro);

        res.status(500).json({
            erro: "Erro interno ao cadastrar tarefa"
            //como da pra ver 500 é retornado quando ocorre um erro interno ao responder a requisição
        });
    }
});

app.delete("/tarefas/:id", async (req, res) => {
    //:id especifica que id é um parametro variavel, quando ele recebe a requisição ele já joga o id para o objeto req.params
    try {
        const { id } = req.params;//captura parametros que fazem parte da URL da requisição, diferente do req.body que captura parametros que fazem parte do corpo da requisição
        const [resultado] = await pool.execute("DELETE FROM tarefas WHERE id = ?", [id])

        if (resultado.affectedRows === 0) {
            //effectedRows retorna quantas linhas foram afetadas pelo comando SQL
            return res.status(404).json({
                erro: "Tarefa não encontrada"
            });
        }
        res.status(204).end()
    }catch (erro){
        console.error('Erro ao excluir tarefa:', erro)
        res.status(500).json({
            erro: 'Erro interno ao excluir tarefa'
        })
    }
});

app.patch("/tarefas/:id", async (req, res) => {
    //patch porque estamos modificando algo que já existe
    try {
        const { id } = req.params
        const { concluido } = req.body ?? {}
        const [ resultado ] = await pool.execute('UPDATE tarefas SET concluido = ? WHERE id = ?', [concluido, id])

        if (resultado.affectedRows === 0) {
            return res.status(400).json({
                erro: "Status de tarefa não pode ser alterado"
            });
        }
        res.status(200).end()
    }catch (erro){
        console.error('Erro ao alterar status de tarefa:', erro)
        res.status(500).json({
            erro: 'Erro interno ao alterar status de tarefa'
        })
    }
})

app.listen(3000, () => { //inicia o servidor no localhost 3000
    console.log("Servidor rodando na porta 3000");
});