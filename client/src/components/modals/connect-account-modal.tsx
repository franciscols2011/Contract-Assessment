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
import { Loader2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

function googleSignIn(): Promise<void> {
	return new Promise((resolve) => {
		window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
		resolve();
	});
}

export default function ConnectAccountModal() {
	const [isAgreed, setIsAgreed] = useState(false);
	const modalKey = "connectAccountModal";
	const { openModal, closeModal, isOpen } = useModalStore();

	const mutation = useMutation({
		mutationFn: googleSignIn,
		onSuccess: () => {
			closeModal(modalKey);
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const handleGoogleSingIn = async () => {
		if (isAgreed) {
			mutation.mutate();
		} else {
			toast.error("You must agree to the terms and conditions");
		}
	};

	return (
		<Dialog
			open={isOpen(modalKey)}
			onOpenChange={() => closeModal(modalKey)}
			key={modalKey}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Connect Account</DialogTitle>
					<DialogDescription> Please sign in to continue.</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<Button
						onClick={handleGoogleSingIn}
						disabled={!isAgreed || mutation.isPending}
					>
						{mutation.isPending ? (
							<Loader2 className="mr-2 size-4 animate-spin" />
						) : (
							<>Sing In with Google</>
						)}
					</Button>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="terms"
							checked={isAgreed}
							onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
						/>
						<Label
							htmlFor="terms"
							className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							I agree to the terms and conditions
						</Label>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
