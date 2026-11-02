function filtrar(filtro) {
    const elemento = document.querySelector(`[data-filtro="${filtro}"`)
    const botoesAtivos = document.getElementsByClassName('botaoAtivo')
    if (elemento.classList.contains("botao")){
        if (botoesAtivos.length==1) {
            botoesAtivos[0].classList.replace('botaoAtivo', 'botao')
    }
        elemento.classList.replace("botao", "botaoAtivo")
    }
    //Para capturar uma classe de um elemento usamos elemento.classList e para capturar o id usamos elemento.id
    carregarTarefas()
}
const formulario = document.getElementById("adicionaTarefa");

formulario.addEventListener("submit", async (event) => {
//addEventListener registra uma função que para ser executada quando uma ação ocorrer nesse caso submit,a  estrutura é ("acao que sera executada", funcao())
//event é um objeto criado pelo navegador quando um evento acontece, ele contém informações sobre o evento, é como se "capturassemos" o evento e colocassemos em um objeto, podendo manipular esse evento, como fazemos em event.preventDefault(). onde barramos o comportamento padrão de formulario
//OBS: além de addEventListener para realizarmos uma função quando determinada ação occore com um elemento podemos utilizar onAcao="funcao()" no html, porém essa alternativa nos permite realizar apenas uma função, o addEventListener caso seja declarado duas vezes com o mesmo elemento executará as duas funções ao mesmo tempo

    event.preventDefault();//impede que o envio da página seja carregado(comportamento padrão de formulário)

    const nome = document.getElementById("nome").value;
    const horario = document.getElementById("hora").value;

     try {
        const resposta = await fetch("/tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
                //Mais precisamente, esse cabeçalho informa ao servidor qual é o formato dos dados enviados no corpo da requisição.
            },
            body: JSON.stringify({ //transfoma o objeto js em uma string no formato JSON
            //JSON.parse é o processo inverso(transforma string em elemento JS)
                nome: nome,
                horario: horario
            }) //estamos realizando uma requisição POST na rota /tarefas sem ser através do navegador, pois não é possível realizar requisiç~eos post através do navegador
        });

        if (!resposta.ok) {
            //resposta.ok verifica se o status HTTP da resposta está na faixa de 200 a 299(sem "erros"), nesse caso como é not(!) resposta.ok caso ele não esteja entre 200 e 299 será disparado um erro
            throw new Error("Não foi possível cadastrar a tarefa");
            //Cria e lança um erro, transferindo a execução para o catch
        }

        console.log("Tarefa cadastrada com sucesso!");

        formulario.reset(); //limpa os campos do formulário
        await carregarTarefas();

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível cadastrar a tarefa.");
    }
});

async function carregarTarefas() {
    try {
        const resposta = await fetch("/tarefas");
        //se não passarmo so segundo parametro o JS já entende como GET
        //aqui o objeto res do Express se torna um objeto response do navegador ou seja no server.js a resposta é um objeto res do express e quando passa para o frontend(main.js) passa a ser um objeto response do navegador

        if (!resposta.ok) {
            throw new Error("Erro ao buscar tarefas");
        }

        const tarefas = await resposta.json(); //resgata o conteúdo do corpo da resposta, lendo e interpretando

        const filtroAtual = document.querySelector(".botaoAtivo").dataset.filtro;//retorna o valor(data-filtro) do filtro que está ativo(todos, pendentes ou concluidas)

        /*
        resposta.json(): lê o conteúdo do corpo da resposta, e
        e interpreta a string transformando em elemento javascript

        JSON.parse(dado): apenas converte, não le corpo de requisição
        */

        const lista = document.querySelector('.tarefas');
        lista.replaceChildren()
        for (const tarefa of tarefas) {
            if (filtroAtual=='pendentes' && tarefa.concluido==1){
                continue
            }else if (filtroAtual=='concluidas' && tarefa.concluido==0){
                continue
            }

            const novaTarefa = document.createElement('div')
            novaTarefa.classList.add('tarefa')

            const descricao = document.createElement('div')
            descricao.classList.add('descricao')

            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            if (tarefa.concluido==1){
                checkbox.checked = true
            }
            checkbox.name = 'concluido'
            checkbox.id = `${tarefa.id}`
            checkbox.addEventListener("click", async () => {
        try{
            const resposta = await fetch(`/tarefas/${tarefa.id}`, {
                method: "PATCH",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                        concluido: checkbox.checked ? 1 : 0
                    })
            })
            if (!resposta.ok) {
                throw new Error("Não foi possível alterar o status");
            }
            await carregarTarefas(); 
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Não foi possível alterar o status da tarefa.");
            await carregarTarefas();
            
        }
        })

            const nome = document.createElement('label')
            nome.htmlFor = checkbox.id;
            nome.textContent = `${tarefa.nome}`

            const span = document.createElement('span')
            span.classList.add('horario')
            span.textContent = `${tarefa.horario}`

           const excluir = document.createElement('button');
           excluir.type = 'button';
           excluir.classList.add('excluir');
           excluir.textContent = 'Excluir';
           excluir.addEventListener("click", async (event) => {
            const id = tarefa.id
            try {
                const resposta = await fetch(`/tarefas/${tarefa.id}`, {
                method: "DELETE"
                });
                if (!resposta.ok) {
                    throw new Error("Não foi possível excluir está tarefa");
            }
            await carregarTarefas();

            }catch (erro){
                console.error("Erro:", erro);
                alert("Não foi possível excluir a tarefa.");
            }

           })
            
            descricao.appendChild(checkbox)
            descricao.appendChild(nome)
            novaTarefa.appendChild(descricao)
            novaTarefa.appendChild(span)
            novaTarefa.appendChild(excluir)
            lista.appendChild(novaTarefa)
        }

    } catch (erro) {
        console.error("Erro:", erro);
    }
}

carregarTarefas();