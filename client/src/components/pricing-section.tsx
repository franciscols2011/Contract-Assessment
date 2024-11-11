// components/PricingSection.tsx
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, Loader } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import { motion } from "framer-motion";
import { UploadModal } from "./modals/upload-modal";

export function PricingSection() {
	const { subscriptionStatus, isSubscriptionLoading, isSubscriptionError } =
		useSubscription();
	const isPremium = subscriptionStatus === "active";
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

	const handleUpgrade = async () => {
		try {
			const response = await api.get("/payments/create-checkout-session");
			const stripe = await stripePromise;
			await stripe?.redirectToCheckout({
				sessionId: response.data.sessionId,
			});
		} catch (error) {
			console.error(error);
		}
	};

	if (isSubscriptionLoading) {
		return (
			<div className="container mx-auto px-4 py-16 flex justify-center items-center">
				<Loader className="w-8 h-8 text-primary animate-spin" />
			</div>
		);
	}

	if (isSubscriptionError) {
		return (
			<div className="container mx-auto px-4 py-16 flex justify-center items-center">
				<p className="text-red-500">Failed to load subscription status.</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-background/80">
			<motion.h2
				className="text-4xl font-extrabold tracking-tight sm:text-5xl text-center mb-4"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Choose the Plan That's Right for You
			</motion.h2>
			<motion.p
				className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				Select the perfect plan for your needs. Upgrade anytime to unlock
				premium features and support.
			</motion.p>
			<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
				<PricingCard
					title="Basic"
					description="Essential features to get started"
					price="Free"
					period="/lifetime"
					features={[
						"Basic contract analysis",
						"Up to 5 projects",
						"Access to contract summary",
					]}
					buttonText="Get Started"
					onButtonClick={() => setIsUploadModalOpen(true)}
					isCurrent={!isPremium}
					isDisabled={isPremium}
				/>
				<PricingCard
					title="Premium"
					description="Advanced features for professionals"
					price="$50"
					highlight
					period="/lifetime"
					features={[
						"Advanced contract analysis",
						"Unlimited projects",
						"Chat with your contract",
						"Risk identification with severity levels",
						"Opportunity identification with impact levels",
						"Comprehensive contract summary",
						"Improvement recommendations",
						"Key clauses identification",
						"Legal compliance assessment",
						"Negotiation points",
						"Contract duration analysis",
						"Termination conditions summary",
						"Compensation structure breakdown",
						"Performance metrics identification",
						"Intellectual property clause summary",
					]}
					buttonText="Upgrade"
					onButtonClick={handleUpgrade}
					isCurrent={isPremium}
					isDisabled={isPremium}
				/>
			</div>
			<UploadModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				onUploadComplete={() => {}}
			/>
		</div>
	);
}

interface PricingCardProps {
	title: string;
	description: string;
	price: string;
	period: string;
	features: string[];
	buttonText: string;
	highlight?: boolean;
	onButtonClick: () => void;
	isCurrent: boolean;
	isDisabled: boolean;
}

function PricingCard({
	title,
	description,
	price,
	period,
	features,
	buttonText,
	highlight,
	onButtonClick,
	isCurrent,
	isDisabled,
}: PricingCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Card
			className={cn(
				"flex flex-col relative overflow-hidden transition-transform duration-300 transform",
				highlight ? "border-primary shadow-lg" : "",
				!isDisabled && isHovered ? "scale-105 shadow-2xl" : ""
			)}
			onMouseEnter={() => !isDisabled && setIsHovered(true)}
			onMouseLeave={() => !isDisabled && setIsHovered(false)}
		>
			{!isDisabled && (
				<motion.div
					className={cn(
						"absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 transition-opacity duration-300",
						isHovered ? "opacity-20" : ""
					)}
					initial={{ opacity: 0 }}
					animate={{ opacity: isHovered ? 0.2 : 0 }}
				></motion.div>
			)}
			<CardHeader className="relative z-10">
				<CardTitle className="text-2xl flex items-center gap-2">
					{title}
					{isCurrent && (
						<motion.span
							className="ml-2 flex items-center text-green-500"
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<CheckCircle className="w-5 h-5" />
						</motion.span>
					)}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex-grow relative z-10">
				<p className="text-5xl font-extrabold mb-6">
					{price}
					<span className="text-base font-normal text-muted-foreground">
						{period}
					</span>
				</p>
				<ul className="space-y-2">
					{features.map((feature, index) => (
						<li className="flex items-center gap-2 text-gray-700" key={index}>
							<span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
							{feature}
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter className="relative z-10">
				<Button
					className={cn(
						"w-full flex items-center justify-center transform transition-transform duration-300",
						!isDisabled && "hover:scale-105",
						isDisabled ? "cursor-not-allowed bg-gray-300 text-gray-500" : ""
					)}
					variant={highlight ? "default" : "outline"}
					onClick={isDisabled ? () => {} : onButtonClick}
					disabled={isDisabled}
				>
					{buttonText}
					{isCurrent && (
						<motion.span
							className="ml-2 text-green-500"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
						>
							<CheckCircle className="w-4 h-4" />
						</motion.span>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}
