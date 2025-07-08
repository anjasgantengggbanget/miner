
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "solana_miner";

export default async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const boosts = db.collection("boosts");

  if (req.method === "GET") {
    const plans = await boosts.find().toArray();
    return res.status(200).json(plans);
  }

  if (req.method === "POST") {
    const { title, rate, price } = req.body;
    if (!title || !rate || !price) return res.status(400).json({ error: "Missing fields" });

    await boosts.insertOne({ title, rate, price });
    return res.status(200).json({ message: "Boost added" });
  }

  return res.status(405).end();
}
