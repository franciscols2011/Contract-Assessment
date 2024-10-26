import { ContractAnalysis } from "@/interfaces/contract.interface";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { color } from "framer-motion";
import { text } from "stream/consumers";
import OverallScoreChart from "./chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface IContractAnalysisResultsProps {
	analysisResults: ContractAnalysis;
	isActive,
	contractId: string;
}

export default function ContractAnalysisResults({
	analysisResults,
	contractId,
}: IContractAnalysisResultsProps) {
	const [activeTab, setActiveTab] = useState("summary");

	const getScore = () => {
		const score = 54;
		if (score > 70)
			return { icon: ArrowUp, color: "text-green-500", text: "Good" };
		if (score < 50)
			return { icon: ArrowDown, color: "text-red-500", text: "Bad" };
		return { icon: Minus, color: "text-yellow-500", text: "Average" };
	};

	const scoreTrend = getScore();

	const renderRisksAndOpportunities = (
		items: Array<{
			risk?: string;
			opportunity?: string;
			explanation?: string;
			severity?: string;
			impact?: string;
		}>,
		type: "risk" | "opportunity"
	) => {
		const displayItems =
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Contract Analysis Results</h1>
				<div className="flex space-x-2"></div>
			</div>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Overal Contract Score</CardTitle>
					<CardDescription>
						Based on risks and opportunities identified
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="w-1/2">
							<div className="flex items-center space-x-4 mb-4">
								<div className="text-4xl font-bold">
									{/* {analysisResults.overallScore ?? 0} */}
									45
								</div>
								<div className={`flex items-center ${scoreTrend.color}`}>
									<scoreTrend.icon className="size-6 mr-1" />
									<span className="font-semibold">{scoreTrend.text}</span>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Risk</span>
									<span>34%</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Opportunities</span>
									<span>34%</span>
								</div>
							</div>
							<p className="text-sm text-gray-600 mt-4">
								This score is based on the risks and opportunities identified in
								your contract.
							</p>
						</div>
						<div className="w-1/2 h-48 flex justify-center">
							<OverallScoreChart overallScore={78} />
						</div>
					</div>
				</CardContent>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="summary">Summary</TabsTrigger>
						<TabsTrigger value="risks">Risks</TabsTrigger>
						<TabsTrigger value="opportunities">Opportunities</TabsTrigger>
						<TabsTrigger value="details">Details</TabsTrigger>
					</TabsList>
					<TabsContent value="summary">
						<Card>
							<CardHeader>
								<CardTitle>Contract Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-lg leading-relaxed">
									{/* {analysisResults.summary} */}
									This is a summary of the contract.
								</p>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="risks">
						<Card>
							<CardHeader>
								<CardTitle>Risks</CardTitle>
							</CardHeader>
							<CardContent></CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
}
