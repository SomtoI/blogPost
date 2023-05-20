const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./User");
const Post = db.define("post", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
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
  authorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Post.prototype.getAuthor = async function () {
  try {
    const author = await User.findByPk(this.authorId);
    return author;
  } catch (error) {
    console.error(`Error fetching author for post with ID ${this.id}:`, error);
    throw new Error(`Failed to fetch author for post with ID ${this.id}`);
  }
};

module.exports = Post;
/*
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
  }
);

export default Post;
*/
