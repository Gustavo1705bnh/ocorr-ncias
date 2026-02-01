const URL = "COLE_AQUI_A_URL_EXEC_DO_APPS_SCRIPT";

let alunos = [];
let professorLogado = localStorage.getItem("professor");

// ================= LOGIN =================
function login() {
  const nome = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = "";

  if (!/^\d{6}$/.test(senha)) {
    msg.innerText = "Senha deve ter 6 dígitos.";
    return;
  }

  fetch(URL, {
    method: "POST",
    mode: "cors", // 🔴 ESSENCIAL NO GITHUB PAGES
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tipo: "login",
      nome: nome,
      senha: senha
    })
  })
    .then(r => {
      if (!r.ok) throw new Error("Falha HTTP");
      return r.json();
    })
    .then(d => {
      if (d.status === "ok") {
        localStorage.setItem("professor", d.nome);
        window.location.href = "painel.html";
      } else {
        msg.innerText = "Login inválido.";
      }
    })
    .catch(err => {
      console.error(err);
      msg.innerText = "Erro de conexão.";
    });
}
