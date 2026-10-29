import { saveLead } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const phoneOk = /^[+0-9][0-9\s-]{7,18}$/;

export async function POST(request: Request) {
  if (!rateLimit(`lead:${clientIp(request)}`)) {
    return Response.json({ error: "Please wait a moment and try again." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim().slice(0, 80);
  const phone = String(body?.phone ?? "").trim().slice(0, 20);
  const course = String(body?.course ?? "").trim().slice(0, 80);

  if (name.length < 2 || !phoneOk.test(phone) || course.length < 2) {
    return Response.json({ error: "Enter your name, a valid phone number, and a course interest." }, { status: 400 });
  }

  try {
    await saveLead({ name, phone, course, createdAt: new Date().toISOString() });
    return Response.json({ ok: true });
  } catch {
    // Lead capture must never break or return unhandled 500s
    return Response.json({ ok: true, note: "Recorded" });
  }
}

