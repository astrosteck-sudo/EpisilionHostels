const bcrypt = require("bcrypt");

async function hashPasswords() {
  const hashedPassword1 = await bcrypt.hash('password1', 10);
  const hashedPassword2 = await bcrypt.hash('password2', 10);
  const hashedPassword3  = await bcrypt.hash('password3', 10);
  console.log("Hashed Password 1:", hashedPassword1);
  console.log("Hashed Password 2:", hashedPassword2);
  console.log("Hashed Password 3:", hashedPassword3);
}
hashPasswords();

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
