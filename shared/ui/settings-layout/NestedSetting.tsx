import { Collapse } from "../Collapse";
import { Typography } from "../Typography";

export interface NestedSettingProps extends React.PropsWithChildren {
	label: string;
	defaultOpen?: boolean;
}

export function NestedSetting({ label, children, defaultOpen = true }: NestedSettingProps) {
	return (
		<Collapse
			defaultOpen={defaultOpen}
			className="pl-3 border-neutral-800 border-l-2"
			classNames={{
				icon: "text-neutral-500 group-hover:text-neutral-300",
				content: "gap-3 mt-3",
			}}
			text={
				<Typography
					type="caption"
					className="font-bold text-neutral-300 group-hover:text-teal-400 text-xs uppercase tracking-wide transition-colors"
				>
					{label}
				</Typography>
			}
		>
			{children}
		</Collapse>
	);
}
