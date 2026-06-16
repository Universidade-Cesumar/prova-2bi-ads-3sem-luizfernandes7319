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
    lista.innerHTML += `<tr><td>${item.nome}</td><td>${item.quantidade}</td><td><button class="btn-excluir" data-id="${item.id}">Excluir</button></td></tr>`;
  })
    const botoes = document.querySelectorAll('.btn-excluir');
    botoes.forEach(botao =>{
      botao.addEventListener('click', () => {
        const id = botao.getAttribute('data-id');
        deletar(id);
      })
    })
  };

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

function validarRetirada(estoqueAtual, quantidadeRetirada) {
  if (quantidadeRetirada > estoqueAtual){
    alert('Quantidade de retirada excede o estoque atual!');
     return false;
  }else if (quantidadeRetirada <= 0){
    alert('Quantidade de retirada deve ser maior que zero!');
    return false;
  }else{
    return true;
  }
}

async function deletar(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  carregarMateriais();
}

async function baixarMaterial(id, quantidadeRetirada){
  const res = await fetch(`${API}/${id}`);
  const material = await res.json();
  if (!validarRetirada(material.quantidade, quantidadeRetirada)) { 
    alert('Estoque insuficiente ou quantidade inválida!'); return; }
  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...material, quantidade: material.quantidade - quantidadeRetirada })
  });
  carregarMateriais();
}

btnCad.addEventListener('click', cadastrar);
carregarMateriais();