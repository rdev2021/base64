import Link from 'next/link';

interface HeaderProps {
  isDarkMode: boolean;
}

export default function Header({ isDarkMode }: HeaderProps) {
  return (
    <header
      className={`py-4 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-800 text-white'
        }`}
    >
      <div className="container mx-auto flex justify-center">
        <Link href="/" className="text-2xl font-bold">
          Base64 Encoder and Decoder
        </Link>
      </div>
    </header>
  );
}