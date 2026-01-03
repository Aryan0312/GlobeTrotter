import cors from "cors";

const frontendURL = process.env.FRONT_END_URL;


export const corsConfig = cors({
    origin:frontendURL,
    credentials: true
});
