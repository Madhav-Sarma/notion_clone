"use client"

import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import {  usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";

function SidebarOptions({ href, id }: {
    href: string;
    id: string;
}) {
    const [data, , ] = useDocumentData(doc(db, "documents", id));
    const pathName = usePathname();
    const isActive = href.includes(pathName) && pathName !== '/';

    if (!data) return null;

    return (
        <Link href={href} className={`relative border-r-4 border-transparent hover:bg-zinc-800 hover:text-white group flex items-center gap-x-3 rounded-md px-2 py-2 text-sm font-semibold leading-6 text-zinc-400 ${isActive ? 'border-black bg-zinc-800 text-white' : 'border-transparent'}`}>
                <p className="truncate">{data.title}</p>
        </Link>
    )
}
export default SidebarOptions