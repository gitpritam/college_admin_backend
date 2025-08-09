import bcrypt from "bcryptjs";

const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error("Something went wrong during password comparison.");
  }
};

export default comparePassword;
