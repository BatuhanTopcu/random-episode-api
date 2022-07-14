const whitelist = [
  "https://random-episode.netlify.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: whitelist,
  optionsSuccessStatus: 200,
};

export default corsOptions;
