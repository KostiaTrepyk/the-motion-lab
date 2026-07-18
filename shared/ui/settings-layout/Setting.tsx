import { twMerge } from "tailwind-merge";
import { Typography } from "../Typography";

export interface SettingProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
	labelText: string;
	htmlFor?: string; // Добавляем проп для связи с инпутом
}

export function Setting({ children, labelText, htmlFor, ...props }: SettingProps) {
	return (
		<div {...props} className={twMerge("flex flex-col gap-1.5", props.className)}>
			<label htmlFor={htmlFor}>
				<Typography type="caption" className="text-neutral-400 text-xs">
					{labelText}
				</Typography>
			</label>
			{children}
		</div>
	);
}
