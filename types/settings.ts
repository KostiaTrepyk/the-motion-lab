export interface BaseSetting {
	id: string; // Уникальный ключ
	label: string;
	propertyName: string;
	isDisabled: boolean; // Активна ли настройка
	canBeDisabled: boolean; // Может ли настройка быть отключена
	isRequired: boolean;
	templateSettingId: string;
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
	collapsed: boolean; // Для UI, чтобы знать, свернут ли объект
	settings: Setting[]; // Вложенные настройки
}

export type Setting = SliderSetting | TextSetting | SelectSetting | NestedSetting;
