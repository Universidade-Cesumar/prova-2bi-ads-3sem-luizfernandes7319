const API = 'https://6a2f0c1ec9776ca6c0c53d3f.mockapi.io/almoxarifado/enfermagem/materiais';

const lista = document.getElementById('lista-materiais');
const inputNome = document.getElementById('input-nome');
const inputQtd = document.getElementById('input-quantidade');
const btnCad = document.getElementById('btn-cadastrar');

async function carregarMateriais() {
  const res = await fetch(API);
  const data = await res.json();
  lista.innerHTML = '';
  data.forEach(item => {
    lista.innerHTML += `<tr><td>${item.nome}</td><td>${item.quantidade}</td></tr>`;
  });
}

async function cadastrar() {
  const nome = inputNome.value;
  const quantidade = inputQtd.value;
  if (!nome || !quantidade) return alert('Preencha todos os campos!');
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, quantidade })
  });
  inputNome.value = '';
  inputQtd.value = '';
  carregarMateriais();
}

btnCad.addEventListener('click', cadastrar);
carregarMateriais();