// Load the UUID library (install with: npm install uuid)
const { v4: uuidv4 } = require("uuid");

// Use a Set to store previously generated UUIDs
const generatedUUIDs = new Set();

/**
 * Generate a unique UUID
 * - Uses uuidv4() to create a random UUID
 * - Ensures it hasn't been generated before
 * - Stores it in the Set
 * - Returns the unique UUID
 */
 function getUniqueUUID() {
  let newUUID;

  do {
    newUUID = uuidv4(); // Generate a random UUID
  } while (generatedUUIDs.has(newUUID)); // Keep generating until unique

  generatedUUIDs.add(newUUID); // Store it
  return newUUID;
}

// Example usage
console.log(getUniqueUUID()); // Prints a unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID
console.log(getUniqueUUID()); // Prints another unique UUID

console.log(getUniqueUUID()); // Prints another unique UUID

