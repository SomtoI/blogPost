const { ForbiddenError } = require("apollo-server-express");

// wraps the resolver and returns higher order function
//Authenticates that user has access to this resolver, if not, throws error
function authenticationError() {
  return (resolver) => async (parent, args, context, info) => {
    if (Object.keys(context).length === 0) {
      const error = new ForbiddenError("You are unauthorized to access this");
      error.extensions = { code: "UNAUTHORIZED" };
      throw error;
    }

    return resolver(parent, args, context, info);
  };
}

function authorizationError(model, context) {
  if (model.authorId !== context.user.id) {
    const error = new ForbiddenError("You are unauthorized to access this");
    error.extensions = { code: "UNAUTHORIZED" };
    throw error;
  }
}

//function for setting status codes based on error responses
function customErrorFormatter(error) {
  if (error.extensions && error.extensions.code === "UNAUTHORIZED") {
    // Add the 401 status code to the response
    return {
      message: error.message,
      code: 401,
    };
  }

  // Default error formatting
  return error;
}

module.exports = {
  authenticationError,
  customErrorFormatter,
  authorizationError,
};
