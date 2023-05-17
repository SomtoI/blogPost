/* 
Combining all the resolver functions into a single object
Makes for cleaner and more readable code.
*/

import userResolvers from "./userResolvers.js";
import postResolvers from "./postResolvers.js";
import commentResolvers from "./commentResolvers.js";

const resolvers = {
  ...userResolvers,
  ...postResolvers,
  ...commentResolvers,
  Mutation: {
    ...userResolvers.Mutation,
    login: userResolvers.Mutation.login,
  },
};

export default resolvers;
