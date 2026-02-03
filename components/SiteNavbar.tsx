import Link from "next/link";
import { Building2 } from "lucide-react";

export default function SiteNavbar() {
    return (
        <nav className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
            <Link href="/" className="flex items-center gap-2 font-bold text-blue-600">
                <Building2 size={24} />
                <span>Civnet</span>
            </Link>
            <div className="flex gap-6 text-sm font-medium">
                <Link href="/dashboard/citizen" className="hover:text-blue-600">My Reports</Link>
                <Link href="/report" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    New Report
                </Link>
            </div>
        </nav>
    );
}
