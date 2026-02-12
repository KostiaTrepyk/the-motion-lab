"use client";

import dynamic from "next/dynamic";

import Loader from "@/components/ui/Loader";

const Lab = dynamic(() => import("@/components/lab/Lab"), {
	loading: () => <Loader />,

	// Отключаем SSR (Server Side Rendering) для игры,
	// так как там сплошной Framer Motion и Drag-n-Drop, которые работают только в браузере.
	// Это избавит от ошибок "Hydration mismatch".
	ssr: false,
});

export default function LabPage() {
	return (
		<main>
			<Lab />
		</main>
	);
}
