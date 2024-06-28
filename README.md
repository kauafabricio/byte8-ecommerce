# Byte8 E-commerce Project

## Live Application
https://byte8.vercel.app/  

## Vídeo sobre o projeto
https://www.youtube.com/watch?v=8vI0CqfYXw4  

## Sobre o projeto

Este projeto é um e-commerce desenvolvido para a empresa fictícia Byte8, utilizando TypeScript, Next.js, Node.js, Express.js, Mongoose e JWT (JSON Web Tokens). O objetivo principal é proporcionar uma plataforma de compras online com funcionalidades essenciais, como registro de conta, login, gestão de carrinho de compras, checkout de pedidos e aplicação de cupons.  

## Funcionalidades Principais

**Autenticação de Usuário**: Registro e login seguro utilizando JWT para gerenciar sessões de usuário.  
**Gestão de Produtos**: Adicionar produtos ao carrinho, remover itens e visualizar detalhes do produto.  
**Checkout Simplificado**: Processo de checkout com informações básicas do usuário e total do pedido.  
**Aplicação de Cupons**: Possibilidade de aplicar cupons de desconto durante o checkout.  
**Histórico de Pedidos**: Acesso aos pedidos anteriores do usuário para consulta.  

## Tecnologias utilizadas

**Frontend**: Next.js, React, TypeScript, ContextAPI.  
**Backend**: Node.js, Express.js, Mongoose, JWT, Bcrypt.  
**Banco de Dados**: MongoDB com Mongoose para modelagem de dados.  
**Autenticação**: JWT para gerenciamento de tokens de autenticação.  

## Estrutura de pastas

**Client-side**  

- **/byte8-app**: Pasta raiz da aplicação front-end  
    - **/context**: Arquivos de gerenciamento global de estados utilizando ContextAPI  
    - **/public**: Arquivos de media, como imagens e fontes  
    - **/pages**: Arquivos de páginas da aplicação  
    - **/src**: Diretório de componentes e arquivos de CSS da aplicação  
       - **/app**:  
         - **/components**: Componentes da aplicação  
         - **/styles**: Arquivos CSS da aplicação  

**Server-side**

- **/byte8-server**: Pasta raiz da aplicação back-end  
  - **/controllers**: Funções de controle das rotas  
  - **/models**: Modelos dos dados do MongoDB  
  - **/routes**: Rotas da API  
 
# API's do Projeto
## Autenticação do Usuário  
  **POST /register**: API para registrar uma nova conta de usuário no e-commerce.  
  **POST /login**: API para realizar login de usuário no e-commerce.  
  **GET /auth**: API para verificar a autenticação do usuário utilizando token JWT.  
## Produtos  
  **GET /api/products**: API para acessar todos os produtos disponíveis no e-commerce.  
## Sacola de Desejos  
  **POST /api/save-product**: API para adicionar um novo produto na Sacola de Desejos do usuário.  
  **DELETE /api/delete-product**: API para excluir produto da Sacola de Desejos do usuário.  
  **GET /api/get-bag**:  API para obter a sacola de desejos atual do usuário.  
  **PUT /api/refresh-bag**: API para atualizar a quantidade do produto na Sacola de Desejos do usuário.  
## Cupons  
  **POST /api/cupom**:  API para aplicar um cupom de desconto.  
## Endereços do Usuário  
  **POST /api/add-address**: API para adicionar um novo endereço de entrega para o usuário.  
  **DELETE /api/delete-address**: API para excluir um endereço de entrega do usuário.  
## Pedidos  
  **POST /api/process-order**: API para processar um novo pedido de compra no e-commerce.  

