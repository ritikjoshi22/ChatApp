# Use a smaller base image
FROM node:20-alpine

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port (optional, specify if your app runs on a specific port)
# EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
