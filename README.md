# Painel Empreender PB

Sistema web de controle de inscrições e processos de crédito do Empreender PB. Substitui uma planilha de Excel que, com milhares de linhas acumuladas ao longo dos anos, passou a travar.

> **Status:** em desenvolvimento. Hoje só existe o front-end, funcionando com **dados fictícios**. O backend, o banco de dados e o login real ainda não foram implementados.

## O que o sistema faz hoje

- Tela de login (visual e tratamento de erros; ainda sem servidor para autenticar).
- Tela inicial com quatro cards que levam aos painéis: **Situação**, **Tipo de Crédito**, **Edital** e **Municípios**.
- Painel agrupado: as inscrições são separadas em blocos pelo critério escolhido (por exemplo, um bloco por município). Cada bloco abre e fecha, e só desenha as linhas quando está aberto.
- Tabela com 25 linhas por vez e botão **Mostrar mais**.
- Busca por nome, CPF, protocolo ou nome do grupo, sem diferenciar maiúsculas nem acentos.
- Navegação por endereços, com botão **Voltar** e botão **Sair** na barra superior.

## O que ainda não existe

- Backend e banco de dados (os dados na tela são gerados por código).
- Login real, sessão e controle de perfis de usuário.
- Cadastro e edição de inscrições (o botão **Editar** ainda não faz nada).
- Exportação para CSV (o botão **Exportar** ainda não faz nada).
- Marcação de documentos pendentes e indicador "em análise".
- Histórico de alterações.

## Tecnologias

