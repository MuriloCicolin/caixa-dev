# caixa-dev

### Executando o Projeto

```
$ git clone https://github.com/murilocicolin/caixa-dev.git
```

### Iniciando o Projeto
```sh

$ cd caixa-dev

# Criando a imagem Docker do banco de dados:
# Dentro do projeto, já existe uma arquivo docker-compose.yml que possui o
# PostgreSQL como banco de dados, basta ter o Docker instalado em sua máquina.
$ docker-compose up -d # Iniciará em background e não irá bloquear o shell

# Rodando as migrations para o banco de dados e iniciando o projeto
$ yarn && yarn typeorm migration:run && yarn dev:server

```
### Arquivo json das rotas para importar no insomnia
<a href="https://insomnia.rest/run/?label=Caixa-Dev-Api&uri=https%3A%2F%2Fraw.githubusercontent.com%2FMuriloCicolin%2Fcaixa-dev%2Fmaster%2FInsomnia_2020-08-23.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>

<h4 align="center">
 ⚠️ Antes de rodar os testes, crie um banco de dados com o nome "caixa_dev_tests" para que todos os testes possam executar corretamente ⚠️
</h4>
