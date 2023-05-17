import { Comment } from "../models/index.js";

const commentResolvers = {
  Query: {
    comments: async () => {
      try {
        const comments = await Comment.findAll();
        return comments;
      } catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
      }
    },
    getCommentById: async (_, { id }) => {
      try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
          throw new Error(`Comment with ID ${id} not found`);
        }
        return comment;
      } catch (error) {
        console.error(`Error fetching comment with ID ${id}:`, error);
        throw new Error(`Failed to fetch comment with ID ${id}`);
      }
    },
  },
  Mutation: {
    createComment: async (_, { input }) => {
      try {
        const comment = await Comment.create(input);
        return comment;
      } catch (error) {
        console.error("Error creating comment:", error);
        throw new Error("Failed to create comment");
      }
    },
    updateComment: async (_, { id, input }) => {
      try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
          throw new Error(`Comment with ID ${id} not found`);
        }
        await comment.update(input);
        return comment;
      } catch (error) {
        console.error(`Error updating comment with ID ${id}:`, error);
        throw new Error(`Failed to update comment with ID ${id}`);
      }
    },
    deleteComment: async (_, { id }) => {
      try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
          throw new Error(`Comment with ID ${id} not found`);
        }
        await comment.destroy();
        return true;
      } catch (error) {
        console.error(`Error deleting comment with ID ${id}:`, error);
        throw new Error(`Failed to delete comment with ID ${id}`);
      }
    },
  },
};

export default commentResolvers;
