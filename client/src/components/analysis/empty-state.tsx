import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { UploadModal } from "../modals/upload-modal";
import { motion } from "framer-motion";

interface IEmptyStateProps {
	tittle: string;
	description: string;
}

export default function EmptyState({ tittle, description }: IEmptyStateProps) {
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

	return (
		<>
			<div className="flex items-center justify-center p-4 mt-10">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					className="w-full max-w-md"
				>
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-primary">
								{tittle}
							</CardTitle>
							<CardDescription>{description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<p className="text-gray-700 text-center">
									To receive your analysis results, you need to upload a
									contract.
								</p>
								<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
									<div className="flex items-center">
										<p className="text-sm text-yellow-700">
											<strong>Note:</strong> You can upload your contract in PDF
											or DOCX format.
										</p>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<div className="flex flex-col w-full space-y-2">
								<Button
									onClick={() => setIsUploadModalOpen(true)}
									className="w-full transform transition-transform duration-300 hover:scale-105"
								>
									Upload Contract for Full Analysis
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
