import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios_t from "./axios_token";
import morgan from "morgan";
import SearchRoute from "./routes/search";
import RandomEpisodeRoute from "./routes/randomEpisode";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(morgan("tiny"));

app.use("/search", SearchRoute);
app.use("/randomEpisode", RandomEpisodeRoute);

app.get("/", async (req: Request, res: Response) => {
  res.send("Hi");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
