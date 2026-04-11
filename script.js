// ============================================
// SISTEMA X-MERCADO
// ============================================

// Estado Global
let estadoApp = {
  clienteAtual: null,
  adminAtual: null,
  carrinho: [],
  produtos: [],
  pedidos: [],
  clientes: [],
  lojas: [],
  taxaEntrega: 5.00
};

// ============================================
// INICIALIZAÇÃO
// ============================================

window.addEventListener('DOMContentLoaded', () => {
  carregarDadosDoStorage();
  atualizarPromocoesPadrao();
  inicializarProdutos();
  verificarSessao();
  carregarPromocoes();
});

function carregarDadosDoStorage() {
  const clientes = localStorage.getItem('clientes');
  const lojas = localStorage.getItem('lojas');
  const produtos = localStorage.getItem('produtos');
  const pedidos = localStorage.getItem('pedidos');

  if (clientes) estadoApp.clientes = JSON.parse(clientes);
  if (lojas) estadoApp.lojas = JSON.parse(lojas);
  if (produtos) estadoApp.produtos = JSON.parse(produtos);
  if (pedidos) estadoApp.pedidos = JSON.parse(pedidos);
}

function salvarEmStorage() {
  localStorage.setItem('clientes', JSON.stringify(estadoApp.clientes));
  localStorage.setItem('lojas', JSON.stringify(estadoApp.lojas));
  localStorage.setItem('produtos', JSON.stringify(estadoApp.produtos));
  localStorage.setItem('pedidos', JSON.stringify(estadoApp.pedidos));
}

function atualizarPromocoesPadrao() {
  const padrao = {
    3: { promo: true, desconto: 20, descricao: 'Promoção especial de início de semana.' },
    5: { promo: true, desconto: 25, descricao: 'Economize no básico da cozinha.' },
    8: { promo: true, desconto: 15, descricao: 'Perfeito para seu café da manhã.' }
  };

  estadoApp.produtos = estadoApp.produtos.map(produto => {
    if (padrao[produto.id]) {
      return { ...produto, ...padrao[produto.id] };
    }
    return produto;
  });
}

function verificarSessao() {
  const clienteSessao = localStorage.getItem('clienteSessao');
  const adminSessao = localStorage.getItem('adminSessao');

  if (clienteSessao) {
    estadoApp.clienteAtual = JSON.parse(clienteSessao);
    mostrarDashboardCliente();
  }

  if (adminSessao) {
    estadoApp.adminAtual = JSON.parse(adminSessao);
    mostrarDashboardAdmin();
  }
}

// ============================================
// NAVEGAÇÃO
// ============================================

function goToSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
  
  // Fechar menu mobile após navegação
  const navbarMenu = document.getElementById('navbarMenu');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  if (window.innerWidth <= 768) {
    navbarMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
  }
}

function toggleMenu() {
  const navbarMenu = document.getElementById('navbarMenu');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  navbarMenu.classList.toggle('active');
  hamburgerBtn.classList.toggle('active');
}

// Fechar menu mobile ao redimensionar para desktop
window.addEventListener('resize', () => {
  const navbarMenu = document.getElementById('navbarMenu');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  if (window.innerWidth > 768) {
    navbarMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
  }
});

// Fechar menu mobile ao clicar fora
document.addEventListener('click', (e) => {
  const navbarMenu = document.getElementById('navbarMenu');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navbar = document.querySelector('.navbar');
  
  if (!navbar.contains(e.target) && window.innerWidth <= 768) {
    navbarMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
  }
});

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  
  event.target.classList.add('active');
  
  if (tab === 'login') {
    document.getElementById('loginForm').classList.add('active');
  } else {
    document.getElementById('registerForm').classList.add('active');
  }
}

function switchAdminTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  
  event.target.classList.add('active');
  
  if (tab === 'login') {
    document.getElementById('adminLoginForm').classList.add('active');
  } else {
    document.getElementById('registerLojaForm').classList.add('active');
  }
}

function switchClientTab(tab) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dashboard-content').forEach(c => c.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(tab + 'Tab').classList.add('active');

  if (tab === 'carrinho') atualizarCarrinho();
  if (tab === 'pedidos') carregarPedidosCliente();
  if (tab === 'pontos') atualizarPontos();
}

