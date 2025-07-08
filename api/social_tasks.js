
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "solana_miner";

export default async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const social = db.collection("social_tasks");

  if (req.method === "GET") {
    const tasks = await social.find().toArray();
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const { title, url, reward } = req.body;
    if (!title || !url || !reward) return res.status(400).json({ error: "Missing fields" });

    await social.insertOne({ title, url, reward });
    return res.status(200).json({ message: "Task created" });
  }

  return res.status(405).end();
}
