import { ContractAnalysis } from "@/interfaces/contract.interface";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { UploadModal } from "../modals/upload-modal";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { motion } from "framer-motion";

async function fetchUserContract(): Promise<ContractAnalysis[]> {
	const response = await api.get("/contracts/user-contracts");
	return response.data;
}

export default function UserContracts() {
	const { data: contracts } = useQuery<ContractAnalysis[]>({
		queryKey: ["user-contracts"],
		queryFn: () => fetchUserContract(),
	});

	const [sorting, setSorting] = useState<SortingState>([]);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

	const contractTypeColors: { [key: string]: string } = {
		Employment: "bg-blue-100 text-blue-800 hover:bg-blue-200",
		"Non-Disclosure Agreement":
			"bg-green-100 text-green-800 hover:bg-green-200",
		Sales: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
		Lease: "bg-red-100 text-red-800 hover:bg-red-200",
		"Services Contract": "bg-purple-100 text-purple-800 hover:bg-purple-200",
		Other: "bg-gray-100 text-gray-800 hover:bg-gray-200",
	};

	const columns: ColumnDef<ContractAnalysis>[] = [
		{
			accessorKey: "_id",
			header: () => <Button variant="ghost">Contract ID</Button>,
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue("_id")}</div>
			),
		},
		{
			accessorKey: "overallScore",
			header: () => <Button variant="ghost">Overall Score</Button>,
			cell: ({ row }) => {
				const score = parseFloat(row.getValue("overallScore"));
				return (
					<Badge
						className="rounded-md"
						variant={
							score > 75 ? "success" : score < 50 ? "destructive" : "secondary"
						}
					>
						{score.toFixed(2)}%
					</Badge>
				);
			},
		},
		{
			accessorKey: "contractType",
			header: "Contract Type",
			cell: ({ row }) => {
				const contractType = row.getValue("contractType") as string;
				const colorClass =
					contractTypeColors[contractType] || contractTypeColors["Other"];
				return (
					<Badge className={cn("rounded-md", colorClass)}>{contractType}</Badge>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const contract = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="size-8 rounded-full p-0">
								<span className="sr-only">Open options</span>
								<MoreHorizontalIcon className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Link href={`/dashboard/contract/${contract._id}`}>
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<span className="text-destructive">Delete</span>
									</DropdownMenuItem>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete
											your contract and remove your data from our servers.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction>Continue</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data: contracts ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	const totalContracts = contracts?.length || 0;
	const averageScore =
		totalContracts > 0
			? (contracts?.reduce(
					(sum, contract) => sum + (contract.overallScore ?? 0),
					0
			  ) ?? 0) / totalContracts
			: 0;

	const highRiskContracts =
		contracts?.filter((contract) =>
			contract.risks.some((risk) => risk.severity === "high")
		).length ?? 0;

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="flex justify-between items-center">
				<motion.h1
					className="text-3xl font-bold"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					Contract Overview
				</motion.h1>
				<Button
					onClick={() => setIsUploadModalOpen(true)}
					className="transform transition-transform duration-300 hover:scale-105"
				>
					Add New Contract
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Contracts
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalContracts}</div>
						</CardContent>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Average Contract Score
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{averageScore.toFixed(2)}%
							</div>
						</CardContent>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								High Risk Contracts
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{highRiskContracts}</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			<div className="rounded-md border overflow-hidden">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="overflow-x-auto"
				>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className="hover:bg-gray-100 transition-colors"
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="text-center">
										No contracts found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</motion.div>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
			<UploadModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				onUploadComplete={() => table.reset()}
			/>
		</div>
	);
}
