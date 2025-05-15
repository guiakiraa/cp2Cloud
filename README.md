
# Checkpoint 2 - Cloud

Este projeto utiliza containers Docker para orquestrar um ambiente completo com **MySQL**, **Backend em Python (FastAPI)** e **Frontend em Next.js**.

## Pré-requisitos

- Docker instalado na máquina
- Git (opcional, para clonar o repositório)

## Configuração Inicial

### 1. Criar rede e volume Docker

```bash
docker network create rede-cp2
docker volume create mysql-volume
```

### 2. Clonar o repositório

```bash
git clone https://github.com/guiakiraa/cp2Cloud
cd cp2Cloud
```

---

## Subindo o container do MySQL

Execute o comando abaixo para criar o container do banco de dados:

```bash
docker run -d \
  --name bd-mysql-rm556128 \
  --network rede-cp2 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=meubanco \
  -e MYSQL_USER=gui \
  -e MYSQL_PASSWORD=qwerty123 \
  -v mysql-volume:/var/lib/mysql \
  mysql:8
```

### 3. Criar a tabela e inserir dados

Entre no terminal do MySQL:

```bash
docker exec -it bd-mysql-rm556128 mysql -u root -p
```

Senha: `root`

Agora, execute os comandos SQL abaixo:

```sql
USE meubanco;

CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100)
);

INSERT INTO usuario(nome, email) VALUES('Guilherme Akira', 'guiakira@fiap.com.br');
INSERT INTO usuario(nome, email) VALUES('Anne Rezendes', 'annere@fiap.com.br');
INSERT INTO usuario(nome, email) VALUES('Alice Nunes', 'alicenunes@fiap.com.br');
```

Para sair do terminal:

```sql
exit
```

---

## Subindo o Backend (FastAPI)

Navegue até a pasta do backend:

```bash
cd backend
```

Execute o container do backend:

```bash
docker run -d \
  --name backend-python-rm556128 \
  --network rede-cp2 \
  -e DB_HOST=bd-mysql-rm556128 \
  -e DB_NAME=meubanco \
  -e DB_USER=gui \
  -e DB_PASS=qwerty123 \
  -v "${PWD}:/app" \
  -w /app \
  -p 8000:8000 \
  python:3.10 sh -c "pip install fastapi uvicorn mysql-connector-python && uvicorn main:app --host 0.0.0.0 --port 8000"
```

---

## Subindo o Frontend (Next.js)

Navegue até a pasta do frontend:

```bash
cd ../frontend
```

Execute o container do frontend:

```bash
docker run -d \
  --name frontend-nextjs-rm556128 \
  --network rede-cp2 \
  -v "${PWD}:/app" \
  -e NEXT_PUBLIC_API_URL=http://backend-python-rm556128:8000 \
  -w /app \
  -p 80:3000 \
  node:18 sh -c "npm install && npm run dev"
```

---

## Acessando a aplicação

Abra seu navegador e acesse:

```
http://localhost
```

A aplicação estará disponível na porta 80.

---

## Parar e remover containers (opcional)

Caso queira parar e remover os containers criados:

```bash
docker rm -f frontend-nextjs-rm556128 backend-python-rm556128 bd-mysql-rm556128
```
