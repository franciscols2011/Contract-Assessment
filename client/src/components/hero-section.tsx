import { cn } from "@/lib/utils";
import {
	ArrowRight,
	FileSearch,
	Globe,
	Hourglass,
	PiggyBank,
	Scale,
	ShieldCheck,
	Sparkles,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

const features = [
	{
		title: "AI-Powered Analysis",
		description:
			"Leverage advanced AI to analyze contracts quickly and accurately.",
		icon: FileSearch,
	},
	{
		title: "Risk Identification",
		description: "Spot potential risks and opportunities in your contracts.",
		icon: ShieldCheck,
	},
	{
		title: "Streamlined Negotiation",
		description: "Accelerate the negotiation process with AI-driven insights.",
		icon: Hourglass,
	},
	{
		title: "Cost Reduction",
		description: "Significantly reduce legal costs through automation.",
		icon: PiggyBank,
	},
	{
		title: "Improved Compliance",
		description: "Ensure your contracts meet all regulatory requirements.",
		icon: Scale,
	},
	{
		title: "Faster Turnaround",
		description: "Complete contract reviews in minutes instead of hours.",
		icon: Zap,
	},
];

export function HeroSection() {
	return (
		<section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80">
			<div className="container px-4 md:px-6 flex flex-col items-center max-w-6xl mx-auto">
				<Link
					href="/dashboard"
					className={cn(
						buttonVariants({ variant: "outline", size: "sm" }),
						"px-4 py-2 mb-4 rounded-full hidden md:flex hover:bg-primary hover:text-white transition-colors duration-300"
					)}
				>
					<Sparkles className="mr-2 h-4 w-4 animate-spin" />
					Introducing Simple Metrics for Your Team
				</Link>
				<div className="text-center mb-12 w-full">
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4 animate-pulse">
						Revolutionize Your Contracts
					</h1>
					<p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
						Harness the power of AI to analyze, understand, and optimize your
						contracts in no time.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Button
							className="inline-flex items-center justify-center text-lg transform transition-transform duration-300 hover:scale-105"
							size="lg"
						>
							Get Started
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
						<Button
							className="inline-flex items-center justify-center text-lg transform transition-transform duration-300 hover:scale-105"
							size="lg"
							variant="outline"
						>
							Learn More
							<Globe className="ml-2 h-5 w-5" />
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Card className="h-full transform transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white">
									<CardContent className="p-6 flex flex-col items-center text-center">
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
											<feature.icon className="text-primary h-6 w-6" />
										</div>
										<h3 className="text-lg font-semibold mb-2">
											{feature.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
