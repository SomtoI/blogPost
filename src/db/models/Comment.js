const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./User");
const Post = require("./Post");

const Comment = db.define("comment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  postId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

User.hasMany(Post, { as: "Posts", foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });

module.exports = Comment;
