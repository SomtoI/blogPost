const Sequelize = require("sequelize");
const db = require("../db");
const Post = require("./Post");

const User = db.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
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
});

User.findByEmail = function (email) {
  return this.findOne({ where: { email } });
};

User.prototype.getPosts = async function () {
  const posts = await Post.findAll({ where: { authorId: this.id } });
  return posts;
};

module.exports = User;