function switchAdminPanel(panel) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById('admin' + panel.charAt(0).toUpperCase() + panel.slice(1)).classList.add('active');

  if (panel === 'produtos') carregarProdutosAdmin();
  if (panel === 'pedidos') carregarPedidosAdmin();
  if (panel === 'clientes') carregarClientesAdmin();
  if (panel === 'funcionarios') carregarFuncionariosAdmin();
}

// ============================================
// AUTENTICAÇÃO E CADASTRO CLIENTE
// ============================================

function clienteRegister(e) {
  e.preventDefault();

  const novoCliente = {
    id: Date.now(),
    nome: document.getElementById('regNome').value,
    email: document.getElementById('regEmail').value,
    senha: document.getElementById('regSenha').value,
    telefone: document.getElementById('regTelefone').value,
    endereco: document.getElementById('regEndereco').value,
    bairro: document.getElementById('regBairro').value,
    pontos: 0,
    desconto: 0,
    pedidos: []
  };

  // Verificar se email já existe
  if (estadoApp.clientes.find(c => c.email === novoCliente.email)) {
    alert('Email já cadastrado!');
    return;
  }

  estadoApp.clientes.push(novoCliente);
  salvarEmStorage();
  alert('Cadastro realizado com sucesso!');

  // Limpar formulário e voltar para login
  document.getElementById('registerForm').reset();
  switchAuthTab('login');
}

function forgotPassword(type) {
  const email = prompt('Digite seu email para redefinir a senha:');
  if (!email) return;

  let emailExists = false;

  if (type === 'cliente') {
    emailExists = estadoApp.clientes.some(c => c.email === email);
  } else if (type === 'empresa') {
    emailExists = estadoApp.lojas.some(loja => 
      loja.proprietario.email === email || 
      (loja.funcionario && loja.funcionario.email === email)
    );
  }

  if (emailExists) {
    alert(`Um link de redefinição de senha foi enviado para ${email}. Verifique sua caixa de entrada.`);
    // Aqui poderia integrar com Firebase Auth ou backend para enviar email real
  } else {
    alert('Email não encontrado. Verifique se o email está correto ou cadastre-se.');
  }
}

function clienteLogin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  const cliente = estadoApp.clientes.find(c => c.email === email && c.senha === senha);

  if (!cliente) {
    alert('Email ou senha incorretos!');
    return;
  }

  estadoApp.clienteAtual = cliente;
  localStorage.setItem('clienteSessao', JSON.stringify(cliente));
  mostrarDashboardCliente();
  document.getElementById('logoutBtn').style.display = 'block';
}

function mostrarDashboardCliente() {
  document.getElementById('clienteLogin').style.display = 'none';
  document.getElementById('clienteDashboard').style.display = 'block';

  document.getElementById('nomeCliente').textContent = estadoApp.clienteAtual.nome;
  document.getElementById('emailCliente').textContent = estadoApp.clienteAtual.email;
  document.getElementById('pontosCliente').textContent = estadoApp.clienteAtual.pontos;

  carregarProdutosCliente();
  goToSection('cliente');
}

// ============================================
// PRODUTOS
// ============================================

function inicializarProdutos() {
  if (estadoApp.produtos.length === 0) {
    const produtosDefault = [
      { id: 1, nome: 'Leite Integral 1L', preco: 4.50, categoria: 'Laticínios', estoque: 50 },
      { id: 2, nome: 'Pão Francês', preco: 0.80, categoria: 'Padaria', estoque: 100 },
      { id: 3, nome: 'Arroz 5kg', preco: 25.00, categoria: 'Alimentos', estoque: 30, promo: true, desconto: 20, descricao: 'Promoção especial de início de semana.' },
      { id: 4, nome: 'Feijão 1kg', preco: 7.50, categoria: 'Alimentos', estoque: 40 },
      { id: 5, nome: 'Óleo de Soja 900ml', preco: 6.80, categoria: 'Alimentos', estoque: 60, promo: true, desconto: 25, descricao: 'Economize no básico da cozinha.' },
      { id: 6, nome: 'Sal Refinado 1kg', preco: 3.50, categoria: 'Alimentos', estoque: 70 },
      { id: 7, nome: 'Açúcar 1kg', preco: 5.00, categoria: 'Alimentos', estoque: 50 },
      { id: 8, nome: 'Café 500g', preco: 9.90, categoria: 'Bebidas', estoque: 45, promo: true, desconto: 15, descricao: 'Perfeito para seu café da manhã.' },
      { id: 9, nome: 'Suco Natural 1L', preco: 8.00, categoria: 'Bebidas', estoque: 55 },
      { id: 10, nome: 'Biscoito Integral 200g', preco: 4.20, categoria: 'Alimentos', estoque: 80 }
    ];
    estadoApp.produtos = produtosDefault;
    salvarEmStorage();
  }
}

