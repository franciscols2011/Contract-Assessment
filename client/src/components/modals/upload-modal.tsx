import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useContractStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

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

	const [detectedType, setDetectedType] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [files, setFiles] = useState<File[]>([]);
	const [step, setStep] = useState<
		"upload" | "detecting" | "confirm" | "processing" | "done"
	>("upload");

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
		onError: (error) => {
			console.error(error);
			setError("Failed to detected contract type");
			setStep("upload");
		},
	});

	const { mutate: uploadFile, isPending: isProcessing } = useMutation({
		mutationFn: async ({
			file,
			contractType,
		}: {
			file: File;
			contractType: string;
		}) => {
			const formData = new FormData();
			formData.append("contract", file);

			const response = await api.post("/contracts/analyze", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: (data) => {
			setAnalysisResults(data);
			onUploadComplete();
		},
		onError: (error) => {
			console.error(error);
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
			uploadFile({ file: files[0], contractType: detectedType });
		}
	};

	const handleClose = () => {
		onClose();
		setFiles([]);
		setDetectedType(null);
		setError(null);
		setStep("upload");
	};

	const renderContent = () => {
		switch (step) {
			case "upload": {
				return (
					<AnimatePresence>
						<motion.div>
							<div
								{...getRootProps()}
								className={cn(
									"border-2 border-dashed rounded-lg p-8 mt-8 mb-4 text-center transition-colors",
									isDragActive
										? "border-primary bg-primary/10"
										: "border-gray-300 hover:border-gray-400"
								)}
							>
								<input {...getInputProps()} />
								<motion.div>
									<FileText className="mx-auto size-16 text-primary" />
								</motion.div>
								<p className="mt-4 text-sm text-gray-600">
									Drag and drop a contract here or click to upload
								</p>
								<p className="bg-yellow-50 text-sm text-yellow-700 p-2 rounded-lg mt-3">
									Only PDF files are supported. Please ensure
								</p>
							</div>
							{files.length > 0 && (
								<div className="mt-4">
									<span>
										{files[0].name}{" "}
										<span className="text-gray-600">{files[0].size} bytes</span>
									</span>
								</div>
							)}
						</motion.div>
					</AnimatePresence>
				);
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent>{renderContent()}</DialogContent>
		</Dialog>
	);
}
