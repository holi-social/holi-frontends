const { ApolloLink } = require('@apollo/client');

const createUploadLink = () => {
  return new ApolloLink((operation, forward) => {
    return forward(operation);
  });
};

module.exports = createUploadLink; 