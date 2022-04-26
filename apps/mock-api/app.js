import { faker } from '@faker-js/faker'
import { ApolloServerPluginDrainHttpServer, gql } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { program } from 'commander'
import express from 'express'
import { readFileSync } from 'fs'
import http from 'http'

const DEFAULT_PORT = 4000

program.option('--port <number>', `port on which to run the server (default: ${DEFAULT_PORT}`)

program.parse()

const options = program.opts()
const port = options.port ? parseInt(options.port, 10) : DEFAULT_PORT

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const fakeUser = () => ({
  id: faker.unique(faker.datatype.uuid),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
})

const fakePost = (users) => () => {
  const user = users[randomInt(0, users.length - 1)]

  const hasImage = Math.random() < 0.5

  return {
    id: faker.unique(faker.datatype.uuid),
    title: faker.company.catchPhrase(),
    text: faker.lorem.paragraphs(randomInt(1, 3)),
    views: randomInt(0, 10000),
    image: hasImage ? faker.image.image(600, 352) : null,
    user_id: user.id,
    User: user,
  }
}

const fakeUsers = Array.from({ length: randomInt(0, 100) }, fakeUser)
const fakePosts = Array.from({ length: fakeUsers.length === 0 ? 0 : randomInt(0, 100) }, fakePost(fakeUsers))

console.info(`${fakeUsers.length} fake user(s) and ${fakePosts.length} fake post(s)`)

const typeDefs = gql(readFileSync('./schema.graphql').toString('utf-8'))
const resolvers = {
  Query: {
    allUsers: (_, args) => {
      console.info('allUsers', args)
      const offset = args.offset || 0
      const limit = args.limit || fakePosts.length
      const result = fakeUsers.slice(offset, offset + limit)
      return result
    },
    allPosts: (_, args) => {
      console.info('allPosts', args)
      const offset = args.offset || 0
      const limit = args.limit || fakePosts.length
      const result = fakePosts.slice(offset, offset + limit)
      return result
    },
    Post: (_, args) => {
      const postFound = fakePosts.find((p) => p.id === args.id)
      console.info('Post', args)
      return postFound
    },
    User: (_, args) => {
      const userFound = fakeUsers.find((u) => u.id === args.id)
      console.info('User', args)
      return userFound
    },
  },
}

const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})
server
  .start()
  .then(() => {
    server.applyMiddleware({ app, cors: true })
    return new Promise((resolve) => httpServer.listen({ port }, resolve))
  })
  .then(() => {
    console.info(`Server up and running at http://localhost:${port}/graphql`)
  })
