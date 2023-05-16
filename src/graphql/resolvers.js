// Import your models and controllers here
import { createUser, getUsers } from "../controllers/userController";
import { createPost, getPosts } from "../controllers/postController";
import { createComment, getComments } from "../controllers/commentController";

export default {
  hello: () => "Hello, world!",
  users: getUsers,
  createUser,
  posts: getPosts,
  createPost,
  comments: getComments,
  createComment,
};
