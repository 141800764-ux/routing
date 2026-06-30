import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cache = global.mongooseCache;

if (!cache) {
  cache = global.mongooseCache = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  if (cache?.conn) {
    return cache.conn;
  }

  if (!cache?.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance);
  }

  cache.conn = await cache.promise;

  return cache.conn;
}

export default dbConnect;
export { dbConnect, dbConnect as connectToDB };