import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

function methodNotAllowed() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function GET() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message must be 2000 characters or fewer." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
    }

    const { error } = await (supabase as any).from("messages").insert({
      name,
      email,
      phone: phone || null,
      message,
      is_read: false,
    });

    if (error) {
      return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}
