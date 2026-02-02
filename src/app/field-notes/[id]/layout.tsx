import type { Metadata } from "next";

async function getPostMetadata(id: string) {
  try {
    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      return {
        title: "Field Notes",
        subtitle: "",
        description: "Insights on applied AI and product from builders in the trenches and those pushing the frontier.",
        thumbnail: null,
      };
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = await response.json();
      const post = data.data || data;
      return {
        title: post.title,
        subtitle: post.subtitle || "",
        description: post.subtitle || post.preview_text || "Insights on applied AI and product from builders in the trenches and those pushing the frontier.",
        thumbnail: post.thumbnail_url,
      };
    }
  } catch (error) {
    console.error("Error fetching post metadata:", error);
  }

  return {
    title: "Field Notes",
    subtitle: "",
    description: "Insights on applied AI and product from builders in the trenches and those pushing the frontier.",
    thumbnail: null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostMetadata(id);
  
  // Get base URL for absolute image URLs (required for Open Graph)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  'http://localhost:3000');
  
  const title = `${post.title} | Asymmetry`;
  const description = post.description;
  
  // Use absolute URLs for images (required for social media sharing)
  const image = post.thumbnail 
    ? post.thumbnail // Beehiiv thumbnails are already absolute URLs
    : `${baseUrl}/asym-dark-meta.png`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

