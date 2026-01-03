import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { ApiError } from "./utils/apiError";

dotenv.config();

import authRoutes from "./routes/authRoutes";
import rootRoutes from "./routes/rootRoutes";

const app = express();

const expressSessionSecret = process.env.EXPRESS_SESSION_SECRET_KEY;

if (!expressSessionSecret) {
  throw new Error("Missing EXPRESS_SESSION_SECRET_KEY in environment variables");
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: expressSessionSecret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 4 // 4 hours max age
  }
}));

app.use(cors());


app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "GlobeTrotter backend running!"
  });
});

app.use("/api/auth", authRoutes);
app.use("/", rootRoutes);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});



