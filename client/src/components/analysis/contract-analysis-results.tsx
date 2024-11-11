import { ContractAnalysis } from "@/interfaces/contract.interface";
import { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowDown, ArrowUp, Check, Minus } from "lucide-react";
import OverallScoreChart from "./chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Accordion, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";

interface IContractAnalysisResultsProps {
	analysisResults: ContractAnalysis;
	isActive: boolean;
	contractId: string;
	onUpgrade: () => void;
}

export default function ContractAnalysisResults({
	analysisResults,
	isActive,
	onUpgrade,
}: IContractAnalysisResultsProps) {
	const [activeTab, setActiveTab] = useState("summary");

	if (!analysisResults) {
		return <div>No results</div>;
	}

	const getScore = () => {
		const score = analysisResults.overallScore;
		if (score > 70)
			return { icon: ArrowUp, color: "text-green-500", text: "Good" };
		if (score < 50)
			return { icon: ArrowDown, color: "text-red-500", text: "Bad" };
		return { icon: Minus, color: "text-yellow-500", text: "Average" };
	};

	const scoreTrend = getScore();

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "";
		}
	};

	const renderRisksAndOpportunities = (
		items: Array<{
			risk?: string;
			opportunity?: string;
			explanation?: string;
			severity?: string;
			impact?: string;
		}>,
		type: "risks" | "opportunities"
	) => {
		const displayItems = isActive ? items : items.slice(0, 3);
		return (
			<ul className="space-y-6">
				{displayItems.map((item, index) => (
					<motion.li
						className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<div className="flex justify-between items-start mb-2">
							<span className="font-semibold text-xl">
								{type === "risks" ? item.risk : item.opportunity}
							</span>
							{(item.severity || item.impact) && (
								<Badge
									className={`text-sm ${
										type === "risks"
											? getSeverityColor(item.severity!)
											: getSeverityColor(item.impact!)
									}`}
								>
									{item.severity || item.impact}
								</Badge>
							)}
						</div>
						<p className="mt-2 text-gray-700 leading-relaxed">
							{item.explanation}
						</p>
					</motion.li>
				))}
				{!isActive && items.length > 3 && (
					<motion.li
						className="border rounded-lg p-6 blur-sm"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: displayItems.length * 0.1 }}
					>
						<div className="flex justify-between items-start mb-2">
							<span className="font-semibold text-xl">
								{type === "risks" ? "Hidden Risk" : "Hidden Opportunity"}
							</span>
							<Badge className="text-sm">Hidden</Badge>
						</div>
					</motion.li>
				)}
			</ul>
		);
	};

	const renderPremiumContent = (content: ReactNode) => {
		if (isActive) {
			return content;
		}

		return (
			<div className="relative">
				<div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
					<Button onClick={onUpgrade} variant="outline">
						Upgrade to Premium
					</Button>
				</div>
				<div className="opacity-50">{content}</div>
			</div>
		);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				className="flex justify-between items-center mb-8"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<h1 className="text-4xl font-bold text-gray-800">Analysis Results</h1>
			</motion.div>

			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<Card className="mb-8 shadow-xl">
					<CardHeader>
						<CardTitle className="text-2xl font-semibold text-gray-800">
							Overall Contract Score
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col lg:flex-row items-center justify-between">
							<div className="lg:w-1/2">
								<div className="flex items-center space-x-4 mb-6">
									<div className="text-7xl font-extrabold text-primary">
										{analysisResults.overallScore ?? 0}%
									</div>
									<div className={`flex items-center ${scoreTrend.color}`}>
										<scoreTrend.icon className="w-10 h-10 mr-2" />
										<span className="text-2xl font-semibold">
											{scoreTrend.text}
										</span>
									</div>
								</div>
								<div className="space-y-3">
									<div className="flex justify-between text-lg">
										<span>Risks</span>
										<span>{100 - analysisResults.overallScore}%</span>
									</div>
									<div className="flex justify-between text-lg">
										<span>Opportunities</span>
										<span>{analysisResults.overallScore}%</span>
									</div>
								</div>
								<p className="text-base text-gray-600 mt-6 leading-relaxed">
									This score represents the overall risks and opportunities
									identified in the contract.
								</p>
							</div>

							<div className="lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
								<OverallScoreChart
									overallScore={analysisResults.overallScore}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="summary">Summary</TabsTrigger>
					<TabsTrigger value="risks">Risks</TabsTrigger>
					<TabsTrigger value="opportunities">Opportunities</TabsTrigger>
					<TabsTrigger value="details">Details</TabsTrigger>
				</TabsList>
				<TabsContent value="summary">
					<Card className="shadow-xl">
						<CardHeader>
							<CardTitle className="text-xl font-semibold text-gray-800">
								Contract Summary
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-lg leading-relaxed text-gray-700">
								{analysisResults.summary}
							</p>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="risks">
					<Card className="shadow-xl">
						<CardHeader>
							<CardTitle className="text-xl font-semibold text-gray-800">
								Risks
							</CardTitle>
						</CardHeader>
						<CardContent>
							{renderRisksAndOpportunities(analysisResults.risks, "risks")}
							{!isActive && (
								<p className="mt-6 text-center text-base text-gray-500">
									Upgrade to Premium to see all risks
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="opportunities">
					<Card className="shadow-xl">
						<CardHeader>
							<CardTitle className="text-xl font-semibold text-gray-800">
								Opportunities
							</CardTitle>
						</CardHeader>
						<CardContent>
							{renderRisksAndOpportunities(
								analysisResults.opportunities,
								"opportunities"
							)}
							{!isActive && (
								<p className="mt-6 text-center text-base text-gray-500">
									Upgrade to Premium to see all opportunities
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="details">
					{isActive ? (
						<div className="grid lg:grid-cols-2 gap-8">
							<Card className="shadow-xl">
								<CardHeader>
									<CardTitle className="text-xl font-semibold text-gray-800">
										Key Clauses
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-4">
										{analysisResults.keyClauses?.map((keyClause, index) => (
											<motion.li
												key={index}
												className="flex items-start"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: index * 0.1 }}
											>
												<span className="mr-3 text-green-600">
													<Check />
												</span>
												<p className="text-gray-700 leading-relaxed">
													{keyClause}
												</p>
											</motion.li>
										))}
									</ul>
								</CardContent>
							</Card>
							<Card className="shadow-xl">
								<CardHeader>
									<CardTitle className="text-xl font-semibold text-gray-800">
										Recommendations
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-4">
										{analysisResults.recommendations?.map(
											(recommendation, index) => (
												<motion.li
													key={index}
													className="flex items-start"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: index * 0.1 }}
												>
													<span className="mr-3 text-blue-600">
														<Check />
													</span>
													<p className="text-gray-700 leading-relaxed">
														{recommendation}
													</p>
												</motion.li>
											)
										)}
									</ul>
								</CardContent>
							</Card>
						</div>
					) : (
						<Card className="shadow-xl">
							<CardHeader>
								<CardTitle className="text-xl font-semibold text-gray-800">
									Contract Details
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-base text-gray-700">
									Upgrade to Premium to see detailed analysis, including key
									clauses and recommendations.
								</p>
								<Button variant="outline" onClick={onUpgrade} className="mt-6">
									Upgrade to Premium
								</Button>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>

			<Accordion type="single" collapsible className="mb-8">
				{renderPremiumContent(
					<>
						<AccordionItem value="contract-details">
							<AccordionTrigger className="text-lg font-semibold text-gray-800">
								Additional Details
							</AccordionTrigger>
							<AccordionContent>
								<div className="grid lg:grid-cols-2 gap-8 mt-4">
									<div>
										<h3 className="text-lg font-semibold text-gray-800 mb-2">
											Duration and Termination
										</h3>
										<p className="text-gray-700 leading-relaxed">
											{analysisResults.contractDuration}
										</p>
										<h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
											Termination Conditions
										</h4>
										<p className="text-gray-700 leading-relaxed">
											{analysisResults.terminationConditions}
										</p>
									</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-800 mb-2">
											Legal Compliance
										</h3>
										<p className="text-gray-700 leading-relaxed">
											{analysisResults.legalCompliance}
										</p>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</>
				)}
			</Accordion>

			<Card className="shadow-xl">
				<CardHeader>
					<CardTitle className="text-xl font-semibold text-gray-800">
						Negotiation Points
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-4">
						{analysisResults.negotiationPoints?.map((point, index) => (
							<li className="flex items-start" key={index}>
								<span className="mr-3 text-purple-600">
									<Check />
								</span>
								<p className="text-gray-700 leading-relaxed">{point}</p>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
