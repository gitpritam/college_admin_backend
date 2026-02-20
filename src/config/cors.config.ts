const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN || "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
  ],
  credentials: true,
};

export default corsOptions;
