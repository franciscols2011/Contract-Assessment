"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UploadModal } from "@/components/modals/upload-modal";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

	return (
		<>
			<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					className="w-full max-w-md"
				>
					<Card className="shadow-xl">
						<CardHeader className="text-center">
							<div className="flex justify-center mb-4">
								<CheckCircle className="w-16 h-16 text-green-500" />
							</div>
							<CardTitle className="text-3xl font-bold text-gray-800">
								Payment Successful
							</CardTitle>
							<CardDescription className="text-gray-600">
								Thank you for your payment.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<p className="text-gray-700 text-center">
									To receive your analysis results, please upload your contract.
								</p>
								<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
									<p className="text-sm text-yellow-700">
										<strong>Note:</strong> You can upload your contract in PDF
										or DOCX format.
									</p>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<div className="flex flex-col w-full space-y-2">
								<Button
									onClick={() => setIsUploadModalOpen(true)}
									className="w-full transform transition-transform duration-300 hover:scale-105"
								>
									Upload for Full Analysis
								</Button>
								<Button className="w-full" asChild variant="outline">
									<Link href="/dashboard">Go to Dashboard</Link>
								</Button>
							</div>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
			<UploadModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				onUploadComplete={() => setIsUploadModalOpen(true)}
			/>
		</>
	);
}
