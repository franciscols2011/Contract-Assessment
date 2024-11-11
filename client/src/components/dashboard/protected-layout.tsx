"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Loader2, LockIcon } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useModalStore } from "@/store/zustand";
import { motion } from "framer-motion";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useCurrentUser();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="size-16 animate-spin text-primary" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center h-screen">
				<AuthCard />
			</div>
		);
	}

	return <>{children}</>;
}

export default function AuthCard() {
	const { openModal } = useModalStore();

	return (
		<Card className="w-full max-w-3xl mx-auto">
			<div className="flex flex-col sm:flex-row">
				<motion.div
					className="sm:w-1/4 bg-gradient-to-b from-blue-500 to-purple-500 flex items-center justify-center p-4"
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
				>
					<LockIcon className="size-16 text-white" />
				</motion.div>
				<div className="sm:w-3/4 p-4">
					<CardHeader className="space-y-1 px-0 pb-2">
						<CardTitle className="text-2xl font-bold">
							Authentication Required
						</CardTitle>
						<CardDescription>
							You need to be logged in to access this page.
						</CardDescription>
					</CardHeader>
					<CardContent className="px-0 py-2">
						<div className="flex flex-col sm:flex-row gap-2">
							<Button
								onClick={() => openModal("connectAccountModal")}
								className="flex-1 transform transition-transform duration-300 hover:scale-105"
								variant="default"
							>
								Continue with Google
							</Button>
							<Link href={"/"} className="flex-1">
								<Button
									className="w-full transform transition-transform duration-300 hover:scale-105"
									variant="outline"
								>
									Back to Home
								</Button>
							</Link>
						</div>
					</CardContent>
				</div>
			</div>
		</Card>
	);
}
