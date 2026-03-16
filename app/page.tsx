import Button from "@/components/ui/Button";
import Link from "@/components/ui/Link";

export default function HomePage() {
	return (
		<main>
			{/* LINKS */}
			<div className="flex gap-2 p-2">
				<Link href="/lab" size="large" variant="button" color="primary">
					Go to Lab
				</Link>
				<Link href="/lab" size="large" variant="outline" color="primary">
					Go to Lab
				</Link>
				<Link href="/lab" size="large" variant="link" color="primary">
					Go to Lab
				</Link>
			</div>
			<div className="flex gap-2 p-2">
				<Link href="/lab" size="medium" variant="button" color="secondary">
					Go to Lab
				</Link>
				<Link href="/lab" size="medium" variant="outline" color="secondary">
					Go to Lab
				</Link>
				<Link href="/lab" size="medium" variant="link" color="secondary">
					Go to Lab
				</Link>
			</div>
			<div className="flex gap-2 p-2">
				<Link href="/lab" size="small" variant="button" color="danger">
					Go to Lab
				</Link>
				<Link href="/lab" size="small" variant="outline" color="danger">
					Go to Lab
				</Link>
				<Link href="/lab" size="small" variant="link" color="danger">
					Go to Lab
				</Link>
			</div>
			{/* LINKS */}

			{/* BUTTONS */}
			<div className="flex gap-2 p-2">
				<Button size="large" variant="outline" color="primary">
					Go to Lab
				</Button>
				<Button size="large" variant="filled" color="secondary">
					Go to Lab
				</Button>
				<Button size="large" variant="outline" color="danger">
					Go to Lab
				</Button>
			</div>
			<div className="flex gap-2 p-2">
				<Button size="medium" variant="filled" color="primary">
					Go to Lab
				</Button>
				<Button size="medium" variant="outline" color="secondary">
					Go to Lab
				</Button>
				<Button size="medium" variant="filled" color="danger">
					Go to Lab
				</Button>
			</div>
			<div className="flex gap-2 p-2">
				<Button size="small" variant="filled" color="primary">
					Go to Lab
				</Button>
				<Button size="small" variant="outline" color="secondary">
					Go to Lab
				</Button>
				<Button size="small" variant="outline" color="danger">
					Go to Lab
				</Button>
			</div>
			{/* Buttons */}
		</main>
	);
}
