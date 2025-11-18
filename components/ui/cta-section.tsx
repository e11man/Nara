"use client";

import { cn } from "@/lib/utils";

export default function CTASection() {
    return (
        <div className="max-w-5xl py-16 md:w-full mx-2 md:mx-auto flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-10 text-white shadow-xl">
            <div className="flex flex-wrap items-center justify-center p-1 rounded-full bg-blue-500/20 backdrop-blur border border-blue-300/40 text-sm">
                <div className="flex items-center">
                    <img 
                        className="size-6 md:size-7 rounded-full border-3 border-white"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=50&h=50&auto=format&fit=crop" 
                        alt="HR Professional 1" 
                    />
                    <img 
                        className="size-6 md:size-7 rounded-full border-3 border-white -translate-x-2"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=50&h=50&auto=format&fit=crop" 
                        alt="HR Professional 2" 
                    />
                    <img 
                        className="size-6 md:size-7 rounded-full border-3 border-white -translate-x-4"
                        src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=50&h=50&auto=format&fit=crop"
                        alt="HR Professional 3" 
                    />
                </div>
                <p className="-translate-x-2 font-medium">Trusted by HR teams worldwide</p>
            </div>
            <h2 className="text-4xl md:text-5xl md:leading-[60px] font-bold max-w-xl mt-5 bg-gradient-to-r from-white to-blue-100 text-transparent bg-clip-text">
                Ready to transform your onboarding?
            </h2>
            <p className="text-blue-50 text-lg mt-4 max-w-2xl">
                Start streamlining your HR workflow today with intelligent task management and AI-powered insights.
            </p>
            <button className="px-8 py-3 text-blue-600 bg-white hover:bg-blue-50 transition-all rounded-full font-semibold text-sm mt-8 shadow-lg hover:shadow-xl">
                Get Started Free
            </button>
        </div>
    );
}

