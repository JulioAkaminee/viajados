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
- Para fazer o Pull Request Você precisa entrar no repositório e clicar em branches.
  
![image](https://github.com/user-attachments/assets/acd07d02-fded-49c5-9233-04f08dab904e)

- Após isso clique na branch que você criou para a nova feature, logo em seguida irá parecer assim para vôcê fazer um Pull Request.
- Clique em Compare e Pull
  
![imagem](https://github.com/user-attachments/assets/3d32312a-a8cc-437a-a6d6-15521fce6491)

  - A Branch base tem que ser a branch que você criou para fazer a nova feature, e a branch compare tem que ser o ambiente de desenvolvimento (AmbientDevelopment)

![imagem](https://github.com/user-attachments/assets/a0ca84f2-a1c2-4df8-80d2-82b7d41654f9)

- E dessa forma só escrever o titulo e a descrição das alterações.

    

## Regras
- Todo Commit feito no projeto será analisado pelo Tech Lead (Julio Akamine);
- Não será aceito commit's fora da padronização do código
