
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "solana_miner";

export default async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const config = db.collection("referral_config");

  if (req.method === "GET") {
    const data = await config.findOne();
    return res.status(200).json(data || {});
  }

  if (req.method === "POST") {
    const { level1, level2, level3 } = req.body;
    await config.updateOne({}, { $set: { level1, level2, level3 } }, { upsert: true });
    return res.status(200).json({ message: "Config updated" });
  }

  return res.status(405).end();
}
