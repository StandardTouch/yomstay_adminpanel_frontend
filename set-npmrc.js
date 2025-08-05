import { config } from "dotenv"; // Importing dotenv's config function
import fs from "fs"; // Importing fs module

// Load the environment variables from .env file
config();

// Get the token from the environment variables
const token = process.env.GT_TOKEN;

// Path to the .npmrc file
const npmrcPath = "./.npmrc";

// Create the .npmrc file content with the token
const npmrcContent = `@StandardTouch:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${token}
`;

// Write the content to the .npmrc file
fs.writeFileSync(npmrcPath, npmrcContent, { encoding: "utf8" });

console.log(".npmrc file has been updated with the GitHub token.");
