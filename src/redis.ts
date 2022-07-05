import * as redis from "redis";

const redis_url = process.env.REDIS_URL;

export let ready = false;

const client = redis.createClient({
  url: redis_url,
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error(err);
  }
})();

client.on("ready", function () {
  ready = true;
});

export default client;
