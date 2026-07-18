import { twMerge } from "tailwind-merge";
import { Typography } from "../Typography";

export interface SettingsListProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
	label?: string;
	labelProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function SettingsList({ label, labelProps, children, ...props }: SettingsListProps) {
	return (
		<div {...props} className={twMerge("flex flex-col gap-4 py-5", props.className)}>
			{label && (
				<Typography
					type="caption"
					className={twMerge(
						"font-bold text-teal-500 text-xs uppercase tracking-wider",
						labelProps?.className,
					)}
				>
					{label}
				</Typography>
			)}
			<div className="flex flex-col gap-4">{children}</div>
		</div>
	);
}