function carregarProdutosCliente() {
  const container = document.getElementById('produtosList');
  container.innerHTML = '';

  estadoApp.produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.innerHTML = `
      <h4>${produto.nome}</h4>
      <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
      <p class="categoria">${produto.categoria}</p>
      <p class="estoque">Estoque: ${produto.estoque}</p>
      <div class="produto-actions">
        <input type="number" min="1" max="${produto.estoque}" value="1" class="qty-input" id="qty-${produto.id}">
        <button class="btn btn-small" onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
      </div>
    `;
    container.appendChild(card);
  });
}


function carregarPromocoes() {
  const promoGrid = document.getElementById('promoGrid');
  if (!promoGrid) return;
  promoGrid.innerHTML = '';

  const promocoes = estadoApp.produtos.filter(p => p.promo);
  if (promocoes.length === 0) {
    promoGrid.innerHTML = '<p class="promo-empty">Nenhuma promoção disponível no momento.</p>';
    return;
  }

  promocoes.forEach(produto => {
    const desconto = produto.desconto || 0;
    const precoPromocional = produto.preco * (1 - desconto / 100);
    const card = document.createElement('div');
    card.className = 'promo-card';
    card.innerHTML = `
      <span class="promo-badge">-${desconto}%</span>
      <h4>${produto.nome}</h4>
      <p>${produto.descricao || 'Aproveite esta oferta especial do X-Mercado.'}</p>
      <strong>R$ ${precoPromocional.toFixed(2)}</strong>
      <button class="btn btn-secondary" onclick="adicionarPromocaoAoCarrinho(${produto.id})">Adicionar ao carrinho</button>
    `;
    promoGrid.appendChild(card);
  });
}

function adicionarPromocaoAoCarrinho(produtoId) {
  const produto = estadoApp.produtos.find(p => p.id === produtoId);
  if (!produto) return;
  const desconto = produto.desconto || 0;
  const precoPromocional = produto.preco * (1 - desconto / 100);
  const itemExistente = estadoApp.carrinho.find(item => item.id === produtoId);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    estadoApp.carrinho.push({
      id: produtoId,
      nome: produto.nome,
      preco: precoPromocional,
      quantidade: 1
    });
  }

  salvarEmStorage();
  alert(`${produto.nome} adicionado ao carrinho por R$ ${precoPromocional.toFixed(2)}.`);
}

function filtrarProdutos() {
  const termo = document.getElementById('searchProduto').value.toLowerCase();
  const container = document.getElementById('produtosList');
  const cards = container.querySelectorAll('.produto-card');

  cards.forEach(card => {
    const nome = card.querySelector('h4').textContent.toLowerCase();
    card.style.display = nome.includes(termo) ? 'block' : 'none';
  });
}

function adicionarAoCarrinho(produtoId) {
  const quantidade = parseInt(document.getElementById(`qty-${produtoId}`).value);
  const produto = estadoApp.produtos.find(p => p.id === produtoId);

  const itemExistente = estadoApp.carrinho.find(item => item.id === produtoId);

  if (itemExistente) {
    itemExistente.quantidade += quantidade;
  } else {
    estadoApp.carrinho.push({
      id: produtoId,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: quantidade
    });
  }

  alert(`${produto.nome} adicionado ao carrinho!`);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const container = document.getElementById('carrinhoItems');
  container.innerHTML = '';

  if (estadoApp.carrinho.length === 0) {
    container.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
  } else {
    estadoApp.carrinho.forEach(item => {
      const total = item.preco * item.quantidade;
      const div = document.createElement('div');
      div.className = 'carrinho-item';
      div.innerHTML = `
        <div class="item-info">
          <h4>${item.nome}</h4>
          <p>R$ ${item.preco.toFixed(2)} x ${item.quantidade}</p>
        </div>
        <p class="item-total">R$ ${total.toFixed(2)}</p>
        <button class="btn-remove" onclick="removerDoCarrinho(${item.id})">✕</button>
      `;
      container.appendChild(div);
    });
  }

  const subtotal = estadoApp.carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const total = subtotal + estadoApp.taxaEntrega;

  document.getElementById('subtotal').textContent = 'R$ ' + subtotal.toFixed(2);
  document.getElementById('totalCarrinho').textContent = 'R$ ' + total.toFixed(2);
}

