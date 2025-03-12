# Viajados

Bem-vindo ao **Viajados**, um aplicativo de viagens desenvolvido com **React Native** no frontend e **Node.js** no backend. Nosso objetivo é ajudar viajantes a planejar suas aventuras com facilidade, oferecendo busca de destinos, roteiros personalizados e dicas locais.

## Tecnologias
- **Frontend**: React Native  
- **Backend**: Node.js  


## Funcionalidades
- Pesquisa de destinos turísticos  
- Criação de roteiros de viagem  
- Dicas e informações locais  

## Como Instalar
Instalar todas dependências
```sh
npm install
````


## 📌 Descrição dos Arquivos e Pastas  

- **`README.md`** → Documentação do projeto.  
- **`app.json`** → Configurações do aplicativo.  
- **`package.json`** → Dependências e scripts do projeto.  
- **`tsconfig.json`** → Configuração do TypeScript.  
- **`app/`** → Diretório principal dos componentes do aplicativo.  
  - **`+html.tsx`** e **`+not-found.tsx`** → Componentes de página.  
  - **`_layout.tsx`** → Layout principal do app.  
  - **`(tabs)/`** → Contém as abas do aplicativo:  
    - `favoritos.tsx`, `index.tsx`, `minhaConta.tsx`, `minhasViagens.tsx`.  
- **`assets/`** → Recursos do projeto.  
  - **`fonts/`** → Contém fontes personalizadas.  
  - **`images/`** → Diretório para imagens.  

Isso ajudará a manter a organização e a documentação clara para o projeto! 🚀📂


## Pré-requisitos
- Node.js  
- npm ou yarn  
- Expo

## Como commitar para o projeto

- Tem duas branchs, master(Produção) e AmbientDevelopment(Desenvolvimento);
- Primeiro você deve clonar o repositorio da branch de produção master https://github.com/JulioAkaminee/viajados
- Depois mudar para a branch de desenvolvimento com
  ```sh
  git checkout AmbientDevelopment
  ```
- Depois disso crie uma branch temporaria para a sua feature por exemplo: irei criar uma pagina de cadastro.
  ```sh
  git checkout -b paginaCadastro
  ````
- Esse comando cria e já muda para a branch criada.
- Depois disso pode fazer seu commit normalmente.
- Após fazer seu commit você precisa fazer um PR(Pull Request) para o ambiente de desenvolvimento(AmbientDevelopment).
  
## Regras
- Todo Commit feito no projeto será analisado pelo Tech Lead (Julio Akamine);
- Não será aceito commit's fora da padronização do código
