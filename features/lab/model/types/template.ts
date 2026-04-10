import { type ModuleName } from "./module";

export interface ModuleTemplate {
	id: string;
	name: ModuleName;
	/** Для UI, чтобы знать, свернут ли модуль */
	collapsed: boolean;
	settings: TemplateSetting[];
	/** Является ли модуль обязательным (например, Default) */
	isRequired: boolean;
}

export interface BaseTemplateSetting {
	/** Уникальный ключ */
	id: string;

	label: string;

	propertyName: string;

	/** Активна ли настройка */
	isDisabled: boolean;

	/** Может ли настройка быть отключена */
	canBeDisabled: boolean;

	/** Является ли настройка обязательной */
	isRequired?: boolean;
}

export interface TemplateSliderSetting extends BaseTemplateSetting {
	type: "slider";
	value: number;
	min: number;
	max: number;
	step?: number;
	/** Дополнительные метки на ползунке */
	markers?: number[];
}

export interface TemplateTextSetting extends BaseTemplateSetting {
	type: "text";
	value: string;
}

export interface TemplateSelectSetting extends BaseTemplateSetting {
	type: "select";
	value: string;
	/** @example ['spring', 'tween'] */
	options: string[];
}

export interface TemplateComponentSetting extends BaseTemplateSetting {
	type: "component";
	value: string;
}

export interface TemplateNestedSetting extends BaseTemplateSetting {
	type: "object";
	/** Для UI, чтобы знать, свернут ли объект */
	collapsed: boolean;
	/** Вложенные настройки */
	settings: TemplateSetting[];
}

export type TemplateSetting =
	| TemplateSliderSetting
	| TemplateTextSetting
	| TemplateSelectSetting
	| TemplateComponentSetting
	| TemplateNestedSetting;
