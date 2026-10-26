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
    return Response.json({ error: "Enter your name, a valid phone number, and a course." }, { status: 400 });
  }

  try {
    await saveLead({ name, phone, course, createdAt: new Date().toISOString() });
  } catch {
    return Response.json({ error: "Could not save your details. Please call the admission office." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
