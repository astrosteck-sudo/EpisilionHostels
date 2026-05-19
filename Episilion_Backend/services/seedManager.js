const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");


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



// console.log(getUniqueUUID()); // Prints a unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID
// console.log(getUniqueUUID()); // Prints another unique UUID



async function hashPasswords() {
  const hashedPassword1 = await bcrypt.hash('df1ed072-fc59-4dfb-ae5c-31507059ebe8', 10);
  const hashedPassword2 = await bcrypt.hash('e1da9317-c417-41d3-a050-aac131e4ece9', 10);
  const hashedPassword3  = await bcrypt.hash('da3488e4-f0e1-4876-9d82-0687a96a315e', 10);
  const hashedPassword4  = await bcrypt.hash('ff802922-5f67-4b63-a68b-9f324ddb492a', 10);
  const hashedPassword5  = await bcrypt.hash('cc617cd9-266a-4dd8-b51f-9b5f32cdedcb', 10);
  const hashedPassword6  = await bcrypt.hash('eb8c46b9-6843-4fa8-98fa-303a81dcaa8a', 10);
  const hashedPassword7  = await bcrypt.hash('caa1f62b-34c6-4dcc-9634-dd6af35135b1', 10);
  const hashedPassword8  = await bcrypt.hash('c9a6b218-ff39-458b-a936-755feb7e44b0', 10);
  const hashedPassword9  = await bcrypt.hash('1bc05473-82cf-4bbf-b10d-f85019ede655', 10);
  const hashedPassword10  = await bcrypt.hash('4b45c974-637f-461d-8b4b-d34d09707e7f', 10);
  console.log("Hashed Password Htc Hostel:",      hashedPassword1);
  console.log("Hashed Password Mab3 Hostels:",    hashedPassword2);
  console.log("Hashed Password Makassela:",       hashedPassword3);
  console.log("Hashed Password Blessed Hostel:",  hashedPassword4);
  console.log("Hashed Password Campus Annex:",    hashedPassword5);
  console.log("Hashed Password Princeps Hostel:", hashedPassword6);
  console.log("Hashed Password Bendebi Hostel:",  hashedPassword7);
  console.log("Hashed Password New Century Hostel:", hashedPassword8);
  console.log("Hashed Password Obrempong Hostel:", hashedPassword9);
  console.log("Hashed Password Urbyn Hostel:", hashedPassword10);
}
hashPasswords();


// Use a Set to store previously generated UUIDs


// const seedManagers = async () => {
//   try { 

//     // TEST PASSWORDS
//     const password1 = "hostel123";
//     const password2 = "manager456";

//     // HASH PASSWORDS
//     const hashedPassword1 = await bcrypt.hash(password1, 10);
//     const hashedPassword2 = await bcrypt.hash(password2, 10);

//     // INSERT FIRST MANAGER
//     const query1 = `
//       INSERT INTO hostel_managers
//       (manager_hostel_id, username, password_hash)
//       VALUES (?, ?, ?)
//     `;

//     db.query(
//       query1,
//       ['141c9727-155b-472c-b75e-27715725f27c', "Htc Towers", hashedPassword1],
//       (err, result) => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log("First manager inserted");
//         }
//       }
//     );

//     // INSERT SECOND MANAGER
//     const query2 = `
//       INSERT INTO hostel_managers
//       (manager_hostel_id, username, password_hash)
//       VALUES (?, ?, ?)
//     `;

//     db.query(
//       query2,
//       ['170ab6f9-9a50-4598-8858-188f59577bf3', 'Mab3 Hostels', hashedPassword2],
//       (err, result) => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log("Second manager inserted");
//         }
//       }
//     );

//   } catch (error) {
//     console.error(error);
//   }
// };

// seedManagers();
