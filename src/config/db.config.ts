import mongoose from "mongoose";

const env = process.env.NODE_ENV?.trim().toLowerCase() || "dev";
const DB_CONNECTION_URI: Record<string, { uri: string }> = {
  local: { uri: process.env.DB_LOCAL || "" },
  dev: { uri: process.env.DB_DEV || "" },
  prod: { uri: process.env.prod || "" },
};

// Validate the selected environment
if (!DB_CONNECTION_URI[env] || !DB_CONNECTION_URI[env].uri) {
  throw new Error(`Database URI is missing for environment: ${env}`);
}

const DB_URI = DB_CONNECTION_URI[env].uri;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Database connected for ${env} environment`);
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("Database Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
