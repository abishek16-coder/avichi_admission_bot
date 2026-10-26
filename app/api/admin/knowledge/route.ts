import { loadKnowledge, saveKnowledge } from "@/lib/knowledge";

function authorized(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  const header = request.headers.get("x-admin-secret");
  return Boolean(secret && header && header === secret);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ markdown: await loadKnowledge() });
}

export async function PUT(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const markdown = String(body?.markdown ?? "");
  try {
    await saveKnowledge(markdown);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save.";
    return Response.json({ error: message }, { status: 400 });
  }
  return Response.json({ ok: true });
}
