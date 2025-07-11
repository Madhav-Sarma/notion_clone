'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from "react"
import { Button } from "./ui/button"

import { removeUserFromDoc } from "@/actions/actions"

import { useUser } from "@clerk/nextjs"
import { useRoom } from "@liveblocks/react"
import useOwner from "@/lib/useOwner"
import { useCollection } from "react-firebase-hooks/firestore"
import { collectionGroup, query, where } from "firebase/firestore"
import { db } from "@/firebase"

function ManageUsers() {
    const { user } = useUser();
    const room = useRoom();
    const isOwner = useOwner();
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [usersInRoom] = useCollection(
        user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
    )


    const handleDelete = (userId: string) => {
        startTransition(async () => {
            if(!user) return;
            await removeUserFromDoc({roomId:room.id,email:userId})
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger >Users ({usersInRoom?.docs.length})</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>User to Collaborate</DialogTitle>
                    <DialogDescription>
                        List of users who have access to the document.
                    </DialogDescription>

                    <hr className="my-2" />
                    <div className="flex flex-col space-y-2">
                        {/* Users In Room */}
                        {usersInRoom?.docs.map((doc) => (
                            <div key={doc.data().userId} className="flex items-center justify-between">
                                <p className="font-light">
                                    {doc.data().userId === user?.emailAddresses[0].toString() ? `You (${doc.data().userId})` : doc.data().userId}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline">{doc.data().role}</Button>
                                    {
                                        isOwner &&
                                        doc.data().userId !== user?.emailAddresses[0].toString() && (
                                            <Button variant="destructive" onClick={() => handleDelete(doc.data().userId)} disabled={isPending} size="sm">{isPending ? "Removing.." : "X"}</Button>
                                        )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
export default ManageUsers