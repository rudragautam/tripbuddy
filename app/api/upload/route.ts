import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "tripbuddy",
    });

    return NextResponse.json({
      message: "Upload successful",
      imageUrl: uploaded.secure_url,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}