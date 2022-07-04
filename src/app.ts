import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios_t from "./axios_token";
import morgan from "morgan";
import SearchRoute from "./routes/search";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(morgan("tiny"));

app.use("/search", SearchRoute);

app.get("/", async (req: Request, res: Response) => {
  try {
    const data = await axios_t.get("/discover/movie");
    res.send(data.data);
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
