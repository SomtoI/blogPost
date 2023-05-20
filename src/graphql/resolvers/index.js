/* 
Combining all the resolver functions into a single object
Makes for cleaner and more readable code.
*/

const userResolvers = require("./userResolvers.js");
const postResolvers = require("./postResolvers.js");

const resolvers = {
  ...userResolvers,
  ...postResolvers,
  Mutation: {
    ...userResolvers.Mutation,
    login: userResolvers.Mutation.login,
  },
};

module.exports = resolvers;
