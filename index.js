const { ApolloServer, gql } = require("apollo-server");
require('dotenv').config({ path: 'variables.env' });
const resolvers = require("./db/resolvers");
const typeDefs = require("./db/schema");
const conectarDB = require("./config/db"); // Conectar a la bd
const jwt = require("jsonwebtoken");

// Conectarse a la BD
conectarDB();
// Sevidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);
                // console.log(usuario);
                return {
                    usuario
                }
            } catch (error) {
                console.log('Hubo un error: ', error);
            }
        }
    }
});

// arrancar el servidor
server.listen({port: process.env.PORT || 4000}).then(({url}) => {
    console.log(`Servidor totalmente listo en la url: ${url}`);
});
// server.listen().then(({url}) => {
//     console.log(`Servidor listo en la url: ${url}`);
// });


