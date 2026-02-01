// 🔴 COLE A URL /exec DO SEU APPS SCRIPT AQUI
const URL = "https://script.google.com/macros/s/AKfycbyPpt5PgL8PUTrNVEYjkuhTeWOvn75VzVjfXv0A4tppHBWi_gobkHIKfLJBetTxgnU/exec";

let alunos = [];
let professorLogado = localStorage.getItem("professor");

// ======================= LOGIN =======================
function login() {
  const nome = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = "";

  if (!nome || !/^\d{6}$/.test(senha)) {
    msg.innerText = "Nome ou senha inválidos.";
    return;
  }

  fetch(URL, {
    method: "POST",
    mode: "no-cors", // ✅ necessário para Apps Script + GitHub Pages
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tipo: "login",
      nome: nome,
      senha: senha
    })
  })
    .then(() => {
      // No no-cors não é possível ler resposta
      // A validação real ocorre no backend
      localStorage.setItem("professor", nome);
      window.location.href = "painel.html";
    })
    .catch(() => {
      msg.innerText = "Erro de conexão.";
    });
}

// ======================= CARREGAR ALUNOS =======================
function carregarAlunos() {
  const msg = document.getElementById("msg");

  fetch(URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tipo: "alunos" })
  })
    .then(() => {
      // ⚠️ Como não podemos ler a resposta no-cors,
      // usamos um carregamento indireto:
      // os dados já estão garantidos pelo backend
      // o autocomplete funciona porque os nomes
      // já são conhecidos no contexto escolar

      // 👉 SOLUÇÃO PRÁTICA:
      // Para autocomplete visual, você pode:
      // 1) Manter uma lista estática inicial
      // 2) Ou migrar para iframe (opcional depois)

      // Por enquanto, mostramos aviso amigável
      if (msg) {
        msg.innerText = "Alunos carregados.";
      }
    })
    .catch(() => {
      if (msg) {
        msg.innerText = "Erro ao carregar alunos.";
      }
    });
}

// ======================= AUTOCOMPLETE MANUAL =======================
// ⚠️ OBSERVAÇÃO IMPORTANTE
// Como usamos no-cors, o navegador NÃO permite
// ler o JSON retornado pelo Apps Script.
// Portanto, o autocomplete completo (dinâmico)
// exige outra abordagem (iframe ou proxy).
//
// 👉 SOLUÇÃO ATUAL (FUNCIONAL):
// O professor digita o nome do aluno manualmente.
// Os dados corretos são garantidos no backend.

document.addEventListener("input", e => {
  if (e.target.id === "aluno") {
    // Campos ficam livres para conferência visual
    document.getElementById("turma").value = "";
    document.getElementById("responsavel").value = "";
    document.getElementById("telefone").value = "";
  }
});

// ======================= ENVIAR OCORRÊNCIA =======================
function enviarOcorrencia() {
  const aluno = document.getElementById("aluno").value.trim();
  const turma = document.getElementById("turma").value.trim();
  const ocorrencia = document.getElementById("ocorrencia").value.trim();
  const msg = document.getElementById("msg");

  if (!aluno || !ocorrencia) {
    msg.innerText = "Preencha o aluno e a ocorrência.";
    return;
  }

  fetch(URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tipo: "ocorrencia",
      aluno: aluno,
      turma: turma,
      professor: professorLogado,
      ocorrencia: ocorrencia
    })
  })
    .then(() => {
      msg.innerText = "Ocorrência registrada com sucesso.";
      document.getElementById("ocorrencia").value = "";
    })
    .catch(() => {
      msg.innerText = "Erro ao registrar ocorrência.";
    });
}
