import poolPromise from "../db/connection";

const createComment = async (args) => {
  const { postId, authorId, content } = args;

  // Save the comment to the database
  const pool = await poolPromise;
  const request = pool.request();
  request.input("postId", postId);
  request.input("authorId", authorId);
  request.input("content", content);
  await request.query(
    "INSERT INTO PostComment (postId, authorId, content) VALUES (@postId, @authorId, @content)"
  );

  return {
    post: getPostById(postId),
    author: getUserById(authorId),
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const getComments = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM PostComment");

  return result.recordset;
};

export default {
  createComment,
  getComments,
};
