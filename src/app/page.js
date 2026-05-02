"use client";

import { useState } from "react";
import Preloader from "@/components/common/Preloader";
import Hero     from "@/components/sections/Hero";
import About    from "@/components/sections/About";
import Skills   from "@/components/sections/Skills";
import Achievements from "@/components/sections/Achievements";
import Projects from "@/components/sections/Projects";
import Contact  from "@/components/sections/Contact";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main>
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}
      <Hero     isLoaded={!isLoading} />
      <About    />
      <Skills   />
      <Achievements />
      <Projects />
      <Contact  />
    </main>
  );
}
