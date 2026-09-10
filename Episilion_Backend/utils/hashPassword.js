// hashPassword.js
// Usage: node hashPassword.js yourPasswordHere

const bcrypt = require("bcrypt");

const password = process.argv[2];

if (!password) {
  console.error("❌ Please provide a password.\nUsage: node hashPassword.js yourPasswordHere");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log("Password:", password);
  console.log("Bcrypt hash:", hash);
});