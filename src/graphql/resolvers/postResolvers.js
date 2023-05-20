const Post = require("../../db/models/Post");
const {
  authenticationError,
  authorizationError,
} = require("../../utils/errorHandling");

const postResolvers = {
  Query: {
    posts: authenticationError()(async () => {
      try {
        const posts = await Post.findAll();
        return posts;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
      }
    }),
    post: authenticationError()(async (_, { id }) => {
      try {
        const post = await Post.findByPk(id);
        if (!post) {
          throw new Error(`Post with ID ${id} not found`);
        }
        return post;
      } catch (error) {
        console.error(`Error fetching post with ID ${id}:`, error);
        throw new Error(`Failed to fetch post with ID ${id}`);
      }
    }),
  },
  Mutation: {
    createPost: authenticationError()(
      async (_, { title, content }, context) => {
        try {
          if (!context.user) {
            throw new Error("Authentication required");
          }
          const authorId = context.user.id;
          const post = await Post.create({
            title,
            content,
            authorId,
          });
          return post;
        } catch (error) {
          console.error("Error creating post:", error);
          throw new Error("Failed to create post");
        }
      }
    ),

    updatePost: authenticationError()(
      async (_, { id, title, content }, context) => {
        try {
          // Check if the user is authenticated
          if (!context.user) {
            throw new Error("Authentication required");
          }

          // Find the post by ID
          const post = await Post.findByPk(id);
          if (!post) {
            throw new Error(`Post with ID ${id} not found`);
          }

          // Check if the authenticated user is the author of the post
          authorizationError(post, context);

          // Update the post
          const updatedPost = await post.update({ title, content });

          return updatedPost;
        } catch (error) {
          console.error(`Error updating post with ID ${id}:`, error);
          throw new Error(`Failed to update post with ID ${id}`);
        }
      }
    ),

    deletePost: authenticationError()(async (_, { id }, context) => {
      try {
        // Check if the user is authenticated
        if (!context.user) {
          throw new Error("Authentication required");
        }

        // Find the post by ID
        const post = await Post.findByPk(id);
        if (!post) {
          throw new Error(`Post with ID ${id} not found`);
        }

        authorizationError(model, context);

        // Delete the post
        await post.destroy();

        return id;
      } catch (error) {
        console.error(`Error deleting post with ID ${id}:`, error);
        throw new Error(`Failed to delete post with ID ${id}`);
      }
    }),
  },
  Post: {
    author: async (post) => {
      try {
        const author = await post.getAuthor(); // Assuming the Post model has an 'getAuthor' association method
        return author;
      } catch (error) {
        console.error(
          `Error fetching author for post with ID ${post.id}:`,
          error
        );
        throw new Error(`Failed to fetch author for post with ID ${post.id}`);
      }
    },
  },
};

module.exports = postResolvers;