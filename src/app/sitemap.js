export default function sitemap() {
  const baseUrl = "https://yourwebsite.com";
  
  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
