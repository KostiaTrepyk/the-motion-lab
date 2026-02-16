export interface BaseSetting {
	id: string; // Уникальный ключ
	label: string;
}

export interface SliderSetting extends BaseSetting {
	type: "slider";
	value: number;
	min: number;
	max: number;
	step?: number;
	markers?: number[]; // Дополнительные метки на ползунке
}

export interface TextSetting extends BaseSetting {
	type: "text";
	value: string;
}

export interface SelectSetting extends BaseSetting {
	type: "select";
	value: string;
	options: string[]; // Например: ['spring', 'tween']
}

export interface NestedSetting extends BaseSetting {
	type: "object";
	settings: EditorSetting[]; // Вложенные настройки
}

export type EditorSetting =
	| SliderSetting
	| TextSetting
	| SelectSetting
	| NestedSetting;