function removerDoCarrinho(produtoId) {
  estadoApp.carrinho = estadoApp.carrinho.filter(item => item.id !== produtoId);
  atualizarCarrinho();
}

// ============================================
// CHECKOUT E PEDIDOS
// ============================================

function proceedToCheckout() {
  if (estadoApp.carrinho.length === 0) {
    alert('Adicione produtos ao carrinho!');
    return;
  }

  document.getElementById('endereco').value = estadoApp.clienteAtual.endereco;
  document.getElementById('checkoutModal').style.display = 'flex';
}

function fecharCheckout() {
  document.getElementById('checkoutModal').style.display = 'none';
}

function confirmarPedido() {
  const endereco = document.getElementById('endereco').value;
  const numero = document.getElementById('numero').value;
  const complemento = document.getElementById('complemento').value;
  const metodoPagamento = document.getElementById('metodoPagamento').value;
  let pontosUsados = parseInt(document.getElementById('pontosDesconto').value) || 0;

  if (!metodoPagamento) {
    alert('Selecione uma forma de pagamento!');
    return;
  }

  // Validar pontos
  if (pontosUsados > estadoApp.clienteAtual.pontos) {
    alert('Pontos insuficientes!');
    return;
  }

  // Calcular total
  const subtotal = estadoApp.carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const desconto = pontosUsados * 0.10;
  const total = (subtotal + estadoApp.taxaEntrega) - desconto;

  // Criar pedido
  const novoPedido = {
    id: Date.now(),
    clienteId: estadoApp.clienteAtual.id,
    cliente: estadoApp.clienteAtual.nome,
    email: estadoApp.clienteAtual.email,
    data: new Date().toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR'),
    itens: [...estadoApp.carrinho],
    endereco: `${endereco}, ${numero}${complemento ? ' - ' + complemento : ''}`,
    metodoPagamento: metodoPagamento,
    subtotal: subtotal,
    taxaEntrega: estadoApp.taxaEntrega,
    desconto: desconto,
    total: total,
    status: 'Pendente',
    statusHistorico: [
      { status: 'Pendente', data: new Date().toLocaleString('pt-BR'), descricao: 'Pedido recebido' }
    ]
  };

  estadoApp.pedidos.push(novoPedido);

  // Atualizar pontos do cliente
  estadoApp.clienteAtual.pontos -= pontosUsados;
  // Adicionar novos pontos (1 ponto a cada R$ 1,00 gasto)
  estadoApp.clienteAtual.pontos += Math.floor(subtotal);
  estadoApp.clienteAtual.pedidos = estadoApp.clienteAtual.pedidos || [];
  estadoApp.clienteAtual.pedidos.push(novoPedido.id);

  // Atualizar cliente no storage
  const indiceCliente = estadoApp.clientes.findIndex(c => c.id === estadoApp.clienteAtual.id);
  estadoApp.clientes[indiceCliente] = estadoApp.clienteAtual;

  // Atualizar sessão
  localStorage.setItem('clienteSessao', JSON.stringify(estadoApp.clienteAtual));

  salvarEmStorage();

  alert('Pedido confirmado! Número: ' + novoPedido.id);
  
  // Limpar carrinho e fechar modal
  estadoApp.carrinho = [];
  fecharCheckout();
  document.getElementById('pontosCliente').textContent = estadoApp.clienteAtual.pontos;
  atualizarCarrinho();
  document.getElementById('checkoutModal').style.display = 'none';
}

