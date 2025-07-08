
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "solana_miner";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_id, amount, wallet } = req.body;
    if (!user_id || !amount || !wallet) return res.status(400).json({ error: "Missing data" });

    try {
      await client.connect();
      const db = client.db(dbName);
      const withdrawals = db.collection("withdrawals");

      const newWithdrawal = {
        user_id,
        amount: parseFloat(amount),
        wallet,
        status: "pending",
        created_at: new Date()
      };

      await withdrawals.insertOne(newWithdrawal);
      return res.status(200).json({ message: "Withdraw request submitted" });
    } catch (err) {
      return res.status(500).json({ error: "DB error", details: err.message });
    }
  } else {
    res.status(405).end();
  }
}
