import { Pool } from "pg";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  const { pid } = body;

  try {
    const client = await pool.connect();
    await client.query("UPDATE public.patient SET busy = true WHERE pid = $1", [
      pid,
    ]);
    client.release();
    return NextResponse.json({ message: "Patient accepted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
