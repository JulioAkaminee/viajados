# Guia de Padronização de Código - Frontend

Bem-vindo ao guia de estilo de código para o frontend deste projeto! Este documento define as regras e boas práticas que todos os colaboradores devem seguir ao contribuir com o código. O objetivo é manter consistência, legibilidade e facilidade de manutenção.

## Índice
1. [Estrutura de Pastas](#estrutura-de-pastas)
2. [Nomeação de Arquivos e Variáveis](#nomeação-de-arquivos-e-variáveis)
3. [Git e Commits](#git-e-commits)


---

## Estrutura de Pastas


- - **`README.md`** → Documentação do projeto.  
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

Isso ajudará a manter a organização e a documentação clara para o projeto! 


---


## Nomeação de Arquivos e Variáveis

Regras para nomeação em projetos frontend, visando consistência e clareza.

## Arquivos
- Use `camelCase` para arquivos de componentes.
- Use `kebab-case` para arquivos não relacionados a componentes.
- Ex.: `homePage.tsx`, `api-service.ts`.

## Variáveis e Funções
- Use `camelCase`.
- Ex.: `userName`, `fetchData`.

## Constantes
- Use `UPPER_CASE` com underscores.
- Ex.: `API_URL`, `MAX_ITEMS`.
- Para constantes dentro de funções, pode-se usar `camelCase`.

## Componentes React
- Use `PascalCase`, e o arquivo deve ter o mesmo nome do componente.
- Ex.: `UserCard.tsx` com `export default function UserCard() {}`.

## Pastas
- Use `kebab-case` para nomes de pastas.
- Ex.: `components/user-card/`.
- Dentro da pasta de um componente, prefira `index.tsx` para facilitar a importação.

## Exemplo de Estrutura
```plaintext
src/
  components/
    user-card/
      index.tsx
```

Seguir essas convenções melhora a legibilidade e manutenção do código! 🚀



---


## Git e Commits

## Como commitar para o projeto

- Tem duas branchs, master(Produção) e AmbientDevelopment(Desenvolvimento);
- Primeiro você deve clonar o repositorio da branch de produção master https://github.com/JulioAkaminee/viajados
- Depois mudar para a branch de desenvolvimento com
  ```sh
  git checkout AmbientDevelopment
  ```
- Depois disso crie uma branch temporaria para a sua feature por exemplo: irei criar uma pagina de cadastro.
  ```sh
  git checkout -b Nome-Da-Branch
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
- Depois disso volte para a branch de desenvolvimento e se for fazer outra feature repita o passo a passo acima.
  
  ```sh
  git checkout -b AmbientDevelopment
  ````

