# Base image
FROM node:14.16.0-alpine3.10

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port that the app listens on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
