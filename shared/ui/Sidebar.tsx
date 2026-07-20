import { twMerge } from "tailwind-merge";
import { Typography } from "./Typography";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, React.PropsWithChildren {
	title: string;
	contentAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

export function Sidebar({ title, contentAttrs, children, ...attrs }: SidebarProps) {
	return (
		<aside
			{...attrs}
			className={twMerge(
				"flex flex-col bg-neutral-900/25 border-neutral-800 border-l w-full h-full",
				attrs.className,
			)}
		>
			<div className="p-4 border-neutral-800 border-b">
				<Typography
					type="h2"
					className="font-bold text-neutral-300 text-xl text-center uppercase tracking-widest"
				>
					{title}
				</Typography>
			</div>

			<div {...contentAttrs} className={twMerge("flex-1 p-4 overflow-y-auto", contentAttrs?.className)}>
				{children}
			</div>
		</aside>
	);
}
