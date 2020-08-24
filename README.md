# Round 1 backend

# Steps to run

> Copy env.example to .env
> Copy config/example.json to config/database.json
> Create database configured in env
> Run "npm i"
> Run "npm run migrations"
> Run "npm start" 

# APIs

## /api/login => POST

body = {
  username: 'string',
  password: 'string',
}

Login using a static username and password that can be configured from envs

## /user-control/create => POST

body = {
  email: 'string',
  phoneNumber: 'string',
  password: 'string',
  name: 'string',
  userName: 'string',
}

Create a user after being logged in. (Is JWT protected)

## /user-control/validate => POST

body = {
  email: 'string',
  password: 'string',
}

Validates user by email and password. (Was not really clear about the requirements in this one)

## /user-control/item => GET

query = {
  id: 'number'
}

Gets item by id (Is JWT protected)

## /user-control/order => GET

query = {
  id: 'number'
}

Gets order detail by id (Is JWT protected)

## /google-login => POST

body = {
  email: 'string',
  token: 'string'
}

Validates google token and issues a JWT to the requester
(Sorry :( , I didn't get much time to integrate swagger, otherwise it would have saved much time testing these )