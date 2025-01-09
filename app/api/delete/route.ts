import { Pool } from "pg";
import { NextApiRequest, NextApiResponse } from "next";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { pid } = req.body;

  try {
    const client = await pool.connect();
    await client.query("DELETE FROM public.patient WHERE pid = $1", [pid]);
    client.release();
    res.status(200).json({ message: "Patient deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
