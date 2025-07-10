'use client'

import { MenuIcon } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useCollection } from "react-firebase-hooks/firestore"
import { useUser } from "@clerk/nextjs"
import { collectionGroup, DocumentData, query, where } from "firebase/firestore"
import { db } from "@/firebase"
import { useEffect, useState } from "react"
import SidebarOptions from "./SidebarOptions"

interface RoomDocument extends DocumentData {
    createdAt: string;
    role: "owner" | "collaborator";
    roomId: string;
    userId: string;
}
function Sidebar() {
    const { user } = useUser();

    const [groupedData, setGroupData] = useState<{
        owner: RoomDocument[];
        collaborator: RoomDocument[];
    }>({
        owner: [],
        collaborator: [],
    })
    const [data, , ] = useCollection(
        user && (
            query(collectionGroup(db, 'rooms'),
                where('userId', '==', user.emailAddresses[0].toString()))
        )
    );
    useEffect(() => {
        if (!data) return;
        console.log('hero', data);
        const grouped = data.docs.reduce<{
            owner: RoomDocument[];
            collaborator: RoomDocument[];
        }>(
            (accu, curr) => {
                const data = curr.data() as RoomDocument;
                if (!data) return accu;
                if (data.role === "owner") {
                    accu.owner.push({
                        id: curr.id,
                        ...data
                    });
                } else {
                    accu.collaborator.push({
                        id: curr.id,
                        ...data
                    });
                }
                return accu;
            }, {
            owner: [],
            collaborator: [],
        }
        )

        setGroupData(grouped);
    }, [data])

    const menuOptions = (
        <>
            <NewDocumentButton />
            {/* My documents */}
            <div>
                {groupedData.owner.length === 0 ? (
                    <p className="text-sm text-gray-500">You have no documents</p>
                ) : (
                    <>
                        <h2 className="text-sm text-gray-500">My Documents</h2>
                        {groupedData.owner.map((doc) => (
                            <SidebarOptions key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                        ))}
                    </>
                )}
            </div>
            {/* List.. */}

            {/* shared with me */}
            {groupedData.collaborator.length === 0 ? (
                <p className="text-sm text-gray-500">You have no shared documents</p>
            ) : (
                <>
                    <h2 className="text-sm text-gray-500">Shared with me</h2>
                    {groupedData.collaborator.map((doc) => (
                        <SidebarOptions key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                    ))}
                </>
            )}
        </>
    )
    return (
        <div className="p-2 md:p-5 bg-gray-200 relative">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <div>
                                {menuOptions}
                            </div>
                            <SheetDescription>

                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="hidden md:inline">
                {menuOptions}
            </div>
        </div>
    )
}
export default Sidebar