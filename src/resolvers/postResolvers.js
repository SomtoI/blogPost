import { Post } from "../models";

const postResolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.findAll();
        return posts;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
      }
    },
    getPostById: async (_, { id }) => {
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
    },
  },
  Mutation: {
    createPost: async (_, { input }) => {
      try {
        const post = await Post.create(input);
        return post;
      } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Failed to create post");
      }
    },
    updatePost: async (_, { id, input }) => {
      try {
        const post = await Post.findByPk(id);
        if (!post) {
          throw new Error(`Post with ID ${id} not found`);
        }
        await post.update(input);
        return post;
      } catch (error) {
        console.error(`Error updating post with ID ${id}:`, error);
        throw new Error(`Failed to update post with ID ${id}`);
      }
    },
    deletePost: async (_, { id }) => {
      try {
        const post = await Post.findByPk(id);
        if (!post) {
          throw new Error(`Post with ID ${id} not found`);
        }
        await post.destroy();
        return true;
      } catch (error) {
        console.error(`Error deleting post with ID ${id}:`, error);
        throw new Error(`Failed to delete post with ID ${id}`);
      }
    },
  },
};

export default postResolvers;