- [React](https://react.dev) 19 com [Vite](https://vite.dev)
- [React Router](https://reactrouter.com) 7
- [Bootstrap](https://getbootstrap.com) 5 e [Bootstrap Icons](https://icons.getbootstrap.com)
- CSS próprio, um arquivo por tela ou componente
- ESLint

Previsto para o backend: Node.js, Express e PostgreSQL.

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) (versão LTS recente) e Git.

```bash
git clone https://github.com/ygorbezerra-prog/empreender.git
cd empreender
npm install
npm run dev
```

O terminal mostra o endereço local (algo como `http://localhost:5173`). Todos os comandos `npm` devem ser executados dentro da pasta que contém o `package.json`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Abre a versão de produção localmente |
| `npm run lint` | Verifica o código com o ESLint |

### Variáveis de ambiente

Crie um arquivo `.env` na raiz (ele não deve ser versionado):

```
VITE_API_URL=http://localhost:3000/api
```

É o endereço da API. Se o arquivo não existir, o código usa esse mesmo valor como padrão.

### Testando sem backend

Sem servidor, o botão **Entrar** mostra "Não foi possível conectar ao servidor", e isso é o esperado. Para navegar pelas outras telas, troque `useState(false)` por `useState(true)` em `src/App.jsx`. **Volte para `false` antes de qualquer demonstração ou commit.**

## Rotas

| Endereço | Tela |
|---|---|
| `/login` | Login |
| `/` | Home com os quatro cards |
| `/inscricoes/situacao` | Painel agrupado por situação |
| `/inscricoes/tipo-credito` | Painel agrupado por tipo de crédito |
| `/inscricoes/edital` | Painel agrupado por edital |
| `/inscricoes/municipio` | Painel agrupado por município |

Os quatro painéis são o **mesmo componente** (`PainelAgrupado`). Ele lê o final do endereço e consulta `src/constants/agrupamentos.js` para saber por qual campo agrupar.

## Estrutura do projeto

```
src/
├── main.jsx                  ponto de entrada (Bootstrap, ícones, tema, Router)
├── tema.css                  cores do Empreender como variáveis CSS
├── App.jsx                   rotas e controle de login (provisório)
├── Home.jsx / Home.css       tela inicial só com cards
├── PainelAgrupado.jsx / .css painel: busca, agrupamento e blocos
├── constants/
│   ├── status.js             situações, cores e ícones
│   └── agrupamentos.js       configuração dos painéis e das colunas
├── data/
│   └── inscricoesMock.js     gerador de inscrições fictícias
├── services/
│   └── authService.js        chamada de login à API
├── utils/
│   └── agrupar.js            agruparPor e normalizar
└── components/
    ├── Login.jsx / .css
    ├── Navbar.jsx / .css
    ├── MenuCards.jsx / .css
    ├── BlocoRecolhivel.jsx / .css
    ├── TabelaInscricoes.jsx / .css
    └── Rodape.jsx / .css
```

### Caminho dos dados no painel

1. `PainelAgrupado` lê o `:tipo` do endereço e busca a configuração em `AGRUPAMENTOS`.
2. Filtra as inscrições pela busca.
3. `agruparPor` separa a lista em grupos pelo campo do painel.
4. Cada grupo vira um `BlocoRecolhivel`, que só desenha o conteúdo quando aberto.
5. `TabelaInscricoes` mostra as linhas, 25 por vez, sem a coluna do campo agrupado (ela seria repetida em todas as linhas).

## Decisões de projeto

- **Um painel genérico em vez de quatro.** O que muda entre os painéis é só o campo de agrupamento, descrito em dados. Criar um painel novo é acrescentar uma linha em `AGRUPAMENTOS`.
- **Blocos recolhíveis e paginação.** O problema da planilha era o volume. Bloco fechado não cria nenhuma linha na tela, e bloco aberto mostra 25 por vez.
- **Tabela comum (`<table>`) em vez de grade de cards.** As colunas se alinham sozinhas, com menos CSS e menos elementos por linha.
- **Textos de situação em constantes** (`SITUACAO`). Evita erro de digitação, que faria o filtro não achar nada sem nenhum aviso.
- **Chamadas à API isoladas em `services/`.** As telas não sabem como o servidor funciona. O contrato do login é: status `200` com os dados do usuário em caso de sucesso, `401` para credenciais erradas.
- **Cores em variáveis CSS** (`tema.css`). A paleta fica num lugar só. Os valores atuais são aproximados; os oficiais devem ser conferidos no site da secretaria.

## Regras de negócio levantadas

- Documento faltando **impede** a validação da inscrição.
- Ter todos os documentos **não garante** a validação: existe uma análise, e a decisão de validar é humana. O sistema não deve validar sozinho.
- O histórico da planilha antiga fica arquivado nela, fora do sistema. Este sistema começa vazio.

> Estas regras vêm do levantamento de requisitos em andamento e ainda precisam de confirmação da equipe.

## Segurança e dados pessoais

O sistema vai tratar CPF e dados de crédito de cidadãos.

- **Nunca** coloque dados reais no repositório, nem em arquivos de teste. Todos os dados atuais são fictícios.
- Não versione arquivos `.env` com segredos.
- Trancar telas no React só muda o que o usuário vê. A proteção de verdade precisa ficar no servidor: a API só deve responder a quem estiver autenticado.
- A exportação para CSV leva dados pessoais para fora do sistema. Quem pode exportar e o registro de cada exportação ainda precisam ser definidos.

## Próximos passos

- [ ] Concluir o levantamento de requisitos com quem usa a planilha
- [ ] Renomear a situação `PENDENTE DOCUMENTO` para `PENDENTE` e criar o indicador `emAnalise`
- [ ] Backend mínimo: tabela de inscrições no PostgreSQL e rota `GET /inscricoes`
- [ ] Cadastro e edição de inscrições
- [ ] Marcação de documentos pendentes
- [ ] Login real (senha com hash, sessão em cookie `httpOnly`)
- [ ] Busca e paginação no servidor
- [ ] Exportação CSV
- [ ] Histórico de alterações
- [ ] Logo e cores oficiais

## Contribuindo

1. Rode `git pull` antes de começar a trabalhar.
2. Faça commits pequenos, com mensagens que digam o que mudou.
3. Rode `npm run lint` antes de enviar.
4. Dúvidas sobre as regras de negócio devem ser anotadas e levadas à equipe, não decididas no código.

## Autoria

Projeto desenvolvido durante estágio na Secretaria de Estado do Empreender Paraíba.