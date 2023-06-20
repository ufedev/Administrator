require("dotenv").config()
require("./db/mongodb")
const jwt = require("jsonwebtoken")
const { ApolloServer } = require("apollo-server")
const { resolvers } = require("./db/resolvers")
const { typeDefs } = require("./db/schema")
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["authorization"] ?? ""
    try {
      if (token !== "") {
        const verificarToken = jwt.verify(token, "HolaMundoPrivateKey")
        if (verificarToken) {
          return {
            usuario: {
              id: verificarToken.id,
            },
          }
        } else {
          return {
            usuario: null,
          }
        }
      } else {
        return {
          usuario: null,
        }
      }
    } catch (err) {
      return {
        usuario: null,
      }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(url)
})
