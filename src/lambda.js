const { promisify } = require("util");

const { ApolloServer } = require("apollo-server-lambda");
const { ApolloError, gql } = require("apollo-server-core");

const typeDefs = gql`
  type Query {
    status: String!
  }

  type Mutation {
    throwError: Boolean!
  }
`;

const resolvers = {
  Query: {
    status: () => "Ok",
  },
  Mutation: {
    async throwError() {
      throw new ApolloError("This request won't be marked as an error by datadog");
      return true;
    },
  },
}

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers,
});

const handler = promisify(
  server.createHandler({
    cors: {
      origin: true,
      credentials: true,
    },
  })
);

exports.handler = async (event, context) => {
  return await handler(event, context);
};
