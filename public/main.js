function filtrar(elemento, botoesAtivos) {
    if (elemento.classList=='botao'){
        if (botoesAtivos.length==1) {
            botoesAtivos[0].classList.replace('botaoAtivo', 'botao')
    }
        elemento.classList.replace("botao", "botaoAtivo")
    }else if(elemento.classList=='botaoAtivo'){
        elemento.classList.replace("botaoAtivo", "botao")
    }
    //Para capturar uma classe de um elemento usamos elemento.classList e para capturar o id usamos elemento.id
}

const formulario = document.getElementById("adicionaTarefa");

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();//impede que o envio da página seja carregado(comportamento padrão de formulário)

    const nome = document.getElementById("nome").value;
    const horario = document.getElementById("hora").value;

     try {
        const resposta = await fetch("/tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                horario: horario
            }) //estamos realizando uma requisição POST na rota /tarefas sem ser através do navegador, pois não é possível realizar requisiç~eos post através do navegador
        });

        if (!resposta.ok) {
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

        if (!resposta.ok) {
            throw new Error("Erro ao buscar tarefas");
        }

        const tarefas = await resposta.json();

        console.log(tarefas);

        const lista = document.querySelector('.tarefas');
        lista.replaceChildren()
        for (const tarefa of tarefas) {
            const novaTarefa = document.createElement('div')
            novaTarefa.classList.add('tarefa')

            const descricao = document.createElement('div')
            descricao.classList.add('descricao')

            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.name = 'feito'
            checkbox.id = `${tarefa.id}`
            checkbox.checked = Boolean(tarefa.concluido)

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