const API = 'https://6a2f0c1ec9776ca6c0c53d3f.mockapi.io/almoxarifado/enfermagem/materiais';

const lista = document.getElementById('lista-materiais');
const inputNome = document.getElementById('input-nome');
const inputQtd = document.getElementById('input-quantidade');
const inputRetirada = document.getElementById('input-retirada');
const btnCad = document.getElementById('btn-cadastrar');

async function carregarMateriais() {
  const res = await fetch(API);
  const data = await res.json();

  lista.innerHTML = '';

  data.forEach(item => {
    lista.innerHTML += `
      <tr>
        <td>${item.nome}</td>
        <td>${item.quantidade}</td>
        <td>
          <button class="btn-baixar" data-id="${item.id}">Baixar</button>
          <button class="btn-excluir" data-id="${item.id}">Excluir</button>
        </td>
      </tr>
    `;
  });
}

async function cadastrar() {
  const nome = inputNome.value;
  const quantidade = Number(inputQtd.value);

  if (!nome || quantidade <= 0) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, quantidade })
  });

  inputNome.value = '';
  inputQtd.value = '';
  carregarMateriais();
}

function validarRetirada(estoqueAtual, quantidadeRetirada) {
  const estoque = Number(estoqueAtual);
  const retirada = Number(quantidadeRetirada);

  return retirada > 0 && retirada <= estoque;
}

async function deletar(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  carregarMateriais();
}

async function baixarMaterial(id, quantidadeRetirada) {
  const res = await fetch(`${API}/${id}`);
  const material = await res.json();

  if (!validarRetirada(material.quantidade, quantidadeRetirada)) {
    alert('Estoque insuficiente ou quantidade invalida!');
    return;
  }

  const novaQuantidade = Number(material.quantidade) - Number(quantidadeRetirada);

  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...material, quantidade: novaQuantidade })
  });

  inputRetirada.value = '';
  carregarMateriais();
}

btnCad.addEventListener('click', cadastrar);

lista.addEventListener('click', event => {
  const botao = event.target;

  if (botao.classList.contains('btn-excluir')) {
    const id = botao.getAttribute('data-id');
    deletar(id);
  }

  if (botao.classList.contains('btn-baixar')) {
    const id = botao.getAttribute('data-id');
    const quantidadeRetirada = Number(inputRetirada.value);
    baixarMaterial(id, quantidadeRetirada);
  }
});

if (typeof fetch === 'function') {
  carregarMateriais();
}
