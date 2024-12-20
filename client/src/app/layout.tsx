import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { ReactQueryProviders } from "@/providers/tanstack/react-query-providers";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modals/modal-providers";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Contract Assessment",
	description:
	  "Harness the power of AI to analyze, understand, and optimize your contracts efficiently.",
  };
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ReactQueryProviders>
					<Header />
					<ModalProvider>{children}</ModalProvider>
					<Toaster />
				</ReactQueryProviders>
			</body>
		</html>
	);
}