function carregarPedidosCliente() {
  const container = document.getElementById('pedidosList');
  container.innerHTML = '';

  const pedidosCliente = estadoApp.pedidos.filter(p => p.clienteId === estadoApp.clienteAtual.id);

  if (pedidosCliente.length === 0) {
    container.innerHTML = '<p class="empty">Nenhum pedido realizado ainda.</p>';
    return;
  }

  pedidosCliente.forEach(pedido => {
    const div = document.createElement('div');
    div.className = 'pedido-card';

    const statusColor = {
      'Pendente': '#ff9800',
      'Preparando': '#2196f3',
      'Enviado': '#4caf50',
      'Entregue': '#27ae60',
      'Cancelado': '#f44336'
    };

    let historicoHTML = '<div class="status-timeline">';
    pedido.statusHistorico.forEach(h => {
      historicoHTML += `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <strong>${h.status}</strong> - ${h.data}
            <p>${h.descricao}</p>
          </div>
        </div>
      `;
    });
    historicoHTML += '</div>';

    div.innerHTML = `
      <div class="pedido-header">
        <h4>Pedido #${pedido.id}</h4>
        <span class="status-badge" style="background-color: ${statusColor[pedido.status]}">${pedido.status}</span>
      </div>
      <div class="pedido-info">
        <p><strong>Data:</strong> ${pedido.data} ${pedido.hora}</p>
        <p><strong>Endereço:</strong> ${pedido.endereco}</p>
        <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
      </div>
      <div class="pedido-itens">
        <strong>Itens:</strong>
        ${pedido.itens.map(i => `<p>• ${i.nome} (${i.quantidade}x)</p>`).join('')}
      </div>
      ${historicoHTML}
    `;
    container.appendChild(div);
  });
}

// ============================================
// SISTEMA DE PONTOS
// ============================================

function atualizarPontos() {
  document.getElementById('saldoPontos').textContent = estadoApp.clienteAtual.pontos;
}

function resgatar(pontos) {
  if (pontos > estadoApp.clienteAtual.pontos) {
    alert('Pontos insuficientes!');
    return;
  }

  estadoApp.clienteAtual.pontos -= pontos;
  const desconto = pontos * 0.10;
  estadoApp.clienteAtual.desconto = (estadoApp.clienteAtual.desconto || 0) + desconto;

  const indiceCliente = estadoApp.clientes.findIndex(c => c.id === estadoApp.clienteAtual.id);
  estadoApp.clientes[indiceCliente] = estadoApp.clienteAtual;
  localStorage.setItem('clienteSessao', JSON.stringify(estadoApp.clienteAtual));
  salvarEmStorage();

  alert(`${pontos} pontos resgatados! Desconto de R$ ${desconto.toFixed(2)} adicionado à sua conta.`);
  atualizarPontos();
}

// ============================================
// AUTENTICAÇÃO E CADASTRO ADMIN
// ============================================

function cadastroLoja(e) {
  e.preventDefault();

  // Dados do Mercado
  const nomeMercado = document.getElementById('nomeMercado').value;
  const cnpj = document.getElementById('cnpj').value;
  const telefoneMercado = document.getElementById('telefoneMercado').value;
  const enderecMercado = document.getElementById('enderecMercado').value;
  const horarioFunc = document.getElementById('horarioFunc').value;

  // Dados do Proprietário
  const nomeProp = document.getElementById('nomeProp').value;
  const emailProp = document.getElementById('emailProp').value;
  const senhaProp = document.getElementById('senhaProp').value;
  const telefoneProp = document.getElementById('telefoneProp').value;

  // Dados do Funcionário (opcional)
  const nomeFunc = document.getElementById('nomeFunc').value;
  const emailFunc = document.getElementById('emailFunc').value;
  const senhaFunc = document.getElementById('senhaFunc').value;
  const telefoneFunc = document.getElementById('telefoneFunc').value;

  // Verificar emails duplicados
  if (estadoApp.lojas.find(l => l.proprietario.email === emailProp)) {
    alert('Email do proprietário já cadastrado!');
    return;
  }

  if (emailFunc && estadoApp.lojas.find(l => l.funcionario && l.funcionario.email === emailFunc)) {
    alert('Email do funcionário já cadastrado!');
    return;
  }

  const novaLoja = {
    id: Date.now(),
    nome: nomeMercado,
    cnpj: cnpj,
    telefone: telefoneMercado,
    endereco: enderecMercado,
    horario: horarioFunc,
    dataCadastro: new Date().toLocaleDateString('pt-BR'),
    proprietario: {
      id: Date.now(),
      nome: nomeProp,
      email: emailProp,
      senha: senhaProp,
      telefone: telefoneProp,
      tipo: 'proprietario'
    },
    funcionario: emailFunc ? {
      id: Date.now() + 1,
      nome: nomeFunc,
      email: emailFunc,
      senha: senhaFunc,
      telefone: telefoneFunc,
      tipo: 'funcionario'
    } : null,
    produtos: []
  };

  estadoApp.lojas.push(novaLoja);
  salvarEmStorage();

  alert('Loja cadastrada com sucesso!');
  document.getElementById('registerLojaForm').reset();
  switchAdminTab('login');
}

