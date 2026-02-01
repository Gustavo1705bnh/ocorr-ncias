const URL = https://script.google.com/macros/s/AKfycbwM_aM42jeCqqMI0f6Acr1zvn9j9QvRLHGyCJgQwC0xV5tB7sOFStQ97VBhBxAyZ88/exec;

let alunos = [];
let professorLogado = localStorage.getItem("professor");

// 🔐 LOGIN
function login() {
  const nome = document.getElementById("nome").value;
  const senha = document.getElementById("senha").value;

  if (!/^\d{6}$/.test(senha)) {
    document.getElementById("msg").innerText = "Senha deve ter 6 dígitos.";
    return;
  }

  fetch(URL, {
    method: "POST",
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
      document.getElementById("msg").innerText = "Login inválido.";
    }
  });
}

// 👨‍🎓 CARREGAR ALUNOS
if (document.getElementById("listaAlunos")) {
  fetch(URL, {
    method: "POST",
    body: JSON.stringify({ tipo: "alunos" })
  })
  .then(r => r.json())
  .then(d => {
    alunos = d;
    const lista = document.getElementById("listaAlunos");
    d.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.nome;
      lista.appendChild(opt);
    });
  });
}

// AUTOCOMPLETE
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

// 📤 ENVIAR OCORRÊNCIA
function enviarOcorrencia() {
  const aluno = document.getElementById("aluno").value;
  const turma = document.getElementById("turma").value;
  const ocorrencia = document.getElementById("ocorrencia").value;
  const telefone = document.getElementById("telefone").value;

  if (!aluno || !ocorrencia) {
    document.getElementById("msg").innerText = "Preencha todos os campos.";
    return;
  }

  const mensagem = `
📌 Ocorrência Escolar

Aluno: ${aluno}
Turma: ${turma}

Ocorrência:
${ocorrencia}
`;

  fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      tipo: "ocorrencia",
      aluno,
      turma,
      ocorrencia,
      professor: professorLogado,
      whatsapp: telefone,
      mensagem
    })
  })
  .then(r => r.json())
  .then(() => {
    document.getElementById("msg").innerText = "Ocorrência registrada com sucesso.";
    document.getElementById("ocorrencia").value = "";
  });
}
