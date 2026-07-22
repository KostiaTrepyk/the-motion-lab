"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Setting, Typography } from "@/shared/ui";
import { INPUT_STYLES } from "./consts";

export type CubicBezierArray = [number, number, number, number];

interface CubicBezierEditorProps {
	value?: CubicBezierArray | string;
	onChange: (value: CubicBezierArray) => void;
}

const PRESETS: Record<string, CubicBezierArray> = {
	ease: [0.25, 0.1, 0.25, 1.0],
	easeIn: [0.42, 0.0, 1.0, 1.0],
	easeOut: [0.0, 0.0, 0.58, 1.0],
	easeInOut: [0.42, 0.0, 0.58, 1.0],
	linear: [0.0, 0.0, 1.0, 1.0],
	anticipate: [0.36, 0.0, 0.66, -0.56],
	backOut: [0.34, 1.56, 0.64, 1.0],
};

const PADDING = 24;
const SVG_WIDTH = 220;
const SVG_HEIGHT = 160;
const DRAW_WIDTH = SVG_WIDTH - PADDING * 2;
const DRAW_HEIGHT = SVG_HEIGHT - PADDING * 2;

const MIN_Y = -0.75;
const MAX_Y = 1.75;

function normXToPx(x: number): number {
	const clampedX = Math.max(0, Math.min(1, x));
	return PADDING + clampedX * DRAW_WIDTH;
}

function normYToPx(y: number): number {
	const clampedY = Math.max(MIN_Y, Math.min(MAX_Y, y));
	const norm = (clampedY - MIN_Y) / (MAX_Y - MIN_Y);
	return PADDING + (1 - norm) * DRAW_HEIGHT;
}

function pxToNormX(px: number): number {
	const norm = (px - PADDING) / DRAW_WIDTH;
	const clampedNorm = Math.max(0, Math.min(1, norm));
	return Number(clampedNorm.toFixed(2));
}

function pxToNormY(py: number): number {
	const norm = 1 - (py - PADDING) / DRAW_HEIGHT;
	const y = MIN_Y + norm * (MAX_Y - MIN_Y);
	const clampedY = Math.max(MIN_Y, Math.min(MAX_Y, y));
	return Number(clampedY.toFixed(2));
}

function parseBezierValue(val?: CubicBezierArray | string): CubicBezierArray {
	if (Array.isArray(val) && val.length === 4) {
		const validVal = val.map((v) => (typeof v === "number" && !isNaN(v) ? v : 0));
		return [
			Math.max(0, Math.min(1, validVal[0])),
			Math.max(MIN_Y, Math.min(MAX_Y, validVal[1])),
			Math.max(0, Math.min(1, validVal[2])),
			Math.max(MIN_Y, Math.min(MAX_Y, validVal[3])),
		];
	}
	if (typeof val === "string" && PRESETS[val]) {
		return PRESETS[val];
	}
	return PRESETS.ease;
}

function isPresetMatch(a: CubicBezierArray, b: CubicBezierArray): boolean {
	return (
		Math.abs(a[0] - b[0]) < 0.03 &&
		Math.abs(a[1] - b[1]) < 0.03 &&
		Math.abs(a[2] - b[2]) < 0.03 &&
		Math.abs(a[3] - b[3]) < 0.03
	);
}

