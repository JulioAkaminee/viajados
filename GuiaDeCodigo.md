# Guia de Padronização de Código - Frontend

Bem-vindo ao guia de estilo de código para o frontend deste projeto! Este documento define as regras e boas práticas que todos os colaboradores devem seguir ao contribuir com o código. O objetivo é manter consistência, legibilidade e facilidade de manutenção.

## Índice
1. [Estrutura de Pastas](#estrutura-de-pastas)
2. [Nomeação de Arquivos e Variáveis](#nomeação-de-arquivos-e-variáveis)
3. [JavaScript](#javascript)
4. [CSS/SCSS](#cssscss)
5. [Componentes React](#componentes-react)
6. [Formatação e Linting](#formatação-e-linting)
7. [Git e Commits](#git-e-commits)
8. [Testes](#testes)

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
