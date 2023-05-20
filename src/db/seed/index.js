// Import necessary dependencies
//const fs = require("fs");
const db = require("../db");
const hashPassword = require("../../utils/auth.js").hashPassword;
const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");

// Seed function to create data
async function seed() {
  await db.sync({ force: true }); // force set to true so every time the server is restarted the table gets dropped and created again
  console.log("db schema synced!");

  await seedUsers();
  await seedPostsAndComments();
}

const seedUsers = async () => {
  try {
    // Define the number of users you want to create
    const numUsers = 5;

    // Generate dummy user data
    const usersData = [
      { username: "user1", email: "user1@example.com", password: "password1" },
      { username: "user2", email: "user2@example.com", password: "password2" },
      { username: "user3", email: "user3@example.com", password: "password3" },
      { username: "user4", email: "user4@example.com", password: "password4" },
      { username: "user5", email: "user5@example.com", password: "password5" },
    ];

    // Create users using the dummy data
    const createdUsers = await Promise.all(
      usersData.slice(0, numUsers).map(async (userData) => {
        const hashedPassword = await hashPassword(userData.password);
        const user = await User.create({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
        });
        return user;
      })
    );

    console.log(`Created ${createdUsers.length} users`);
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

// Seed function to create posts and comments
const seedPostsAndComments = async () => {
  try {
    // Define the number of posts you want to create
    const numPosts = 100;

    // Generate dummy post data
    const postsData = Array.from({ length: numPosts }, (_, index) => ({
      title: `Post ${index + 1}`,
      content: `Content of Post ${index + 1}`,
      authorId: Math.floor(Math.random() * 5) + 1, // Randomly assign authorId from 1 to 5
    }));

    // Create posts using the dummy data
    const createdPosts = await Post.bulkCreate(postsData);

    console.log(`Created ${createdPosts.length} posts`);

    // Generate dummy comment data. Creates comments for each post using the reduce function
    //Function is used to accumulate all comments ceated and return them

    const commentsData = createdPosts.reduce((acc, post) => {
      const numComments = Math.floor(Math.random() * 4) + 2; // Random number of comments between 2 and 5
      const comments = Array.from({ length: numComments }, () => ({
        content: `Comment content for ${post.title}`,
        userId: Math.floor(Math.random() * 5) + 1, // Randomly assign userId from 1 to 5
        postId: post.id,
      }));
      return [...acc, ...comments];
    }, []);

    // Create comments using the dummy data
    const createdComments = await Comment.bulkCreate(commentsData);

    console.log(`Created ${createdComments.length} comments`);
  } catch (error) {
    console.error("Error seeding posts and comments:", error);
  }
};

// Function to seed the database
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = { runSeed };
