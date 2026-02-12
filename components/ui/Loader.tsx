export default function Loader() {
	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="relative flex justify-center items-center mb-8">
				<div className="border-4 border-amber-500/30 border-t-amber-400 rounded-full w-24 h-24 animate-spin" />
				<div className="absolute bg-amber-500/20 shadow-[0_0_30px_rgba(160,120,29,0.5)] rounded-full w-12 h-12 animate-pulse" />
			</div>

			<h1 className="font-rpg text-amber-500 text-2xl tracking-[0.2em]">
				INITIALIZING LAB...
			</h1>
		</div>
	);
}
