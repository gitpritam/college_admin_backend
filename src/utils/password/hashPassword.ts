/**
 * Hashes a plain text password using bcrypt with a specified number of salt rounds.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password string.
 * @throws {Error} If password hashing is not successful.
 */
import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Password hashing not successful.");
  }
};

export default hashPassword;
