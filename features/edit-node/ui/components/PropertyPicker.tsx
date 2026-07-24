"use client";

import { CSS_PROPERTY_REGISTRY, type CssPropertyConfig, type CssPropertyValue } from "@/entities/node";
import { Button, Input } from "@/shared/ui";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiCode, FiPlus, FiSearch, FiX } from "react-icons/fi";

export interface PropertyPickerProps {
	existingKeys: string[];
	onAddProperty: (key: string, defaultValue: CssPropertyValue) => void;
}

export function PropertyPicker({ existingKeys, onAddProperty }: PropertyPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [openDirection, setOpenDirection] = useState<"down" | "up">("down");
	const [searchQuery, setSearchQuery] = useState("");
	const [showCustomCss, setShowCustomCss] = useState(false);
	const [customKey, setCustomKey] = useState("");
	const [customValue, setCustomValue] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);

	// Calculate optimal open direction (upward if near screen bottom)
	const updateOpenDirection = () => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			if (spaceBelow < 360) {
				setOpenDirection("up");
			} else {
				setOpenDirection("down");
			}
		}
	};

	// Close popover when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
				setShowCustomCss(false);
			}
		};
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Filter registry keys that aren't already added
	const availableProperties = useMemo(() => {
		return Object.entries(CSS_PROPERTY_REGISTRY).filter(([key, config]) => {
			if (existingKeys.includes(key)) return false;
			if (!searchQuery.trim()) return true;
			const query = searchQuery.toLowerCase();
			return (
				key.toLowerCase().includes(query) ||
				config.label.toLowerCase().includes(query) ||
				config.category.toLowerCase().includes(query)
			);
		});
	}, [existingKeys, searchQuery]);

	// Group properties by category
	const categorizedProperties = useMemo(() => {
		const groups: Record<string, [string, CssPropertyConfig][]> = {
			transform: [],
			appearance: [],
			layout: [],
			filter: [],
		};

		availableProperties.forEach(([key, config]) => {
			if (groups[config.category]) {
				groups[config.category].push([key, config]);
			} else {
				groups.appearance.push([key, config]);
			}
		});

		return groups;
	}, [availableProperties]);

	const handleOpenStandard = () => {
		updateOpenDirection();
		setShowCustomCss(false);
		setIsOpen((prev) => !prev || showCustomCss);
	};

	const handleOpenCustom = () => {
		updateOpenDirection();
		setShowCustomCss(true);
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
		setShowCustomCss(false);
	};

	const handleSelectProperty = (key: string, defaultValue: CssPropertyValue) => {
		onAddProperty(key, defaultValue);
		handleClose();
		setSearchQuery("");
	};

	const handleAddCustomCss = (e: React.FormEvent) => {
		e.preventDefault();
		if (!customKey.trim()) return;
		onAddProperty(customKey.trim(), customValue.trim());
		setCustomKey("");
		setCustomValue("");
		handleClose();
	};

	const positionClasses =
		openDirection === "up"
			? "bottom-full mb-2 left-0 animate-in fade-in slide-in-from-bottom-2 duration-100"
			: "top-full mt-2 left-0 animate-in fade-in slide-in-from-top-2 duration-100";

	return (
		<div className="relative" ref={containerRef}>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={handleOpenStandard}
					className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 border border-amber-500/30 hover:border-amber-500/50 rounded-lg font-medium text-amber-400 text-xs transition-colors"
				>
					<FiPlus className="w-3.5 h-3.5" />
					Add Property
				</button>

				<button
					type="button"
					onClick={handleOpenCustom}
					className="flex items-center gap-1 bg-neutral-800/60 hover:bg-neutral-800 px-2.5 py-1.5 border border-neutral-700/60 rounded-lg text-neutral-400 hover:text-neutral-200 text-xs transition-colors"
				>
					<FiCode className="w-3.5 h-3.5 text-neutral-400" />
					Custom CSS
				</button>
			</div>

			{isOpen && (
				<div
					className={`z-50 absolute flex flex-col bg-neutral-900 shadow-2xl p-3 border border-neutral-800 rounded-xl w-80 max-h-96 overflow-hidden ${positionClasses}`}
				>
					<div className="flex justify-between items-center pb-2 border-neutral-800 border-b">
						<span className="font-semibold text-neutral-200 text-xs">
							{showCustomCss ? "Custom CSS Property" : "Add CSS Property"}
						</span>
						<button type="button" onClick={handleClose} className="text-neutral-400 hover:text-neutral-200">
							<FiX className="w-3.5 h-3.5" />
						</button>
					</div>

					{showCustomCss ? (
						<form onSubmit={handleAddCustomCss} className="flex flex-col gap-2.5 pt-2">
							<Input
								type="text"
								placeholder="Property name (e.g. clipPath)"
								value={customKey}
								onChange={(e) => setCustomKey(e.target.value)}
								sizeVariant="small"
								autoFocus
							/>
							<Input
								type="text"
								placeholder="Value (e.g. circle(50%))"
								value={customValue}
								onChange={(e) => setCustomValue(e.target.value)}
								sizeVariant="small"
							/>
							<div className="flex justify-end gap-2 pt-1">
								<button
									type="button"
									onClick={() => setShowCustomCss(false)}
									className="px-2.5 py-1 rounded text-neutral-400 hover:text-neutral-200 text-xs"
								>
									Back
								</button>
								<Button type="submit" size="small" color="primary" variant="filled">
									Add Property
								</Button>
							</div>
						</form>
					) : (
						<>
							<div className="relative pt-2 pb-1">
								<FiSearch className="top-4 left-2.5 absolute w-3.5 h-3.5 text-neutral-500" />
								<Input
									type="text"
									placeholder="Search property..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									sizeVariant="small"
									className="pl-8"
									autoFocus
								/>
							</div>

							<div className="flex-1 space-y-3.5 pt-1 max-h-72 overflow-y-auto custom-scrollbar">
								{Object.entries(categorizedProperties).map(([category, items]) => {
									if (items.length === 0) return null;
									return (
										<div key={category} className="space-y-1">
											<div className="font-semibold text-[10px] text-neutral-500 uppercase tracking-wider">
												{category}
											</div>
											<div className="space-y-0.5">
												{items.map(([key, config]) => (
													<button
														key={key}
														type="button"
														onClick={() => handleSelectProperty(key, config.defaultValue)}
														className="group flex justify-between items-center bg-neutral-950/40 hover:bg-amber-500/10 px-2.5 py-1.5 rounded-md w-full text-neutral-300 hover:text-amber-400 text-xs text-left transition-colors"
													>
														<span>{config.label}</span>
														<span className="font-mono text-[10px] text-neutral-500 group-hover:text-amber-400/70">
															{key}
														</span>
													</button>
												))}
											</div>
										</div>
									);
								})}

								{availableProperties.length === 0 && (
									<div className="py-6 text-neutral-500 text-xs text-center">
										No matching properties found
									</div>
								)}
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
}
