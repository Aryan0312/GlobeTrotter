import cors from "cors";

const frontendURL = process.env.FRONT_END_URL || "http://localhost:5173";

export const corsConfig = cors({
    origin: frontendURL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});
