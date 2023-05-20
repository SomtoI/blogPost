# Define the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy application files
COPY package.json package-lock.json ./
COPY ./src .

# Set the environment variable for the database file path
ENV DATABASE_FILE=/app/src/database.db

# Install dependencies
RUN npm install

# Run seed script
RUN npm run seed

# Expose the necessary ports
EXPOSE 4000

# Define the container command
CMD ["node", "src/server.js"]
