import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import corsOptions from "./corsOptions";
//Routes
import SearchRoute from "./routes/search";
import SingleEpisodeRoute from "./routes/singleEpisode";
import MultipleEpisodeRoute from "./routes/multipleEpisode";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(morgan("tiny"));

app.use("/search", SearchRoute);
app.use("/singleEpisode", SingleEpisodeRoute);
app.use("/multipleEpisode", MultipleEpisodeRoute);

app.get("/", async (req: Request, res: Response) => {
  res.send("Hi");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
