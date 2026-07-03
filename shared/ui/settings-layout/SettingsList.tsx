import { twMerge } from "tailwind-merge";

export interface SettingsListProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {}

export function SettingsList({ children, ...props }: SettingsListProps) {
	return (
		<div {...props} className={twMerge("flex flex-col gap-4", props.className)}>
			{children}
		</div>
	);
}
