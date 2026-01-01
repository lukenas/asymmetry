import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return NextResponse.json(
      { error: "Beehiiv API credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    
    // Use expand parameter to get the web content
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts/${id}?expand[]=free_web_content`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Beehiiv API error:", {
        status: response.status,
        statusText: response.statusText,
        url: `https://api.beehiiv.com/v2/publications/${publicationId}/posts/${id}`,
        error: errorText
      });
      return NextResponse.json(
        { error: "Failed to fetch post from Beehiiv", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Beehiiv post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

