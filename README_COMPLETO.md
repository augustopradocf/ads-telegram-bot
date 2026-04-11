# 🛒 X-MERCADO - Sistema Completo de Mercado de Bairro

Um site completo e responsivo para um mercado de bairro com funcionalidades para clientes, proprietários e funcionários.

## 📋 Funcionalidades

### 👥 PARA CLIENTES
- **Cadastro e Login**: Sistema seguro de autenticação com email e senha
- **Catálogo de Produtos**: Navegue por produtos com filtro de busca
- **Carrinho de Compras**: Adicione produtos, atualize quantidades, remova itens
- **Checkout**: Finalização de compra com:
  - Endereço de entrega customizável
  - Múltiplas formas de pagamento (Dinheiro, PIX, Débito, Crédito)
  - Taxa de entrega automática (R$ 5,00)
  - Opção de usar pontos como desconto
- **Acompanhamento de Pedidos**: Rastreamento em tempo real com timeline de status
- **Sistema de Pontos**:
  - 1 ponto a cada R$ 1,00 gasto
  - Resgate de pontos para descontos
  - Histórico de transações

### 🏪 PARA PROPRIETÁRIO/FUNCIONÁRIO
- **Cadastro da Loja**: Informações completas do mercado
- **Login Seguro**: Acesso com email e senha
- **Gerenciamento de Produtos**:
  - Adicionar novos produtos
  - Editar preços e estoque
  - Remover produtos
- **Acompanhamento de Pedidos**:
  - Visualizar todos os pedidos
  - Atualizar status (Pendente → Preparando → Enviado → Entregue)
  - Histórico de mudanças de status
- **Lista de Clientes**: Visualizar dados de todos os clientes cadastrados
- **Gerenciamento de Funcionários**: Adicionar/remover funcionários

## 🚀 Como Usar

### 1. **Abrir o Site**
Abra o arquivo `index.html` em seu navegador.

### 2. **Como Cliente**
1. Clique em "Cliente" na barra de navegação
2. Escolha "Cadastro" para criar nova conta
3. Preencha seus dados e clique em "Criar Conta"
4. Faça login com email e senha
5. Navegue pelo catálogo, adicione produtos ao carrinho
6. Clique em "Finalizar Compra" para ir ao checkout
7. Escolha endereço, forma de pagamento e quantidade de pontos
8. Confirme o pedido
9. Acompanhe seus pedidos na aba "Meus Pedidos"

### 3. **Como Proprietário/Funcionário**
1. Clique em "Gerenciamento" na barra de navegação
2. Escolha "Cadastro da Loja" para registrar o mercado
3. Preencha informações do mercado, proprietário e funcionário (opcional)
4. Clique em "Cadastrar Loja"
5. Faça login com email e senha
6. No painel administrativo, você pode:
   - **Gerenciar Produtos**: Adicionar, editar e remover
   - **Pedidos**: Atualizar status e acompanhar entrega
   - **Clientes**: Visualizar lista de clientes
   - **Funcionários**: Gerenciar equipe (apenas proprietário)

## 💾 Armazenamento de Dados

Todos os dados são salvos no **localStorage** do navegador:
- Clientes cadastrados
- Lojas cadastradas
- Produtos
- Pedidos
- Sessões ativas

**Observação**: Os dados são locais do navegador. Se limpar o cache/cookies, os dados serão perdidos.

## 📊 Fluxo de Pedidos

```
Pendente → Preparando → Enviado → Entregue
```

Cada mudança de status é registrada com:
- Status novo
- Data e hora da mudança
- Descrição do evento

## 🎯 Produtos Pré-carregados

O sistema vem com 10 produtos de exemplo:
- Leite Integral 1L - R$ 4,50
- Pão Francês - R$ 0,80
- Arroz 5kg - R$ 25,00
- Feijão 1kg - R$ 7,50
- Óleo de Soja 900ml - R$ 6,80
- Sal Refinado 1kg - R$ 3,50
- Açúcar 1kg - R$ 5,00
- Café 500g - R$ 9,90
- Suco Natural 1L - R$ 8,00
- Biscoito Integral 200g - R$ 4,20

## 🎨 Design

- **Responsivo**: Funciona em desktop, tablet e mobile
- **Cores**: Laranja (#ff6b35) e Azul (#004e89)
- **Animações**: Transições suaves e intuitivas
- **Acessibilidade**: Design limpo e fácil de usar

## 🔐 Segurança

- Senhas são armazenadas localmente (em produção, usar hash!)
- Sistema de sessão com logout
- Validação de dados em formulários

## 📱 Responsividade

- Desktop: Todos os recursos visíveis
- Tablet: Layout adaptado
- Mobile: Interface otimizada para touch

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos e animações
- **JavaScript Vanilla**: Lógica da aplicação
- **LocalStorage API**: Persistência de dados

## 📝 Exemplo de Uso Prático

### Fluxo de Venda:

1. **Cliente se cadastra** e faz login
2. **Cliente adiciona produtos** ao carrinho
3. **Cliente finaliza compra** com endereço e pagamento
4. **Sistema gera pedido** e adiciona pontos
5. **Proprietário vê pedido** na dashboard
6. **Proprietário atualiza status** (Preparando, Enviado, etc)
7. **Cliente acompanha** o status em tempo real
8. **Cliente usa pontos** para descontos em próximas compras

## ⚙️ Configurações Personalizáveis

No arquivo `script.js`, você pode alterar:
- `estadoApp.taxaEntrega`: Valor da taxa de entrega (padrão: R$ 5,00)
- Produtos padrão: Adicionar/remover produtos iniciais
- Conversão de pontos: Alterar taxa de pontos (1 ponto = R$ 0,10)

## 🐛 Troubleshooting

**Dados não estão sendo salvos?**
- Verifique se o LocalStorage está habilitado no navegador
- Tente limpar o cache e recarregar a página

**Login não funciona?**
- Verifique se o email e senha estão corretos
- Certifique-se de que cadastrou primeiro

**Produtos não aparecem?**
- Recarregue a página para carregar produtos padrão

## 📞 Suporte

Para adicionar mais funcionalidades ou customizações, edite os arquivos:
- `index.html`: Estrutura e layout
- `script.js`: Lógica da aplicação
- `style.css`: Estilos e design

## 📄 Licença

Livre para uso pessoal e comercial.

---

**Desenvolvido com ❤️ para mercados de bairro**
