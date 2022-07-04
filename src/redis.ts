import * as redis from "redis";

const redis_url = process.env.REDIS_URL;

const client = redis.createClient({
  url: redis_url,
});

export default client;