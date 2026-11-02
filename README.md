# TaskFlow Fullstack

Aplicação web de gerenciamento de tarefas desenvolvida com **HTML, CSS, JavaScript, Node.js, Express e MySQL**, com foco em consolidar fundamentos de frontend e aprender a construir e consumir uma API REST.

## Por que desenvolvi este projeto?

O projeto começou como uma iniciativa pessoal para **revisar HTML, CSS e JavaScript básico** antes de avançar para estudos mais aprofundados de JavaScript e, posteriormente, React.

Durante esse processo, surgiu uma atividade da faculdade que exigia desenvolver uma aplicação com operações de CRUD, backend em Node.js e persistência em MySQL. Aproveitei a oportunidade para unir os dois objetivos: continuar praticando a construção de interfaces com CSS e JavaScript puro e, ao mesmo tempo, **aprender a criar um servidor HTTP com Express**, estruturar rotas e integrar o frontend ao banco de dados por meio de requisições HTTP.

Mais do que construir uma lista de tarefas, o objetivo foi compreender o caminho percorrido pelos dados: **interação na interface → requisição à API → operação no MySQL → atualização da interface**.

## Funcionalidades

- Cadastrar tarefas com nome e horário.
- Listar tarefas armazenadas no MySQL.
- Marcar e desmarcar tarefas como concluídas.
- Filtrar tarefas por todas, pendentes ou concluídas.
- Excluir tarefas.
- Atualizar a interface após as operações realizadas na API.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | HTML5, CSS3 e JavaScript (vanilla) |
| Servidor/API | Node.js e Express |
| Banco de dados | MySQL |
| Integração | Fetch API e JSON |

## O que aprendi e pratiquei

**Frontend:** estruturação semântica com HTML, estilização com CSS, manipulação do DOM, eventos, formulários, filtros e renderização dinâmica de elementos.

**Backend:** criação de um servidor com Express, definição de rotas HTTP, tratamento de requisições e respostas, códigos de status e middleware para interpretar JSON.

**Integração e dados:** uso de `fetch`, `async/await`, Promises, operações SQL parametrizadas com MySQL2 e persistência de dados no MySQL.

## Rotas da API

| Método | Rota | Ação |
| --- | --- | --- |
| `GET` | `/tarefas` | Lista as tarefas |
| `POST` | `/tarefas` | Cadastra uma tarefa |
| `PATCH` | `/tarefas/:id` | Atualiza o status de conclusão |
| `DELETE` | `/tarefas/:id` | Exclui uma tarefa |

Exemplo de corpo para cadastrar uma tarefa:

```json
{
  "nome": "Revisar JavaScript",
  "horario": "19:30"
}
```

Exemplo de corpo para atualizar o status:

```json
{
  "concluido": 1
}
```

## Como executar localmente

**Pré-requisitos:** Node.js, npm e MySQL instalados.

1. Clone o repositório e entre na pasta do projeto.
2. Instale as dependências com `npm install`.
3. Execute o script SQL disponibilizado no repositório para criar o banco e a tabela `tarefas`.
4. Configure a conexão com o MySQL no arquivo `db.js`, de acordo com seu ambiente local. Não publique senhas ou credenciais reais.
5. Inicie o servidor com `node server.js`.
6. Acesse `http://localhost:3000` no navegador.

> Ajuste as instruções de banco e inicialização conforme os arquivos efetivamente incluídos no repositório.

## Contexto acadêmico

O projeto também atende a uma atividade da disciplina de Desenvolvimento Frontend, realizada em grupo. Esta versão do README enfatiza meu processo de estudo e os conhecimentos praticados durante o desenvolvimento.

## Próximos passos

O projeto cumpriu seu papel como exercício de fundamentos e integração fullstack. Os conhecimentos adquiridos servem como base para estudos posteriores de JavaScript e React.
