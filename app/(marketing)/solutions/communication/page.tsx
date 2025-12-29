"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Users, Zap, BarChart, Mail, ArrowRight, Check, Bot } from "lucide-react";
import { StarsCanvas } from "@/components/ui/Stars";
import SpotlightCard from "@/components/landing/SpotlightCard";
import { InfiniteMovingCards } from "@/components/landing/InfiniteMovingCards";
import CountUp from "@/components/landing/CountUp";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Pricing from "@/components/landing/Pricing";

export default function CommunicationSolutionPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-purple-500/30 relative transition-colors duration-300">
      <StarsCanvas />

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MessageSquare className="h-4 w-4" />
            <span>Unified Communication</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Every conversation, <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">in one place</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Manage leads, emails, and messages from a single inbox. Use AI to qualify prospects and close deals faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-all hover:scale-105 shadow-lg shadow-purple-600/20">
              Start Communicating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/communication" className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-full font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
              View Inbox Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 text-center md:grid-cols-3">
            {[
              { value: 5, suffix: "m", label: "Avg Response Time" },
              { value: 45, suffix: "%", label: "Higher Conversion" },
              { value: 100, suffix: "%", label: "Lead Coverage" },
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Supercharge your outreach</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Tools designed to help you communicate faster, smarter, and more effectively.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Mail, title: "Unified Inbox", desc: "Connect Gmail, Outlook, and social channels. See every interaction in one timeline." },
              { icon: Bot, title: "AI Responses", desc: "Draft perfect replies instantly with AI that learns your brand voice and product details." },
              { icon: Users, title: "Lead Enrichment", desc: "Automatically gather data on your contacts from LinkedIn and public sources." },
              { icon: BarChart, title: "Conversation Analytics", desc: "Track response times, sentiment, and conversion rates across your team." },
              { icon: MessageSquare, title: "Templates & Snippets", desc: "Save your best performing messages and reuse them with a single click." },
              { icon: Zap, title: "CRM Sync", desc: "Every message is automatically logged to the contact's profile in your CRM." },
            ].map((feature, i) => (
              <SpotlightCard key={i} className="p-8 h-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
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
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Your personal <br /><span className="text-purple-600">AI Sales Assistant</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Never write a cold email from scratch again. Our AI analyzes the prospect&apos;s profile and generates highly personalized outreach messages that get replies.
              </p>
              <ul className="space-y-4">
                {["Auto-generates subject lines", "Personalizes based on LinkedIn data", "Suggests optimal send times", "Detects sentiment and intent"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <CardContainer className="inter-var">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                  <CardItem translateZ="50" className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
                    <div>
                      <h4 className="font-bold text-neutral-600 dark:text-white">AI Assistant</h4>
                      <p className="text-xs text-neutral-500">Just now</p>
                    </div>
                  </CardItem>
                  <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm mt-2 dark:text-neutral-300 leading-relaxed">
                    &quot;I noticed Sarah just raised a Series B. Here&apos;s a draft congratulating her and mentioning how we help scaling teams:&quot;
                  </CardItem>
                  <CardItem translateZ="40" className="w-full mt-4 p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 text-sm italic text-gray-600 dark:text-gray-400">
                    &quot;Hi Sarah, huge congrats on the Series B! 🚀 Seeing as you&apos;re scaling the team, I thought...&quot;
                  </CardItem>
                  <div className="flex justify-end items-center mt-6 gap-2">
                    <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-lg text-xs font-medium bg-purple-600 text-white">
                      Send Now
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-transparent relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-purple-900/5 blur-[100px]" />
        <div className="container mx-auto px-6 relative z-10 mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Communication that converts</h2>
        </div>
        <InfiniteMovingCards
          items={[
            { quote: "The unified inbox saved us from logging into 5 different tools every morning.", name: "David Chen", title: "Founder" },
            { quote: "The AI drafts are shockingly good. I only have to make minor edits.", name: "Amanda Low", title: "SDR Manager" },
            { quote: "We doubled our response rate by using the automated follow-up sequences.", name: "Tom Baker", title: "Head of Growth" },
            { quote: "Finally, a tool that syncs LinkedIn messages to our CRM automatically.", name: "Rachel Green", title: "Sales Lead" },
          ]}
          direction="right"
          speed="slow"
        />
      </section>

      <Pricing color="purple" />

      <section className="py-32 px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Stop losing leads in the noise</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Centralize your communication and never miss a follow-up again.</p>
          <Link href="/signup" className="inline-flex items-center justify-center px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
