import mongoose from "mongoose";
import { systemLogger } from "./log.config";

const env = process.env.NODE_ENV?.trim().toLowerCase() || "dev";
const DB_CONNECTION_URI: Record<string, { uri: string }> = {
  local: { uri: process.env.DB_LOCAL || "" },
  dev: { uri: process.env.DB_DEV || "" },
  prod: { uri: process.env.DB_PROD || "" },
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
    systemLogger.info(`Database connected for ${env} environment`);
  } catch (error: unknown) {
    if (error instanceof Error)
      systemLogger.error("Database Connection Error", {
        message: error.message,
        errorName: (error as Error).name,
      });
    process.exit(1);
  }
};

export default connectDB;
