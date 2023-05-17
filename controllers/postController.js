import poolPromise from "../db/connection";

const createPost = async (args) => {
  const { title, content, authorId } = args;

  // Save the post to the database
  const pool = await poolPromise;
  const request = pool.request();
  request.input("title", title);
  request.input("content", content);
  request.input("authorId", authorId);
  const result = await request.query(
    "INSERT INTO Post (title, content, authorId) VALUES (@title, @content, @authorId)"
  );
  const postId = result.recordset[0].id;

  return {
    id: postId,
    title,
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const getPosts = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM Post");

  return result.recordset;
};

module.exports = {
  createPost,
  getPosts,
};
