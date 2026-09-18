/* ==========================================================================
   contato.js
   Responsabilidade única: validar e processar o formulário de contato.
   ========================================================================== */

/**
 * Representa uma mensagem de contato enviada pelo site.
 */
class Cliente {
  constructor(nome, email, telefone, assunto, mensagem) {
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.assunto = assunto;
    this.mensagem = mensagem;
    this.enviadoEm = new Date().toISOString();
  }
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validadores = {
  nome: (valor) => valor.trim().length >= 3,
  email: (valor) => REGEX_EMAIL.test(valor.trim()),
  telefone: (valor) => valor.replace(/\D/g, "").length >= 10,
  assunto: (valor) => valor !== "",
  mensagem: (valor) => valor.trim().length >= 10,
};

const mensagensErro = {
  nome: "Informe seu nome completo.",
  email: "Digite um e-mail válido (ex: nome@exemplo.com).",
  telefone: "Telefone incompleto. Use (xx) xxxxx-xxxx.",
  assunto: "Selecione um assunto.",
  mensagem: "Escreva ao menos 10 caracteres.",
};

function inicializarContato() {
  const form = document.querySelector("#form-contato");
  if (!form) return;

  const campoTelefone = form.querySelector("#telefone");
  campoTelefone?.addEventListener("input", () => {
    campoTelefone.value = formatarTelefone(campoTelefone.value);
  });

  Object.keys(validadores).forEach((nomeCampo) => {
    const campo = form.querySelector(`#${nomeCampo}`);
    campo?.addEventListener("blur", () => validarCampo(form, nomeCampo));
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const camposValidos = Object.keys(validadores).map((nomeCampo) => validarCampo(form, nomeCampo));

    if (!camposValidos.every(Boolean)) {
      form.querySelector(".is-invalid")?.focus();
      return;
    }

    const cliente = new Cliente(
      form.nome.value.trim(),
      form.email.value.trim(),
      form.telefone.value.trim(),
      form.assunto.value,
      form.mensagem.value.trim()
    );

    salvarMensagem(cliente);
    exibirConfirmacao(form);
    form.reset();
  });
}

function validarCampo(form, nomeCampo) {
  const campo = form.querySelector(`#${nomeCampo}`);
  const erroEl = form.querySelector(`[data-erro-de="${nomeCampo}"]`);
  const valido = validadores[nomeCampo](campo.value);

  campo.classList.toggle("is-invalid", !valido);
  if (erroEl) {
    erroEl.textContent = valido ? "" : mensagensErro[nomeCampo];
    erroEl.classList.toggle("is-visible", !valido);
  }

  return valido;
}

function formatarTelefone(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);

  if (digitos.length <= 2) return digitos.replace(/^(\d*)/, "($1");
  if (digitos.length <= 6) return digitos.replace(/^(\d{2})(\d*)/, "($1) $2");
  if (digitos.length <= 10) return digitos.replace(/^(\d{2})(\d{4})(\d*)/, "($1) $2-$3");
  return digitos.replace(/^(\d{2})(\d{5})(\d*)/, "($1) $2-$3");
}

function salvarMensagem(cliente) {
  try {
    const historico = JSON.parse(localStorage.getItem("graovivo.mensagens") || "[]");
    historico.push(cliente);
    localStorage.setItem("graovivo.mensagens", JSON.stringify(historico));
  } catch (erro) {
    console.error("Não foi possível salvar a mensagem:", erro);
  }
}

function exibirConfirmacao(form) {
  const caixa = form.querySelector(".confirm-box");
  if (!caixa) return;
  caixa.textContent = "Mensagem enviada! Respondemos em até 1 dia útil.";
  caixa.classList.add("is-visible");

  setTimeout(() => caixa.classList.remove("is-visible"), 5000);
}

document.addEventListener("DOMContentLoaded", inicializarContato);
