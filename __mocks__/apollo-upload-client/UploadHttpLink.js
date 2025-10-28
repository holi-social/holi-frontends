const { ApolloLink } = require('@apollo/client')

class UploadHttpLink extends ApolloLink {
  constructor() {
    super((operation, forward) => {
      return forward(operation)
    })
  }
}

module.exports = UploadHttpLink