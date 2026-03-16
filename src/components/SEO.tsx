import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  url?: string;
}

const SEO = ({
  title = "J.A.R.V.I.S. | Ultimate AI Vibe-Coding Co-Pilot",
  description = "Turn messy ideas into production-grade prompts. J.A.R.V.I.S. is the elite architect for Lovable, v0, Cursor, and Bolt.",
  ogImage = "/seo-thumb.png",
  url = "https://j-a-r-v-i.vercel.app", // Fallback URL
}: SEOProps) => {
  useEffect(() => {
    // Update Document Title
    document.title = title;

    // Update Meta Tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      let tag = document.querySelector(
        isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      );
      if (!tag) {
        tag = document.createElement("meta");
        if (isProperty) tag.setAttribute("property", name);
        else tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    updateMetaTag("description", description);
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("og:url", url, true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", ogImage);

    // Structured Data (JSON-LD)
    const scriptId = "structured-data-jsonld";
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = scriptId;
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "J.A.R.V.I.S.",
      "operatingSystem": "Web",
      "applicationCategory": "DeveloperApplication",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1200"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": description,
      "image": ogImage,
      "url": url,
      "author": {
        "@type": "Person",
        "name": "IrfanNG"
      }
    };

    scriptTag.text = JSON.stringify(structuredData);

    return () => {
      // Cleanup if needed (though usually we want meta tags to stay until next update)
    };
  }, [title, description, ogImage, url]);

  return null;
};

export default SEO;
