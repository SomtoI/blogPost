const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");
const User = require("./User");
const Post = require("./Post");

const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

Comment.belongsTo(User, { foreignKey: "authorId", as: "author" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

module.exports = Comment;
