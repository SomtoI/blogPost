# Define the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy application files
COPY package.json package-lock.json ./
COPY src ./src
# Copy the .env file
COPY .env ./.env
# Set the environment variable for the database file path
ENV DATABASE_FILE=/app/src/database.db

# Install dependencies
RUN npm install

# Install test dependencies
#RUN npm install --only=dev

# Run tests
#RUN npm test

# Run seed script
RUN npm run seed

# Expose the necessary ports
EXPOSE 4000

# Define the container command
CMD ["node", "src/server.js"]
