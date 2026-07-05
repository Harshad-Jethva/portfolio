import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = "postgres://postgres:postgres@localhost:5432/portfolio";

const pool = new Pool({
  connectionString,
});

async function run() {
  try {
    console.log("Connecting to local database...");
    
    // Delete all existing users
    console.log("Deleting all existing admin credentials...");
    await pool.query("DELETE FROM users;");

    // Hash the new password
    console.log("Hashing password 'Harshad@2115'...");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("Harshad@2115", salt);

    // Insert the new credentials
    console.log("Inserting new user 'Harshad'...");
    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2);",
      ["Harshad", hash]
    );

    console.log("Successfully updated admin credentials!");
    console.log("Username: Harshad");
    console.log("Password: Harshad@2115");
    console.log("Hashed value:", hash);

  } catch (error) {
    console.error("Error updating credentials:", error);
  } finally {
    await pool.end();
  }
}

run();
