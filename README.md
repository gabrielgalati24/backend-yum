# Proyecto de Backend de Delivery con Microservicios y Docker Compose
  ## no ack Rabbitmq version
Stack: Nestjs, Rabbitmq, Redis, Postgresql

Para ejecutar este proyecto,  necesitas tener Docker y Docker Compose instalados en tu máquina y node . Luego, puedes iniciar todos los servicios con estos comandos:

```bash
docker-compose -f docker-compose.dev.yml build

docker-compose -f docker-compose.dev.yml up

```
## Products
- GET todos los Productos: 
  - URL: `http://localhost:3000/api/v1/products`

- POST crear un Shop:
  - URL: `http://localhost:3000/api/v1/products/shop/create`
    - Body:
    ```json
    {
      "name": "test"
   
    }
    ```

- POST crear un producto: 
  - URL: `http://localhost:3000/api/v1/products/create`
  - Body:
    ```json
    {
      "name": "sushi",
      "price": 15,
      "shopId": 1
    }
    ```

- PATCH actualizar un prodcuto: 
  - URL: `http://localhost:3000/api/v1/products/1`
  - Body:
    ```json
    {
      "name":"pollo",
      "price": 12
    }
    ```

- GET un producto por ID: 
  - URL: `http://localhost:3000/api/v1/products/1`

Swagger
- URL: `http://localhost:3000/api`


## Auth
- POST crear un Usuario: 
  - URL: `http://localhost:3000/api/v1/auth/register`
  - Body:
    ```json
    {
     "email": "test@gmail.com",
     "name":"test",
     "password":"test"
    }
    ```


## Orders
- GET todos las ordenes: 
  - URL: `http://localhost:3000/api/v1/orders/`

- POST crear una order: 
  - URL: `http://localhost:3000/api/v1/orders/create`
  - Body:
    ```json
    {
      "productId": 1,

      "userId": 1
    }
    ```

- PATCH actualizar una order 
  - URL: `http://localhost:3000/api/v1/orders/1`
  - Body:
    ```json
    {
      "productId": 1,
      "delivered": true,
      "userId": 1
    }
    ```

- GET un order por ID: 
  - URL: `http://localhost:3000/api/v1/orders/1`

Swagger
- URL: `http://localhost:3003/api` #Desativate

Metrics
- URL: `http://localhost:3003/metrics` #Desativate

Para ejecutar Los test se debe instalar las dependencias

```bash

npm i

npm run test

```