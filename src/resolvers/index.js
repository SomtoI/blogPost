/* 
Combining all the resolver functions into a single object
Makes for cleaner and more readable code.
*/

import userResolvers from "./userResolvers";
import postResolvers from "./postResolvers";
import commentResolvers from "./commentResolvers";

const resolvers = {
  ...userResolvers,
  ...postResolvers,
  ...commentResolvers,
};

export default resolvers;