function adminLogin(e) {
  e.preventDefault();

  const email = document.getElementById('adminEmail').value;
  const senha = document.getElementById('adminSenha').value;

  let lojaEncontrada = null;
  let tipoUsuario = null;

  // Procurar proprietário
  for (let loja of estadoApp.lojas) {
    if (loja.proprietario.email === email && loja.proprietario.senha === senha) {
      lojaEncontrada = loja;
      tipoUsuario = 'proprietario';
      break;
    }
    if (loja.funcionario && loja.funcionario.email === email && loja.funcionario.senha === senha) {
      lojaEncontrada = loja;
      tipoUsuario = 'funcionario';
      break;
    }
  }

  if (!lojaEncontrada) {
    alert('Email ou senha incorretos!');
    return;
  }

  estadoApp.adminAtual = {
    loja: lojaEncontrada,
    tipo: tipoUsuario,
    usuario: tipoUsuario === 'proprietario' ? lojaEncontrada.proprietario : lojaEncontrada.funcionario
  };

  localStorage.setItem('adminSessao', JSON.stringify(estadoApp.adminAtual));
  mostrarDashboardAdmin();
  document.getElementById('logoutBtn').style.display = 'block';
}

function mostrarDashboardAdmin() {
  document.getElementById('adminLogin').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';
  document.getElementById('nomeLojaAdmin').textContent = estadoApp.adminAtual.loja.nome;

  carregarProdutosAdmin();
  carregarPedidosAdmin();
  carregarClientesAdmin();
  if (estadoApp.adminAtual.tipo === 'proprietario') {
    carregarFuncionariosAdmin();
  }

  goToSection('admin');
}

// ============================================
// PAINEL ADMINISTRATIVO - PRODUTOS
// ============================================

function adicionarProduto(e) {
  e.preventDefault();

  const nomeProd = document.getElementById('nomeProd').value;
  const precoProd = parseFloat(document.getElementById('precoProd').value);
  const categoriaProd = document.getElementById('categoriaProd').value;
  const estoqueProd = parseInt(document.getElementById('estoqueProd').value);

  const novoProduto = {
    id: Date.now(),
    nome: nomeProd,
    preco: precoProd,
    categoria: categoriaProd,
    estoque: estoqueProd,
    lojaId: estadoApp.adminAtual.loja.id
  };

  estadoApp.produtos.push(novoProduto);
  salvarEmStorage();

  alert('Produto adicionado!');
  document.querySelector('.add-produto-form').reset();
  carregarProdutosAdmin();
}

