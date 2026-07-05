import React from "react";

export default function SchemaMarkup() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Harshad Jethva",
    "url": "https://yourwebsite.com",
    "image": "https://yourwebsite.com/assets/Harshad_image_1.webp",
    "sameAs": [
      "https://github.com/harshadjethva",
      "https://linkedin.com/in/harshadjethva"
    ],
    "jobTitle": "Visual Designer & Creative Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "description": "Visual Designer & Creative Developer based in India, crafting modern immersive web experiences with code, motion, and design.",
    "gender": "Male",
    "knowsAbout": [
      "Web Design",
      "Creative Development",
      "JavaScript",
      "React",
      "Next.js",
      "GSAP Animations",
      "Three.js",
      "WebGL",
      "UX/UI Design",
      "Front-end Engineering"
    ]
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Harshad Jethva - Creative Developer & Designer",
    "image": "https://yourwebsite.com/assets/Harshad_image_1.webp",
    "@id": "https://yourwebsite.com/#localbusiness",
    "url": "https://yourwebsite.com",
    "telephone": "",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rajkot",
      "addressRegion": "Gujarat",
      "postalCode": "360001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.3039,
      "longitude": 70.8022
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://github.com/harshadjethva",
      "https://linkedin.com/in/harshadjethva"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is Harshad Jethva?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Harshad Jethva is a Visual Designer and Creative Developer based in India. He specializes in building beautiful, highly performant web applications using Next.js, React, GSAP, and Three.js."
        }
      },
      {
        "@type": "Question",
        "name": "What services does Harshad Jethva offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Harshad offers front-end engineering, visual design, creative development (GSAP/WebGL animations, custom interactive layouts), Next.js optimization, and full-stack development."
        }
      },
      {
        "@type": "Question",
        "name": "How can I contact Harshad Jethva?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact Harshad via the contact form on his website or by emailing him directly at harshadjethva@gmail.com."
        }
      },
      {
        "@type": "Question",
        "name": "Does Harshad Jethva work with clients globally?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Harshad works with clients globally, offering remote consulting, development, and custom design services."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
