const express = require("express"); //importa o pacote Express que é instalada pelo  npm
const pool = require("./db"); //"importa" a conexão sql do db.js
const app = express(); //cria a aplicação Express.
const bodyParser = require("body-parser");
app.use(bodyParser.json()); //Quando uma requisição chega contendo  JSON, esse middleware interpreta o corpo da requisição e disponibiliza os dados em req.body, facilitando manipular o conteúdo do corpo da requisição


app.use(express.static("public"));//verifica se existe os arquivos da pasta declarada e se existir disponibiliza os arquivos dessa pasta no servidor por meio de requisições HTTP(nesse caso o frontend(pasta public))

app.get("/tarefas", async (req, res) => {
    try {
        const [tarefas] = await pool.query(
            "SELECT id, nome, TIME_FORMAT(horario, '%H:%i') AS horario, concluido FROM tarefas ORDER BY id DESC"
            //pool.query é equivalente ao cursor.execute do SQLITE, ou seja, executa scripts SQL
            //cursor.fetchall é o equivalente a linhas retornadas por await pool.query(sql)
            //OBS: não existe um equivalente de conexão do mysql com o sqlite pois o mysql gerencia diversas conexões ao mesmo tempo
        );
        //Promisse: é um objeto JavaScript que representa o resultado futuro de uma operação, possui tres estados: -pendente, Fulfiled(concluida) e Rejected(Concluida com erro), uma função assincrona(async function) é uma função que retorna um promisse(pode ser uma tarefa demorada (como baixar dados de um servidor, ler um arquivo ou consultar um banco de dados)), o await suspende a continuação dessa função assincrona enquanto espera o resultado da promisse sem bloquear o servidor, permitindo o node.js continuar efetuando outras operações

        res.json(tarefas); //envia os dados em formato json para o front-end

    } catch (erro) {
        console.error("Erro ao buscar tarefas:", erro);

        res.status(500).json({
            erro: "Erro interno ao buscar tarefas"
            //como da pra ver 500 é retornado quando a requisição possui dados inválidos
        });
    }
});


app.post("/tarefas", async (req, res) => {
    try {
        const { nome, horario } = req.body ?? {}; //contém os dados enviados pelo cliente, após o processamento pelo middleware.

        if (
            typeof nome !== "string" ||
            nome.trim() === "" ||
            typeof horario !== "string" ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)
            //verifica se nome é uma string não vazia, desconsiderando espaços nas extremidades.
        ) {
            return res.status(400).json({
                erro: "Informe um nome e um horário válido (HH:MM)"
                //como da pra ver 400 é retornado quando a requisição possui dados inválidos
            });
        }

        const [resultado] = await pool.execute(
            "INSERT INTO tarefas (nome, horario) VALUES (?, ?)",
            [nome.trim(), horario]
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

app.listen(3000, () => { //inicia o servidor no localhost 3000
    console.log("Servidor rodando na porta 3000");
});