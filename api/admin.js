
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "solana_miner";
const ADMIN_TOKEN = "secretadmin123";

export default async function handler(req, res) {
  const token = req.method === "GET" ? req.query.token : req.body.token;
  if (token !== ADMIN_TOKEN) return res.status(403).json({ error: "Unauthorized" });

  await client.connect();
  const db = client.db(dbName);

  if (req.method === "GET") {
    const action = req.query.action;
    if (action === "deposits") {
      const deposits = await db.collection("deposits").find({ status: "pending" }).toArray();
      return res.status(200).json(deposits);
    }
    return res.status(400).json({ error: "Unknown action" });
  }

  if (req.method === "POST") {
    const { id, action, type } = req.body;
    const collection = type === "deposit" ? "deposits" : "withdrawals";
    const newStatus = action === "approve" ? "approved" : "rejected";

    await db.collection(collection).updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: newStatus, reviewed_at: new Date() } }
    );
    return res.status(200).json({ message: `${action}d` });
  }

  return res.status(405).end();
}
