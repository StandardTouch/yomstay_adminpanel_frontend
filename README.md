# Steps to Add StandardTouch API Securely :-

## 1. Update [`.gitignore`]
Add the following to your [`.gitignore`] to avoid exposing sensitive files:

```gitignore
.env
.npmrc
```

## 2. Create [`set-npmrc.js`]
This script will auto-generate your [`.npmrc`] with your GitHub token securely.

📄 Create a file named [`set-npmrc.js`] and paste this code inside:

```js
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
```

## 3. Create or Update [`.env`]
In the root of your project, create a [`.env`] file (or update it) with:

```env
GT_TOKEN= your token 
```

## 4. Update [`package.json`] Scripts
In your [`package.json`], add this line to the [`scripts`] section:

```json
"scripts": {
  "preinstall": "node set-npmrc.js"
}
```
This ensures the [`.npmrc`] is set up before installing any packages.

## 5. Install dotenv
Install the [`dotenv`] package to enable reading from [`.env`]:

```bash
npm install -D dotenv
```

## 6. Install Dependencies
Now you can install all packages:

```bash
npm install 
```

## 7. Install StandardTouch API
Finally, install the API package:

```bash
npm install @StandardTouch/yomstay_api
```

✅ Done!