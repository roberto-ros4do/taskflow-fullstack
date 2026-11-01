function cadastrarTarefa(nome, hora) {
    if (nome.value=='') {
        alert('Obrigatório declarar nome da tarefa!')
    }
    if (hora.value==''){
        alert('Obrigatório declarar hora da tarefa')
    }
}

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