import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface IOverallScoreChartProps {
	overallScore: number;
}

export default function OverallScoreChart({
	overallScore,
}: IOverallScoreChartProps) {
	const pieChartData = [
		{ name: "Risks", value: 100 - overallScore, color: "#FF6384" },
		{ name: "Opportunities", value: overallScore, color: "#36A2EB" },
	];

	return (
		<motion.div
			className="w-full h-64 flex items-center justify-center"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			<PieChart width={250} height={250}>
				<Pie
					data={pieChartData}
					dataKey="value"
					nameKey="name"
					innerRadius={60}
					outerRadius={80}
					paddingAngle={5}
					startAngle={90}
					endAngle={450}
				>
					{pieChartData.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
					<text
						x={125}
						y={125}
						textAnchor="middle"
						dominantBaseline="middle"
						className="text-2xl font-bold"
					>
						{overallScore}%
					</text>
				</Pie>
				<Tooltip />
			</PieChart>
		</motion.div>
	);
}
