"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, Globe, Shield, Check, ArrowRight, Zap, Users } from "lucide-react";
import { StarsCanvas } from "@/components/ui/Stars";
import SpotlightCard from "@/components/landing/SpotlightCard";
import { InfiniteMovingCards } from "@/components/landing/InfiniteMovingCards";
import CountUp from "@/components/landing/CountUp";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Pricing from "@/components/landing/Pricing";

export default function AppointmentsSolutionPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 relative transition-colors duration-300">
      <StarsCanvas />

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Calendar className="h-4 w-4" />
            <span>Smart Scheduling</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Book meetings without <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">the back-and-forth</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Eliminate email tag. Share your availability with a single link and let prospects book time on your calendar instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-600/20">
              Start Scheduling Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/appointments" className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-full font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
              See Live Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 text-center md:grid-cols-3">
            {[
              { value: 15, suffix: "h", label: "Saved Weekly Per Rep" },
              { value: 200, suffix: "%", label: "Increase in Bookings" },
              { value: 0, suffix: "", label: "Double Bookings" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="mb-2 text-5xl font-bold text-black dark:text-white md:text-6xl flex justify-center items-baseline">
                  <CountUp from={0} to={stat.value} separator="," direction="up" duration={1.5} className="count-up-text" />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful features for modern teams</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to manage your calendar and appointments at scale.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Timezone Intelligent", desc: "Automatically detects your invitee's timezone so everyone shows up at the right time." },
              { icon: Globe, title: "Team Scheduling", desc: "Pool availability from your entire team. Route meetings to the right person automatically." },
              { icon: Shield, title: "Buffer Times", desc: "Set breaks between meetings so you're never rushing from one call to the next." },
              { icon: Calendar, title: "Calendar Sync", desc: "Connects with Google, Outlook, and Office 365 to prevent double bookings." },
              { icon: Check, title: "Automated Reminders", desc: "Reduce no-shows with automatic email and SMS reminders before the meeting." },
              { icon: Zap, title: "Custom Workflows", desc: "Trigger follow-up emails or CRM updates as soon as a meeting is booked." },
            ].map((feature, i) => (
              <SpotlightCard key={i} className="p-8 h-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Your booking page, <br /><span className="text-blue-600">your brand</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Customize your booking page to match your brand identity. Add your logo, colors, and custom questions to qualify leads before they book.
              </p>
              <ul className="space-y-4">
                {["Custom branding & colors", "Embed on your website", "Remove LeadCatch branding", "Custom domain support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <CardContainer className="inter-var">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                  <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">Book a Demo</CardItem>
                  <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">Select a time that works for you.</CardItem>
                  <CardItem translateZ="100" className="w-full mt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"].map((time) => (
                        <div key={time} className="py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-800 text-center text-sm hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors">{time}</div>
                      ))}
                    </div>
                  </CardItem>
                  <div className="flex justify-between items-center mt-8">
                    <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white">Cancel</CardItem>
                    <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold">Confirm</CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-transparent relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-blue-900/5 blur-[100px]" />
        <div className="container mx-auto px-6 relative z-10 mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Loved by sales teams</h2>
        </div>
        <InfiniteMovingCards
          items={[
            { quote: "I used to spend 2 hours a day just scheduling meetings. Now it happens automatically.", name: "Alex Rivera", title: "Sales Director" },
            { quote: "The round-robin feature is a lifesaver for our SDR team. Leads are distributed perfectly.", name: "Jessica Wu", title: "VP of Operations" },
            { quote: "No-shows dropped by 40% after we switched to LeadCatch reminders.", name: "Mark Thompson", title: "Founder" },
            { quote: "The calendar sync is flawless. I never have to worry about double bookings.", name: "Sarah Jenkins", title: "Account Executive" },
          ]}
          direction="left"
          speed="slow"
        />
      </section>

      <Pricing color="blue" />

      <section className="py-32 px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to reclaim your time?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Join thousands of professionals who save 10+ hours a week with LeadCatch Appointments.</p>
          <Link href="/signup" className="inline-flex items-center justify-center px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
