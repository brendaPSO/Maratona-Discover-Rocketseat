const express = require('express');
const server = express();
const routes = require('./routes')

server.set('view engine', 'ejs')

//acessar os aquivos estáticos public
server.use(express.static("public"))

//habilitar o req.body
server.use(express.urlencoded({ extended: true }))

server.use(routes)

server.listen(3000, () => console.log("rodando"));