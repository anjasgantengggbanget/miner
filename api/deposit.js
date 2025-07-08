
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "solana_miner";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_id, amount, method } = req.body;
    if (!user_id || !amount || !method) return res.status(400).json({ error: "Missing data" });

    try {
      await client.connect();
      const db = client.db(dbName);
      const deposits = db.collection("deposits");

      const newDeposit = {
        user_id,
        amount: parseFloat(amount),
        method,
        status: "pending",
        created_at: new Date()
      };

      await deposits.insertOne(newDeposit);
      return res.status(200).json({ message: "Deposit submitted" });
    } catch (err) {
      return res.status(500).json({ error: "DB error", details: err.message });
    }
  } else {
    res.status(405).end();
  }
}
