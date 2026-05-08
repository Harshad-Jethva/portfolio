import { NextResponse } from "next/server";
import { trackMediaAsset } from "@/lib/portfolioRepository";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer then to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a Data URL (e.g., data:image/png;base64,...)
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    // Sanitize filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const originalName = file.name
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    
    const filename = `${timestamp}-${originalName}.${extension}`;

    // Store the image content directly in the database
    try {
      await trackMediaAsset({
        fileName: filename,
        publicUrl: dataUrl, // The Data URL is the "public url" now
        fileType: file.type,
        fileSize: file.size,
        content: base64Data
      });
    } catch (dbError) {
      console.error("Failed to store media in database:", dbError);
      return NextResponse.json({ 
        error: "Database storage failed: " + dbError.message 
      }, { status: 500 });
    }

    // Return the Data URL to be used as the image source
    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}




