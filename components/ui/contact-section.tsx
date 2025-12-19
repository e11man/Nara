"use client";

import { Mail, Building2, Phone } from "lucide-react";

export default function ContactSection() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-medium mb-4">
                        Reach Out To Us
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        We'd love to Hear From You.
                    </h2>
                    <p className="text-lg text-gray-700">
                        Or just reach out manually to{" "}
                        <a href="mailto:support@nara.com" className="text-blue-600 hover:underline">
                            support@nara.com
                        </a>
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Email Support */}
                    <div className="flex flex-col items-start">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                            <Mail className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Email Support
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Our team can respond in real time.
                        </p>
                        <a
                            href="mailto:support@nara.com"
                            className="text-blue-600 hover:text-blue-700 font-medium text-lg hover:underline"
                        >
                            support@nara.com
                        </a>
                    </div>

                    {/* Visit Our Office */}
                    <div className="flex flex-col items-start">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                            <Building2 className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Visit Our Office
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Visit our location in real life.
                        </p>
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700 font-medium text-lg hover:underline"
                        >
                            221b Elementary Avenue, NY
                        </a>
                    </div>

                    {/* Call Us Directly */}
                    <div className="flex flex-col items-start">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                            <Phone className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Call Us Directly
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Available during working hours.
                        </p>
                        <a
                            href="tel:+12344567789"
                            className="text-blue-600 hover:text-blue-700 font-medium text-lg hover:underline"
                        >
                            (+1) 234 - 4567 - 789
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
