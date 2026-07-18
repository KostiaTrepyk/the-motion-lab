import type { MotionDivNode } from "@/entities/node";
import { labStoreActions } from "@/entities/node";
import { NestedSetting } from "@/shared/ui/settings-layout/NestedSetting";
import { Setting } from "@/shared/ui/settings-layout/Setting";
import { SettingsList } from "@/shared/ui/settings-layout/SettingsList";
import { Typography } from "@/shared/ui/Typography";
import type { TargetAndTransition } from "framer-motion";
import { useNodeStyles } from "../../lib/useNodeStyles";
import { BaseDivSettings } from "./BaseDivSettings";
import { INPUT_STYLES } from "./consts";

export interface MotionDivSettingsProps {
	node: MotionDivNode;
}

export function MotionDivSettings({ node }: MotionDivSettingsProps) {
	const { updateClassName, handleAlignText } = useNodeStyles(node.id, "motion.div");

	// Вспомогательная функция, чтобы не писать длинные вызовы
	const updateAnimateProp = (property: string, value: number) => {
		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: { animate: { [property]: value } },
		});
	};

	const updateInitialProp = (property: string, value: number) => {
		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: { initial: { [property]: value } },
		});
	};

	const initialProps = node.props.initial as TargetAndTransition | undefined;
	const animateProps = node.props.animate as TargetAndTransition | undefined;

	// "В рамках нашего UI-редактора мы пока не используем кейфреймы-массивы, здесь точно лежит число"
	const currentInitialOpacity = (initialProps?.opacity as number) ?? 1;
	const currentInitialScale = (initialProps?.scale as number) ?? 1;

	const currentAnimateOpacity = (animateProps?.opacity as number) ?? 1;
	const currentAnimateScale = (animateProps?.scale as number) ?? 1;

	return (
		<>
			<BaseDivSettings
				node={node}
				handleClassNameChange={(e) => updateClassName(e.target.value)}
				handleAlignText={(val) => handleAlignText(node.props?.className, val)}
			/>

			<SettingsList label="Motion Div Settings">
				<NestedSetting label="Initial">
					<Setting labelText="Scale">
						<input
							type="number"
							step="0.1"
							value={currentInitialScale}
							onChange={(e) => updateInitialProp("scale", parseFloat(e.target.value) || 0)}
							className={INPUT_STYLES}
						/>
					</Setting>

					{/* Улучшенный ползунок Range */}
					<Setting labelText="Opacity">
						<div className="flex items-center gap-3">
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={currentInitialOpacity}
								onChange={(e) => updateInitialProp("opacity", parseFloat(e.target.value) || 0)}
								className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
							/>
							<Typography type="mono" className="w-8 text-neutral-400 text-right">
								{currentInitialOpacity}
							</Typography>
						</div>
					</Setting>
				</NestedSetting>

				<NestedSetting label="Animate">
					<Setting labelText="Scale">
						<input
							type="number"
							step="0.1"
							value={currentAnimateScale}
							onChange={(e) => updateAnimateProp("scale", parseFloat(e.target.value) || 0)}
							className={INPUT_STYLES}
						/>
					</Setting>

					{/* Улучшенный ползунок Range */}
					<Setting labelText="Opacity">
						<div className="flex items-center gap-3">
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={currentAnimateOpacity}
								onChange={(e) => updateAnimateProp("opacity", parseFloat(e.target.value) || 0)}
								className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
							/>
							<Typography type="mono" className="w-8 text-neutral-400 text-right">
								{currentAnimateOpacity}
							</Typography>
						</div>
					</Setting>
				</NestedSetting>
			</SettingsList>
		</>
	);
}
