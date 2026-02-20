"use client";

import { useState } from "react";
import IconButton from "./IconButton";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export interface CollapseProps extends React.PropsWithChildren {
	label: string;
	isCollapsed?: boolean;
	containerAttrs?: React.HTMLAttributes<HTMLDivElement>;
	labelContainerAttrs?: React.HTMLAttributes<HTMLDivElement>;
	itemsContainerAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

export function Collapse({
	label,
	children,
	isCollapsed = false,
	containerAttrs = {},
	labelContainerAttrs = {},
	itemsContainerAttrs = {},
}: CollapseProps) {
	const [collapsed, setCollapsed] = useState(isCollapsed);

	function toggleCollapse() {
		setCollapsed((prev) => !prev);
	}

	return (
		<div {...containerAttrs}>
			<div
				{...labelContainerAttrs}
				className={twMerge(
					labelContainerAttrs.className,
					"flex justify-between",
				)}
			>
				<div className="text-lg">{label}</div>

				<IconButton
					variant="outline"
					color="secondary"
					size="small"
					onClick={toggleCollapse}
				>
					{collapsed ? (
						<MdOutlineArrowDropDown className="w-full rotate-0 scale-150 transition-[rotate] ease-out" />
					) : (
						<MdOutlineArrowDropDown className="w-full rotate-180 scale-150 transition-[rotate] ease-out" />
					)}
				</IconButton>
			</div>

			<div
				{...itemsContainerAttrs}
				className={twMerge(
					itemsContainerAttrs.className,
					collapsed ? "hidden" : "",
				)}
			>
				{children}
			</div>
		</div>
	);
}
