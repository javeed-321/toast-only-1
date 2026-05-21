import { NextResponse } from "next/server";

// Runs as a Vercel serverless function — only wakes on a submission, then sleeps.
// Writes to Supabase over its REST (PostgREST) endpoint with plain fetch, so the
// app ships no Supabase client to the browser and adds no npm dependency.
export const runtime = "nodejs";

const MAX_MESSAGE = 2000;
const MAX_EMAIL = 200;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { message, rating, email, page, company } = (payload ?? {}) as Record<
    string,
    unknown
  >;

  // Honeypot: real users never see/fill the hidden "company" field — bots do.
  // Pretend success so the bot moves on, but store nothing.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const text = typeof message === "string" ? message.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (text.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  // SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set automatically by the Vercel
  // Supabase integration. The service-role key stays on the server only — it is
  // never sent to the browser — so it's safe to use it to insert here.
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "Feedback: missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars",
    );
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const row = {
    message: text,
    rating:
      typeof rating === "number" && rating >= 1 && rating <= 5
        ? Math.round(rating)
        : null,
    email:
      typeof email === "string" && email.trim()
        ? email.trim().slice(0, MAX_EMAIL)
        : null,
    page: typeof page === "string" ? page.slice(0, 300) : null,
  };

  const res = await fetch(`${url}/rest/v1/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Feedback: Supabase insert failed", res.status, detail);
    return NextResponse.json({ error: "Could not save feedback" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
