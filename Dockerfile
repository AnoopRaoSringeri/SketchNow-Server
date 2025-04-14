# Use the latest LTS version of Node.js
FROM node:23-slim
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./

COPY yarn.lock ./
 
# Install dependencies
RUN yarn install

# RUN yarn build

# RUN apk add gcompat

RUN mkdir -p /app/chart-data

RUN mkdir -p /app/build
 
# Copy the rest of your application files
COPY . .
 
# Expose the port your app runs on
EXPOSE 8000
 
# Define the command to run your app
CMD ["yarn", "docker" ]