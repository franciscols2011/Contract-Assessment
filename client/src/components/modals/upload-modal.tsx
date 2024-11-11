"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useContractStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import {
	FileText,
	Loader2,
	LucideBrain,
	Sparkles,
	Trash,
	CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRouter } from "next/navigation";

interface IUploadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUploadComplete: () => void;
}

export function UploadModal({
	isOpen,
	onClose,
	onUploadComplete,
}: IUploadModalProps) {
	const { setAnalysisResults } = useContractStore();
	const router = useRouter();

	const [detectedType, setDetectedType] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [files, setFiles] = useState<File[]>([]);
	const [step, setStep] = useState<
		"upload" | "detecting" | "confirm" | "processing" | "done"
	>("upload");
	const [progress, setProgress] = useState<number>(0);

	const { mutate: detectedContractType } = useMutation({
		mutationFn: async ({ file }: { file: File }) => {
			const formData = new FormData();
			formData.append("contract", file);

			const response = await api.post<{ detectedType: string }>(
				"/contracts/detect-type",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			return response.data.detectedType;
		},
		onSuccess: (data: string) => {
			setDetectedType(data);
			setStep("confirm");
		},
		onError: () => {
			setError("Failed to detect contract type");
			setStep("upload");
		},
	});

	const { mutate: uploadFile } = useMutation({
		mutationFn: async ({
			file,
			contractType,
		}: {
			file: File;
			contractType: string;
		}) => {
			const formData = new FormData();
			formData.append("contract", file);
			formData.append("contractType", contractType);

			const response = await api.post("/contracts/analyze", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			return response.data;
		},
		onSuccess: (data) => {
			setAnalysisResults(data);
			setProgress(100);
			setStep("done");
			onUploadComplete();
		},
		onError: () => {
			setError("Failed to upload contract");
			setStep("upload");
		},
	});

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			setFiles(acceptedFiles);
			setError(null);
			setStep("upload");
		} else {
			setError("No file selected");
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"application/pdf": [".pdf"],
		},
		maxFiles: 1,
		multiple: false,
	});

	const handleFileUpload = async () => {
		if (files.length > 0) {
			setStep("detecting");
			detectedContractType({ file: files[0] });
		}
	};

	const handleAnalyzeContract = async () => {
		if (files.length > 0 && detectedType) {
			setStep("processing");
			setProgress(0);
			uploadFile({ file: files[0], contractType: detectedType });
		}
	};

	const handleClose = () => {
		onClose();
		setFiles([]);
		setDetectedType(null);
		setError(null);
		setStep("upload");
		setProgress(0);
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (step === "processing") {
			timer = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 95) {
						clearInterval(timer);
						return prev;
					}
					return prev + 5;
				});
			}, 500);
		}
		return () => {
			if (timer) {
				clearInterval(timer);
			}
		};
	}, [step]);

	const renderContent = () => {
		switch (step) {
			case "upload": {
				return (
					<AnimatePresence>
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
						>
							<div
								{...getRootProps()}
								className={cn(
									"border-2 border-dashed rounded-lg p-8 mt-8 mb-4 text-center transition-colors cursor-pointer",
									isDragActive
										? "border-primary bg-primary/10"
										: "border-gray-300 hover:border-gray-400"
								)}
							>
								<input {...getInputProps()} />
								<motion.div
									animate={{
										y: [0, -10, 0],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								>
									<FileText className="mx-auto h-16 w-16 text-primary" />
								</motion.div>
								<p className="mt-4 text-sm text-gray-600">
									Drag and drop a contract here or click to upload
								</p>
								<p className="bg-yellow-50 text-sm text-yellow-700 p-2 rounded-lg mt-3">
									Only PDF files are supported.
								</p>
							</div>
							{files.length > 0 && (
								<motion.div
									className="mt-4 bg-green-50 border border-green-500 text-green-900 p-2 rounded flex items-center justify-between"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								>
									<span className="truncate">
										{files[0].name}{" "}
										<span className="text-gray-800">
											({(files[0].size / 1024).toFixed(2)} KB)
										</span>
									</span>
									<Button
										variant={"ghost"}
										size={"sm"}
										className="hover:bg-green-100"
										onClick={() => setFiles([])}
									>
										<Trash className="h-5 w-5 hover:text-red-500" />
									</Button>
								</motion.div>
							)}
							{files.length > 0 && (
								<Button
									className="mt-4 w-full mb-4 transform transition-transform duration-300 hover:scale-105"
									onClick={handleFileUpload}
								>
									<Sparkles className="mr-2 h-4 w-4 animate-pulse" />
									<span>Analyze Contract With AI</span>
								</Button>
							)}
							{error && (
								<div className="mt-4 text-red-500 text-sm">{error}</div>
							)}
						</motion.div>
					</AnimatePresence>
				);
			}
			case "detecting": {
				return (
					<AnimatePresence>
						<motion.div
							className="flex flex-col items-center justify-center py-8"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<Loader2 className="h-16 w-16 animate-spin text-primary" />
							<p className="mt-4 text-lg font-semibold">
								Detecting contract type...
							</p>
						</motion.div>
					</AnimatePresence>
				);
			}
			case "confirm": {
				return (
					<AnimatePresence>
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<div className="flex flex-col items-center space-y-4 mb-4 text-center">
								<CheckCircle className="h-16 w-16 text-green-500" />
								<p className="text-xl font-semibold text-gray-800">
									Contract Type Detected
								</p>
								<p className="text-gray-700">
									We have detected the following contract type:
									<span className="font-semibold"> {detectedType}</span>
								</p>
								<p className="text-gray-700">
									Would you like to analyze this contract with our AI?
								</p>
							</div>
							<div className="flex space-x-4">
								<Button
									onClick={handleAnalyzeContract}
									className="flex-1 transform transition-transform duration-300 hover:scale-105"
								>
									Yes, Analyze It
								</Button>
								<Button
									onClick={() => setStep("upload")}
									variant={"outline"}
									className="flex-1 transform transition-transform duration-300 hover:scale-105"
								>
									No, Try Another
								</Button>
							</div>
						</motion.div>
					</AnimatePresence>
				);
			}
			case "processing": {
				return (
					<AnimatePresence>
						<motion.div
							className="flex flex-col items-center justify-center py-8"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<motion.div
								animate={{
									scale: [1, 1.2, 1],
								}}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								<LucideBrain className="h-24 w-24 text-primary" />
							</motion.div>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-6 text-xl font-semibold text-gray-700"
							>
								AI is analyzing your contract...
							</motion.p>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-2 text-md text-gray-600"
							>
								This may take a few moments
							</motion.p>
							<div className="w-full max-w-md mt-6">
								<div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
									<motion.div
										className="absolute h-full bg-primary rounded-full"
										initial={{ width: "0%" }}
										animate={{ width: `${progress}%` }}
										transition={{ ease: "linear" }}
									></motion.div>
								</div>
								<p className="mt-2 text-center text-sm text-gray-600">
									{progress}% completed
								</p>
							</div>
						</motion.div>
					</AnimatePresence>
				);
			}
			case "done": {
				return (
				  <AnimatePresence>
					<motion.div
					  className="flex flex-col items-center justify-center py-8"
					  initial={{ opacity: 0 }}
					  animate={{ opacity: 1 }}
					>
					  <motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1.2, rotate: 360 }}
						transition={{ duration: 0.5 }}
					  >
						<CheckCircle className="h-24 w-24 text-green-500" />
					  </motion.div>
					  <motion.p
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-6 text-2xl font-semibold text-gray-800"
					  >
						Analysis Complete!
					  </motion.p>
					  <motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-2 text-md text-gray-600"
					  >
						Your contract has been analyzed successfully.
					  </motion.p>
		
					  <div className="mt-6 flex flex-col space-y-3 w-full">
						<Button
						  onClick={() => {
							handleClose();
							router.push("/dashboard/results");
						  }}
						  className="transform transition-transform duration-300 hover:scale-105"
						>
						  View Results
						</Button>
						<Button
						  variant={"outline"}
						  onClick={handleClose}
						  className="transform transition-transform duration-300 hover:scale-105"
						>
						  Close
						</Button>
					  </div>
					</motion.div>
				  </AnimatePresence>
				);
			  }
			}
		  };

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-lg mx-auto">
				{renderContent()}
			</DialogContent>
		</Dialog>
	);
}
