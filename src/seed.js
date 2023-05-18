// Import necessary dependencies
import { User, Post, Comment } from "./models/index.js";
import { generateToken, hashPassword } from "./utils/auth.js";

// Seed function to create users
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

    // Generate dummy comment data
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

export const seedDatabase = async () => {
  await seedUsers();
  await seedPostsAndComments();
};

// Call the seedDatabase function
seedDatabase();
