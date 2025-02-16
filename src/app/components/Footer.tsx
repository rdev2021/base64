import Link from 'next/link';

interface FooterProps {
    isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
    return (
        <footer
            className={`text-white py-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'
                }`}
        >
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <p>&copy; 2024 Base64 Encoder and Decoder. All rights reserved.</p>
                <span className="text-xs text-gray-400 mt-1 font-mono">
                    {process.env.NEXT_PUBLIC_GIT_HASH?.slice(0, 7)}
                </span>
                <div className="flex space-x-4">
                    <Link
                        href="/privacy"
                        className={`hover:text-blue-400 ${isDarkMode ? 'text-gray-300' : 'text-white'
                            }`}
                    >
                        Privacy
                    </Link>
                    <Link href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400">
                        GitHub</Link>
                </div>
            </div>
        </footer>
    );
}