
export default function handler(req, res) {
  if (req.method === "GET") {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error: "Missing user_id" });

    // Dummy user object (replace with DB logic)
    const user = {
      id: userId,
      username: "tg_user_" + userId,
      balance: 0.0,
      miningRate: 0.05,
      refCount: 0,
    };

    return res.status(200).json(user);
  } else {
    res.status(405).end();
  }
}
