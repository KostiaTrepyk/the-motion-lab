import { twMerge } from "tailwind-merge";

export interface SettingProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
	labelText: string;
	htmlFor?: string; // Добавляем проп для связи с инпутом
}

export function Setting({ children, labelText, htmlFor, ...props }: SettingProps) {
	return (
		<div {...props} className={twMerge("flex flex-col gap-2", props.className)}>
			<label htmlFor={htmlFor} className="text-neutral-400 text-xs">
				{labelText}
			</label>
			{children}
		</div>
	);
}
