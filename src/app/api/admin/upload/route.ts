import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "bin";
    const id = crypto.randomUUID();

    let key: string;
    let publicUrl: string | null = null;

    if (type === "preview") {
      // Preview images go to public path
      key = `previews/${id}.${ext}`;
      await uploadToR2(key, buffer, file.type);
      publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    } else {
      // Product files go to private path
      key = `products/${id}.${ext}`;
      await uploadToR2(key, buffer, file.type);
    }

    return NextResponse.json({
      fileKey: key,
      publicUrl: publicUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