function carregarProdutosAdmin() {
  const container = document.getElementById('produtosAdminList');
  container.innerHTML = '';

  const produtosLoja = estadoApp.produtos.filter(p => p.lojaId === estadoApp.adminAtual.loja.id);

  if (produtosLoja.length === 0) {
    container.innerHTML = '<p class="empty">Nenhum produto cadastrado.</p>';
    return;
  }

  produtosLoja.forEach(produto => {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
      <div class="item-info">
        <h4>${produto.nome}</h4>
        <p>R$ ${produto.preco.toFixed(2)} | ${produto.categoria} | Estoque: ${produto.estoque}</p>
      </div>
      <div class="item-actions">
        <button class="btn-small" onclick="editarProduto(${produto.id})">Editar</button>
        <button class="btn-small btn-delete" onclick="deletarProduto(${produto.id})">Deletar</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function deletarProduto(id) {
  if (confirm('Tem certeza?')) {
    estadoApp.produtos = estadoApp.produtos.filter(p => p.id !== id);
    salvarEmStorage();
    carregarProdutosAdmin();
  }
}

function editarProduto(id) {
  const produto = estadoApp.produtos.find(p => p.id === id);
  const novoPreco = prompt('Novo preço:', produto.preco);
  const novoEstoque = prompt('Novo estoque:', produto.estoque);

  if (novoPreco) produto.preco = parseFloat(novoPreco);
  if (novoEstoque) produto.estoque = parseInt(novoEstoque);

  salvarEmStorage();
  carregarProdutosAdmin();
}

// ============================================
// PAINEL ADMINISTRATIVO - PEDIDOS
// ============================================

function carregarPedidosAdmin() {
  const container = document.getElementById('pedidosAdminList');
  container.innerHTML = '';

  const pedidosLoja = estadoApp.pedidos;

  if (pedidosLoja.length === 0) {
    container.innerHTML = '<p class="empty">Nenhum pedido.</p>';
    return;
  }

  pedidosLoja.forEach(pedido => {
    const div = document.createElement('div');
    div.className = 'admin-item';

    const statusOptions = ['Pendente', 'Preparando', 'Enviado', 'Entregue', 'Cancelado'];
    const statusSelect = `
      <select class="status-select" onchange="atualizarStatusPedido(${pedido.id}, this.value)">
        ${statusOptions.map(s => `<option value="${s}" ${s === pedido.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    `;

    div.innerHTML = `
      <div class="item-info">
        <h4>Pedido #${pedido.id}</h4>
        <p><strong>Cliente:</strong> ${pedido.cliente}</p>
        <p><strong>Data:</strong> ${pedido.data} ${pedido.hora}</p>
        <p><strong>Endereço:</strong> ${pedido.endereco}</p>
        <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
        <p><strong>Itens:</strong> ${pedido.itens.map(i => `${i.nome} (${i.quantidade}x)`).join(', ')}</p>
      </div>
      <div class="item-actions">
        <div class="status-control">
          ${statusSelect}
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function atualizarStatusPedido(pedidoId, novoStatus) {
  const pedido = estadoApp.pedidos.find(p => p.id === pedidoId);
  
  if (pedido) {
    pedido.status = novoStatus;
    pedido.statusHistorico.push({
      status: novoStatus,
      data: new Date().toLocaleString('pt-BR'),
      descricao: 'Status atualizado pelo administrador'
    });
    salvarEmStorage();
    alert('Status atualizado!');
  }
}

// ============================================
// PAINEL ADMINISTRATIVO - CLIENTES
// ============================================

function carregarClientesAdmin() {
  const container = document.getElementById('clientesAdminList');
  container.innerHTML = '';

  if (estadoApp.clientes.length === 0) {
    container.innerHTML = '<p class="empty">Nenhum cliente cadastrado.</p>';
    return;
  }

  estadoApp.clientes.forEach(cliente => {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
      <div class="item-info">
        <h4>${cliente.nome}</h4>
        <p><strong>Email:</strong> ${cliente.email}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
        <p><strong>Endereço:</strong> ${cliente.endereco}, ${cliente.bairro}</p>
        <p><strong>Pontos:</strong> ${cliente.pontos} | <strong>Desconto:</strong> R$ ${cliente.desconto ? cliente.desconto.toFixed(2) : '0,00'}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

// ============================================
// PAINEL ADMINISTRATIVO - FUNCIONÁRIOS
// ============================================

function carregarFuncionariosAdmin() {
  const container = document.getElementById('funcionariosAdminList');
  container.innerHTML = '';

  const loja = estadoApp.adminAtual.loja;

  if (!loja.funcionario) {
    container.innerHTML = '<p class="empty">Nenhum funcionário cadastrado.</p>';
    return;
  }

  const div = document.createElement('div');
  div.className = 'admin-item';
  div.innerHTML = `
    <div class="item-info">
      <h4>${loja.funcionario.nome}</h4>
      <p><strong>Email:</strong> ${loja.funcionario.email}</p>
      <p><strong>Telefone:</strong> ${loja.funcionario.telefone}</p>
      <p><strong>Tipo:</strong> ${loja.funcionario.tipo}</p>
    </div>
    <div class="item-actions">
      <button class="btn-small btn-delete" onclick="removerFuncionario()">Remover</button>
    </div>
  `;
  container.appendChild(div);
}

function removerFuncionario() {
  if (confirm('Tem certeza que deseja remover este funcionário?')) {
    estadoApp.adminAtual.loja.funcionario = null;
    const indice = estadoApp.lojas.findIndex(l => l.id === estadoApp.adminAtual.loja.id);
    estadoApp.lojas[indice].funcionario = null;
    salvarEmStorage();
    carregarFuncionariosAdmin();
    alert('Funcionário removido!');
  }
}

// ============================================
// LOGOUT
// ============================================

function logout() {
  if (confirm('Tem certeza que deseja sair?')) {
    estadoApp.clienteAtual = null;
    estadoApp.adminAtual = null;
    estadoApp.carrinho = [];
    
    localStorage.removeItem('clienteSessao');
    localStorage.removeItem('adminSessao');

    document.getElementById('clienteLogin').style.display = 'block';
    document.getElementById('clienteDashboard').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';

    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('adminLoginForm').reset();
    document.getElementById('registerLojaForm').reset();

    goToSection('home');
  }
}
