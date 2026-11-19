// CONTROLE DAS TELAS

const telas = document.querySelectorAll(".tela");
const menuInferior = document.getElementById("menuInferior");

function mostrarTela(id) {

    telas.forEach(tela => {
        tela.classList.remove("ativa");
    });

    document.getElementById(id).classList.add("ativa");

    const mostrarMenu = id === "inicio" || id === "perfil";
    menuInferior.classList.toggle("visivel", mostrarMenu);

    document.querySelectorAll(".menu-inferior button").forEach(botao => {
        botao.classList.toggle("ativo", botao.dataset.tela === id);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-tela]").forEach(botao => {
    botao.addEventListener("click", function(event) {
        event.preventDefault();
        mostrarTela(this.dataset.tela);
    });
});


// CONTA DE DEMONSTRAÇÃO

let contaDemo = null;


// VALIDAR E-MAIL

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// LOGIN

document.getElementById("formLogin").addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;
    const erro = document.getElementById("erroLogin");

    erro.textContent = "";

    if (!emailValido(email)) {
        erro.textContent = "Digite um e-mail válido.";
        return;
    }

    if (!contaDemo) {
        erro.textContent = "Crie sua conta primeiro nesta demonstração.";
        return;
    }

    if (email !== contaDemo.email || senha !== contaDemo.senha) {
        erro.textContent = "E-mail ou senha incorretos.";
        return;
    }

    document.getElementById("nomeInicio").textContent = contaDemo.nome;
    document.getElementById("nomePerfil").textContent = contaDemo.nome;
    document.getElementById("perfilNome").value = contaDemo.nome;
    document.getElementById("perfilEmail").value = contaDemo.email;

    mostrarTela("inicio");
});


// CADASTRO

const senhaCadastro = document.getElementById("cadastroSenha");

senhaCadastro.addEventListener("input", function() {

    const senha = senhaCadastro.value;

    const temTamanho = senha.length >= 8;
    const temLetrasNumeros = /[A-Za-zÀ-ÿ]/.test(senha) && /\d/.test(senha);
    const temDoze = senha.length >= 12;

    const pontos = Number(temTamanho) +
                   Number(temLetrasNumeros) +
                   Number(temDoze);

    document.getElementById("barra1").classList.toggle("ativa", pontos >= 1);
    document.getElementById("barra2").classList.toggle("ativa", pontos >= 2);
    document.getElementById("barra3").classList.toggle("ativa", pontos >= 3);

    document.getElementById("forcaTexto").textContent =
        pontos === 3 ? "Senha forte" :
        pontos === 2 ? "Senha média" :
        pontos === 1 ? "Senha fraca" : "Digite sua senha";

    document.getElementById("reqTamanho").style.color =
        temTamanho ? "#704493" : "#bd4b05";

    document.getElementById("reqNumero").style.color =
        temLetrasNumeros ? "#704493" : "#bd4b05";
});

document.getElementById("formCadastro").addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("cadastroNome").value.trim();
    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = senhaCadastro.value;
    const confirmacao = document.getElementById("confirmarSenha").value;
    const erro = document.getElementById("erroCadastro");

    erro.textContent = "";

    if (!nome) {
        erro.textContent = "Digite seu nome.";
        return;
    }

    if (!emailValido(email)) {
        erro.textContent = "Digite um e-mail válido.";
        return;
    }

    if (senha.length < 8) {
        erro.textContent = "A senha precisa ter pelo menos 8 caracteres.";
        return;
    }

    if (!/[A-Za-zÀ-ÿ]/.test(senha) || !/\d/.test(senha)) {
        erro.textContent = "A senha precisa ter letras e números.";
        return;
    }

    if (senha !== confirmacao) {
        erro.textContent = "As senhas não coincidem.";
        return;
    }

    contaDemo = { nome, email, senha };

    document.getElementById("sucessoCadastro").hidden = false;
});


// RECUPERAÇÃO DE SENHA

document.getElementById("formRecuperacao").addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("recuperacaoEmail").value.trim();
    const erro = document.getElementById("erroRecuperacao");

    erro.textContent = "";

    if (!emailValido(email)) {
        erro.textContent = "Digite um e-mail válido.";
        return;
    }

    document.getElementById("emailDestino").textContent =
        "E-mail informado: " + email;

    document.getElementById("sucessoRecuperacao").hidden = false;

    iniciarContador();
});

let tempoContador;

function iniciarContador() {

    clearInterval(tempoContador);

    let segundos = 15 * 60;

    function atualizar() {

        const minutos = Math.floor(segundos / 60);
        const resto = segundos % 60;

        document.getElementById("contador").textContent =
            minutos + ":" + String(resto).padStart(2, "0");

        if (segundos <= 0) {
            clearInterval(tempoContador);
            document.getElementById("contador").textContent = "Expirado";
            return;
        }

        segundos--;
    }

    atualizar();
    tempoContador = setInterval(atualizar, 1000);
}

document.getElementById("reenviar").addEventListener("click", iniciarContador);


// PERFIL

document.querySelectorAll(".estilo").forEach(botao => {

    botao.addEventListener("click", function() {
        this.classList.toggle("selecionado");
    });

});

document.getElementById("formPerfil").addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("perfilNome").value.trim();
    const email = document.getElementById("perfilEmail").value.trim();
    const erro = document.getElementById("erroPerfil");

    erro.textContent = "";

    if (!nome || !emailValido(email)) {
        erro.textContent = "Confira o nome e o e-mail.";
        return;
    }

    document.getElementById("nomePerfil").textContent = nome;
    document.getElementById("nomeInicio").textContent = nome;

    if (contaDemo) {
        contaDemo.nome = nome;
        contaDemo.email = email;
    }

    alert("Alterações salvas nesta demonstração!");
});


// FOTO DE PERFIL

document.getElementById("alterarFoto").addEventListener("change", function() {

    const arquivo = this.files[0];

    if (!arquivo) return;

    const endereco = URL.createObjectURL(arquivo);

    document.querySelectorAll(".foto-perfil, .avatar-pequeno").forEach(imagem => {
        imagem.src = endereco;
    });
});


// CONFIRMAÇÃO DEMONSTRATIVA DO E-MAIL

document.getElementById("confirmarEmail").addEventListener("click", function() {

    const codigo = document.getElementById("codigoVerificacao").value;

    if (codigo.length !== 6) {
        alert("Digite o código de 6 números.");
        return;
    }

    alert("Código aceito nesta demonstração. A confirmação real depende de um servidor.");
});


// FAVORITAR LOOKS

document.querySelectorAll(".favorito").forEach(botao => {

    botao.addEventListener("click", function() {
        this.classList.toggle("marcado");
        this.textContent = this.classList.contains("marcado") ? "♥" : "♡";
    });

});


// BOTÕES DA TELA INICIAL

document.getElementById("filtrarLooks").addEventListener("click", function() {
    alert("Em breve você poderá filtrar os looks por ocasião e estilo!");
});

document.getElementById("criarLook").addEventListener("click", function() {
    alert("Em breve você poderá criar novas combinações!");
});


// MENU INFERIOR

document.getElementById("menuPecas").addEventListener("click", function() {
    alert("Área de peças em desenvolvimento.");
});

document.getElementById("menuLooks").addEventListener("click", function() {
    mostrarTela("inicio");
});

document.getElementById("menuArmario").addEventListener("click", function() {
    alert("Área do armário em desenvolvimento.");
});


// SAIR DA CONTA

document.getElementById("sairConta").addEventListener("click", function() {
    mostrarTela("login");
});