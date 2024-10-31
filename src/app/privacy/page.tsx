'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Privacy() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <Header isDarkMode={isDarkMode} />
            <main className="flex-grow container mx-auto my-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    <button
                        className={`px-4 py-2 rounded-md ${isDarkMode
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                        onClick={() => setIsDarkMode((prev) => !prev)}
                    >
                        {isDarkMode ? 'Light Theme' : 'Dark Theme'}
                    </button>
                </div>

                <div className={`bg-${isDarkMode ? 'gray-700' : 'white'} shadow-md rounded-md p-6 space-y-6`}>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
                        <p>This privacy policy explains how our Base64 Encoder/Decoder tool collects, uses, and protects your information.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Data Collection</h2>
                        <p>Our Base64 Encoder/Decoder tool operates entirely in your browser. We do not collect, store, or transmit any of the data you input into the encoder or decoder. All operations are performed locally on your device.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Local Storage</h2>
                        <p>We use local storage to remember your theme preference (dark/light mode). This information is stored only on your device and is not transmitted to our servers.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
                        <p>This site is hosted on Cloudflare Pages. Cloudflare may collect certain non-personal data, such as IP
                            addresses, for security, analytics and performance purposes. For more details, please refer to </p>
                            <Link href="https://www.cloudflare.com/privacypolicy/"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400">
                                Cloudflare’s Privacy Policy</Link>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
                        <p>We may update this privacy policy from time to time. Any changes will be posted on this page.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
                        <p>If you have any questions about this privacy policy, please contact us through our GitHub repository.</p>
                    </section>

                    <div className="mt-8">
                        <Link
                            href="/"
                            className={`inline-flex items-center px-4 py-2 rounded-md ${isDarkMode
                                ? 'bg-gray-600 hover:bg-gray-500'
                                : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            ← Back to Encoder/Decoder
                        </Link>
                    </div>
                </div>
            </main>
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}