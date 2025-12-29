"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Scene from "./Scene";

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        skewY: 7,
      })
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 1,
          },
          "-=0.5"
        )
        .from(
          buttonsRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center"
    >
      {/* 3D Background Elements - Disabled for build */}
      {/* <Scene /> */}

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white dark:from-black/0 dark:via-black/50 dark:to-black" />
      </div>

      <div className="relative z-10 max-w-5xl">
        <h1
          ref={titleRef}
          className="mb-8 text-6xl font-bold tracking-tight text-black dark:text-white md:text-8xl lg:text-9xl drop-shadow-2xl"
        >
          <span className="block bg-gradient-to-b from-black to-black/40 dark:from-white dark:to-white/40 bg-clip-text text-transparent">
            Book More.
          </span>
          <span className="block text-blue-600 dark:text-blue-500">
            Close Faster.
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mx-auto mb-12 max-w-2xl text-xl text-gray-600 dark:text-gray-300 md:text-2xl drop-shadow-lg"
        >
          The intelligent scheduling platform that turns visitors into booked
          meetings automatically. Stop chasing leads, start taking appointments.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/capture"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-blue-700 shadow-lg shadow-blue-600/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Booking
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 -z-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-8 py-4 text-lg font-medium text-black dark:text-white backdrop-blur-sm transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
