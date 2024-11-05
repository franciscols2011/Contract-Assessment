"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "./shared/user-button";
import Image from "next/image";
import logo from "@/assets/logo.jpg";

const navItems: { name: string; href: string }[] = [
	{ name: "Dashboard", href: "/dashboard" },
];

export function Header() {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4">
			<div className="container flex h-16 items-center justify-between">
				<Link href="/">
					<Image
						src={logo}
						alt="Company Logo"
						width={40}
						height={40}
						className="pr-2"
					/>
				</Link>
				<nav className="hidden md:flex items-center space-x-7 text-sm font-medium">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"transition-colors hover:text-foreground/80",
								pathname === item.href
									? "text-foreground"
									: "text-foreground/60"
							)}
						>
							{item.name}
						</Link>
					))}
				</nav>
				<UserButton />
			</div>
		</header>
	);
}