export function CubicBezierEditor({ value, onChange }: CubicBezierEditorProps) {
	const bezier: CubicBezierArray = parseBezierValue(value);
	const [x1, y1, x2, y2] = bezier;

	const bezierRef = useRef<CubicBezierArray>(bezier);
	const activeHandleRef = useRef<1 | 2 | null>(null);
	const svgRef = useRef<SVGSVGElement | null>(null);
	const rafIdRef = useRef<number | null>(null);

	const [activeHandle, setActiveHandle] = useState<1 | 2 | null>(null);
	const [isPlayingPreview, setIsPlayingPreview] = useState(false);

	useEffect(() => {
		bezierRef.current = bezier;
		activeHandleRef.current = activeHandle;
	});

	const p0Px = { x: normXToPx(0), y: normYToPx(0) };
	const p1Px = { x: normXToPx(x1), y: normYToPx(y1) };
	const p2Px = { x: normXToPx(x2), y: normYToPx(y2) };
	const p3Px = { x: normXToPx(1), y: normYToPx(1) };

	const startDrag = (handleIndex: 1 | 2) => {
		activeHandleRef.current = handleIndex;
		setActiveHandle(handleIndex);
	};

	const handlePointerMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			const handle = activeHandleRef.current;
			if (!handle || !svgRef.current) return;

			const rect = svgRef.current.getBoundingClientRect();
			if (!rect.width || !rect.height) return;

			const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
			const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

			// Sub-pixel Screen scaling ratio calculation
			const scaleX = SVG_WIDTH / rect.width;
			const scaleY = SVG_HEIGHT / rect.height;

			const px = (clientX - rect.left) * scaleX;
			const py = (clientY - rect.top) * scaleY;

			const newX = pxToNormX(px);
			const newY = pxToNormY(py);

			const [curX1, curY1, curX2, curY2] = bezierRef.current;

			if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = requestAnimationFrame(() => {
				if (handle === 1) {
					onChange([newX, newY, curX2, curY2]);
				} else if (handle === 2) {
					onChange([curX1, curY1, newX, newY]);
				}
			});
		},
		[onChange]
	);

	const handlePointerUp = useCallback(() => {
		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
		activeHandleRef.current = null;
		setActiveHandle(null);
	}, [setActiveHandle]);

	useEffect(() => {
		if (activeHandle) {
			const onMove = (e: MouseEvent | TouchEvent) => handlePointerMove(e);
			const onUp = () => handlePointerUp();

			window.addEventListener("mousemove", onMove, { passive: true });
			window.addEventListener("mouseup", onUp);
			window.addEventListener("touchmove", onMove, { passive: true });
			window.addEventListener("touchend", onUp);

			return () => {
				window.removeEventListener("mousemove", onMove);
				window.removeEventListener("mouseup", onUp);
				window.removeEventListener("touchmove", onMove);
				window.removeEventListener("touchend", onUp);
			};
		}
	}, [activeHandle, handlePointerMove, handlePointerUp]);

	const bezierCssStr = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

	const triggerPreviewAnimation = () => {
		setIsPlayingPreview(true);
		setTimeout(() => setIsPlayingPreview(false), 1200);
	};

	return (
		<div className="flex flex-col gap-3 bg-neutral-950/60 p-3 border border-neutral-800/80 rounded-xl">
			{/* Preset Selectors */}
			<div className="flex flex-wrap gap-1.5">
				{Object.entries(PRESETS).map(([key, presetVal]) => {
					const isActive = isPresetMatch(bezier, presetVal);
					return (
						<button
							key={key}
							type="button"
							onClick={() => onChange(presetVal)}
							className={`px-2 py-0.5 text-xs rounded border font-medium transition-colors ${
								isActive
									? "bg-amber-500/20 text-amber-400 border-amber-500/40"
									: "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:bg-neutral-800/80"
							}`}
						>
							{key}
						</button>
					);
				})}
			</div>

			{/* Interactive SVG Editor */}
			<div className="relative flex justify-center bg-neutral-900/90 p-2 border border-neutral-800 rounded-lg overflow-hidden select-none">
				<svg
					ref={svgRef}
					width={SVG_WIDTH}
					height={SVG_HEIGHT}
					viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
					className="touch-none cursor-crosshair max-w-full"
				>
					{/* Grid lines */}
					<line
						x1={PADDING}
						y1={normYToPx(0)}
						x2={PADDING + DRAW_WIDTH}
						y2={normYToPx(0)}
						stroke="#334155"
						strokeDasharray="3 3"
						strokeWidth="1"
					/>
					<line
						x1={PADDING}
						y1={normYToPx(1)}
						x2={PADDING + DRAW_WIDTH}
						y2={normYToPx(1)}
						stroke="#334155"
						strokeDasharray="3 3"
						strokeWidth="1"
					/>

					{/* Curve Handle Lines */}
					<line x1={p0Px.x} y1={p0Px.y} x2={p1Px.x} y2={p1Px.y} stroke="#3b82f6" strokeWidth="1.5" />
					<line x1={p3Px.x} y1={p3Px.y} x2={p2Px.x} y2={p2Px.y} stroke="#f59e0b" strokeWidth="1.5" />

					{/* Cubic Bezier Path */}
					<path
						d={`M ${p0Px.x},${p0Px.y} C ${p1Px.x},${p1Px.y} ${p2Px.x},${p2Px.y} ${p3Px.x},${p3Px.y}`}
						fill="none"
						stroke="#ec4899"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>

					{/* Anchor points */}
					<circle cx={p0Px.x} cy={p0Px.y} r="4" fill="#94a3b8" />
					<circle cx={p3Px.x} cy={p3Px.y} r="4" fill="#94a3b8" />

					{/* Control Point 1 (Blue) */}
					<circle
						cx={p1Px.x}
						cy={p1Px.y}
						r="8"
						fill="#3b82f6"
						stroke="#ffffff"
						strokeWidth="2"
						onMouseDown={(e) => {
							e.preventDefault();
							startDrag(1);
						}}
						onTouchStart={() => startDrag(1)}
						className="cursor-grab active:cursor-grabbing hover:stroke-amber-300 transition-colors"
					/>

					{/* Control Point 2 (Amber) */}
					<circle
						cx={p2Px.x}
						cy={p2Px.y}
						r="8"
						fill="#f59e0b"
						stroke="#ffffff"
						strokeWidth="2"
						onMouseDown={(e) => {
							e.preventDefault();
							startDrag(2);
						}}
						onTouchStart={() => startDrag(2)}
						className="cursor-grab active:cursor-grabbing hover:stroke-amber-300 transition-colors"
					/>
				</svg>
			</div>

			{/* Animation preview bar */}
			<div className="flex flex-col gap-1.5 bg-neutral-900/60 p-2 border border-neutral-800 rounded-lg">
				<div className="flex justify-between items-center">
					<Typography type="mono" className="text-neutral-400 text-xs">
						Preview ({bezierCssStr})
					</Typography>
					<button
						type="button"
						onClick={triggerPreviewAnimation}
						className="bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 border border-amber-500/30 rounded font-medium text-amber-400 hover:text-amber-300 text-xs transition-colors"
					>
						Play
					</button>
				</div>
				<div className="relative bg-neutral-950 border border-neutral-800 rounded-full w-full h-3 overflow-hidden">
					<div
						className="top-0 bottom-0 left-0 absolute bg-gradient-to-r from-pink-500 to-amber-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] rounded-full w-3 h-3"
						style={{
							animation: isPlayingPreview ? `bezierPreview 1s ${bezierCssStr} forwards` : "none",
						}}
					/>
				</div>
				<style jsx>{`
					@keyframes bezierPreview {
						0% {
							left: 0%;
						}
						100% {
							left: calc(100% - 12px);
						}
					}
				`}</style>
			</div>

			{/* Numeric Inputs */}
			<div className="gap-2 grid grid-cols-4">
				<Setting labelText="X1">
					<input
						type="number"
						step="0.05"
						min="0"
						max="1"
						value={x1}
						onChange={(e) => onChange([parseFloat(e.target.value) || 0, y1, x2, y2])}
						className={INPUT_STYLES}
					/>
				</Setting>
				<Setting labelText="Y1">
					<input
						type="number"
						step="0.05"
						value={y1}
						onChange={(e) => onChange([x1, parseFloat(e.target.value) || 0, x2, y2])}
						className={INPUT_STYLES}
					/>
				</Setting>
				<Setting labelText="X2">
					<input
						type="number"
						step="0.05"
						min="0"
						max="1"
						value={x2}
						onChange={(e) => onChange([x1, y1, parseFloat(e.target.value) || 0, y2])}
						className={INPUT_STYLES}
					/>
				</Setting>
				<Setting labelText="Y2">
					<input
						type="number"
						step="0.05"
						value={y2}
						onChange={(e) => onChange([x1, y1, x2, parseFloat(e.target.value) || 0])}
						className={INPUT_STYLES}
					/>
				</Setting>
			</div>
		</div>
	);
}
