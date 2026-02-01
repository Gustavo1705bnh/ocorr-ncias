const URL = "https://script.google.com/macros/s/AKfycbyM0bVNAtkgJb6vnfMP4yLOivlEn7yvLsPtszLcnBCH6G2c2ZXTIlVcK8eGbuwRSg/exec";

let alunos = [];
let professorLogado = localStorage.getItem("professor");

// ================= LOGIN =================
function login() {
  const nome = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

  if (!/^\d{6}$/.test(senha)) {
    msg.innerText = "Senha deve ter 6 dígitos numéricos.";
    return;
  }

  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo: "login",
      nome,
      senha
    })
  })
    .then(r => r.json())
    .then(d => {
      if (d.status === "ok") {
        localStorage.setItem("professor", d.nome);
        window.location.href = "painel.html";
      } else {
        msg.innerText = "Login inválido.";
      }
    })
    .catch(() => {
      msg.innerText = "Erro de conexão.";
    });
}

// ================= CARREGAR ALUNOS =================
function carregarAlunos() {
  if (!document.getElementById("listaAlunos")) return;

  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo: "alunos" })
  })
    .then(r => r.json())
    .then(d => {
      alunos = d;
      const lista = document.getElementById("listaAlunos");
      lista.innerHTML = "";

      d.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.nome;
        lista.appendChild(opt);
      });
    });
}

// ================= AUTOCOMPLETE =================
document.addEventListener("input", e => {
  if (e.target.id === "aluno") {
    const a = alunos.find(x => x.nome === e.target.value);
    if (a) {
      document.getElementById("turma").value = a.turma;
      document.getElementById("responsavel").value = a.responsavel;
      document.getElementById("telefone").value = a.whatsapp;
    }
  }
});

// ================= ENVIAR OCORRÊNCIA =================
function enviarOcorrencia() {
  const aluno = document.getElementById("aluno").value;
  const turma = document.getElementById("turma").value;
  const ocorrencia = document.getElementById("ocorrencia").value;
  const msg = document.getElementById("msg");

  if (!aluno || !ocorrencia) {
    msg.innerText = "Preencha todos os campos.";
    return;
  }

  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo: "ocorrencia",
      aluno,
      turma,
      professor: professorLogado,
      ocorrencia
    })
  })
    .then(r => r.json())
    .then(d => {
      if (d.status === "ok") {
        msg.innerText = "Ocorrência registrada com sucesso.";
        document.getElementById("ocorrencia").value = "";
      } else {
        msg.innerText = "Erro ao registrar.";
      }
    });
}

// ================= AUTO =================
document.addEventListener("DOMContentLoaded", carregarAlunos);
