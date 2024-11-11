"use client";

import { useModalStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, LogIn } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

function googleSignIn(): Promise<void> {
	return new Promise((resolve) => {
		window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
		resolve();
	});
}

export default function ConnectAccountModal() {
	const [isAgreed, setIsAgreed] = useState(false);
	const [isTermsOpened, setIsTermsOpened] = useState(false);
	const [isCheckboxEnabled, setIsCheckboxEnabled] = useState(false);

	const modalKey = "connectAccountModal";
	const { closeModal, isOpen } = useModalStore();

	const mutation = useMutation({
		mutationFn: googleSignIn,
		onSuccess: () => {
			closeModal(modalKey);
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const handleGoogleSignIn = async () => {
		if (isAgreed) {
			mutation.mutate();
		} else {
			toast.error("You must agree to the terms and conditions");
		}
	};

	const handleTermsOpen = () => {
		setIsTermsOpened(true);
	};

	const handleTermsClose = () => {
		setIsTermsOpened(false);
		setIsCheckboxEnabled(true);
	};

	return (
		<Dialog
			open={isOpen(modalKey)}
			onOpenChange={() => closeModal(modalKey)}
			key={modalKey}
		>
			<DialogContent className="max-w-md mx-auto">
				<DialogHeader>
					<DialogTitle className="text-center text-3xl font-bold">
						<motion.span
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							Welcome to Our Platform
						</motion.span>
					</DialogTitle>
					<DialogDescription className="text-center text-lg text-muted-foreground">
						<motion.span
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							Sign up to get started!
						</motion.span>
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col items-center py-6">
					<motion.div
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5 }}
						className="w-full"
					>
						<Button
							onClick={handleGoogleSignIn}
							disabled={!isAgreed || mutation.isPending}
							className={cn(
								"w-full flex items-center justify-center transform transition-transform duration-300 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-xl",
								!isAgreed
									? "opacity-50 cursor-not-allowed"
									: "hover:scale-105 hover:shadow-2xl"
							)}
						>
							{mutation.isPending ? (
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							) : (
								<>
									<LogIn className="mr-2 h-6 w-6 animate-pulse" />
									<span className="animate-text bg-gradient-to-r from-yellow-300 via-red-200 to-pink-200 bg-clip-text text-transparent">
										Sign In with Google
									</span>
								</>
							)}
						</Button>
					</motion.div>

					<div className="flex items-start space-x-2 mt-4">
						<Checkbox
							id="terms"
							checked={isAgreed}
							onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
							disabled={!isCheckboxEnabled}
						/>
						<Label
							htmlFor="terms"
							className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							I agree to the{" "}
							<span
								className="text-primary cursor-pointer hover:underline"
								onClick={handleTermsOpen}
							>
								terms and conditions
							</span>
						</Label>
					</div>
				</div>

				<AnimatePresence>
					{isTermsOpened && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
						>
							<motion.div
								className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 overflow-y-auto"
								style={{ maxHeight: "80vh" }}
							>
								<h2 className="text-2xl font-bold mb-4 text-center">
									Terms and Conditions
								</h2>
								<div className="space-y-4 text-sm text-gray-700">
									<p>
										Acceptance of Terms: By accessing and using our services,
										you accept and agree to be bound by the terms and provision
										of this agreement.
									</p>
									<p>
										Modification of Terms: We reserve the right to modify these
										terms at any time. You agree to review the terms regularly
										to ensure you are aware of any changes.
									</p>
									<p>
										User Responsibilities: You are responsible for your use of
										the service and for any content you provide.
									</p>
									<p>
										Privacy Policy: Your use of the service is also subject to
										our Privacy Policy.
									</p>
									<p>
										Intellectual Property: All content provided on the service
										is the property of the company or its content suppliers.
									</p>
									<p>
										Termination: We may terminate or suspend access to our
										service immediately, without prior notice, for any reason
										whatsoever.
									</p>
									<p>
										Limitation of Liability: In no event shall the company be
										liable for any indirect, incidental, special, consequential,
										or punitive damages.
									</p>
									<p>
										Contact Us: If you have any questions about these terms,
										please contact us.
									</p>
								</div>
								<Button
									className="mt-6 w-full transform transition-transform duration-300 hover:scale-105"
									onClick={handleTermsClose}
								>
									Close
								</Button>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}
