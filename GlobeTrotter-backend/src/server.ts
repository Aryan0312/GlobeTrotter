import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "GlobeTrotter backend running!"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});



