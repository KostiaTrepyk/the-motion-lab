"use client";

import { motion } from "motion/react";
import { FiAlertTriangle, FiHome, FiRefreshCcw } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Link from "@/components/ui/Link";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<main className="relative flex flex-col justify-center items-center p-4 h-screen overflow-hidden text-center">
			{/* Фоновый эффект (Красное свечение опасности) */}
			<div className="z-0 absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-red-900/20 via-slate-950 to-slate-950" />

			<div className="z-10 flex flex-col items-center gap-6">
				{/* 1. Иконка с анимацией тряски */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{
						scale: 1,
						opacity: 1,
						rotate: [0, -10, 10, -10, 10, 0], // Эффект тряски
					}}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<FiAlertTriangle className="drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] w-24 h-24 text-red-500" />
				</motion.div>

				{/* 2. Заголовок */}
				<motion.h1
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="font-rpg font-bold text-red-400 text-4xl tracking-wider"
				>
					ALCHEMY FAILURE
				</motion.h1>

				{/* 3. Текст ошибки (стилизован под лог) */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="bg-red-950/30 p-4 border border-red-900/50 rounded-lg max-w-md font-mono text-red-200/80 text-sm"
				>
					<p className="opacity-50 mb-2 text-red-500 text-xs uppercase">
						Error Log:
					</p>
					"{error.message || "Unknown magical disturbance detected."}"
				</motion.div>

				{/* 4. Кнопки действий */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="flex flex-wrap gap-4"
				>
					{/* Кнопка RESET (Попробовать снова) */}
					<Button
						className="group"
						color="danger"
						size="large"
						onClick={() => reset()}
					>
						<FiRefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
						Restart lab
					</Button>

					{/* Кнопка HOME (Домой) */}
					<Link
						className="group"
						href="/"
						color="secondary"
						variant="outline"
						size="large"
					>
						<FiHome className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
						Retreat to Safety
					</Link>
				</motion.div>
			</div>
		</main>
	);
}
