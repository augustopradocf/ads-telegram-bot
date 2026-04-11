# X-Mercado V8

Versão completa do X-Mercado com funcionalidades de carrinho, reset de pedido, termos de uso e política de privacidade.

## Funcionalidades

- Carrinho de compras funcional
- Sistema de pontos
- Gestão de listas
- Área do dono com abas de Pedidos e Operação
- Reset completo do pedido
- Termos de Uso e Política de Privacidade

## Deploy no Netlify

1. Faça upload de todos os arquivos desta pasta para o Netlify
2. Configure o domínio
3. O site será acessível via HTTPS

## Arquivos incluídos

- `index.html` - Página principal
- `script.js` - Lógica da aplicação
- `style.css` - Estilos principais
- `manifest.json` - Configuração PWA
- `sw.js` - Service Worker
- `app-config.js` - Configurações da app
- `netlify.toml` - Configuração Netlify
- `_redirects` - Redirecionamentos
- `firebase.json` - Configuração Firebase
- `x-mercado-legal/` - Pasta com termos e privacidade

## Teste local

Para testar localmente, use um servidor HTTP:

```bash
python3 -m http.server 8080
```

Acesse `http://localhost:8080`