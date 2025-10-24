"use client";

import { Briefcase } from "lucide-react";
import { SearchBar } from "./SearchBar";

export function HeroSection() {
  return (
  <section className="relative overflow-visible bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Find Your <span className="text-emerald-500">Dream Job</span> Today
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 text-pretty">
            Connect with top companies and discover opportunities that match
            your skills and aspirations
          </p>

          <SearchBar />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-emerald-500" />
              <span>
                <strong className="text-foreground">10,000+</strong> Active Jobs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <strong className="text-foreground">5,000+</strong> Companies
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <strong className="text-foreground">50,000+</strong> Job Seekers
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
