import { Cinzel, Inter } from "next/font/google"; // Импортируем шрифты
import "./globals.css";
import { Metadata } from "next";

// Шрифт для основного текста
const inter = Inter({
	subsets: ["latin", "cyrillic"],
	variable: "--font-inter",
});
// Шрифт для заголовков (RPG vibe)
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
	title: "Motion Alchemy Lab",
	description: "Visual generator for Framer Motion animations",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${cinzel.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
