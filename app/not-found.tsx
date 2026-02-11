import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex flex-col justify-center items-center gap-4 h-screen text-center">
			<div className="text-5xl">Page not found.</div>
			<Link href="/" className="text-amber-400 text-3xl underline">
				Go back to home!
			</Link>
		</main>
	);
}
