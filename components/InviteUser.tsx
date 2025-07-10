'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FormEvent, useState, useTransition } from "react"
import { Button } from "./ui/button"

import { usePathname, useRouter } from "next/navigation"
import {  inviteUserToDocu } from "@/actions/actions"
import { toast } from "sonner"
import { Input } from "./ui/input"

function InvUser() {
    const [email, setEmail] = useState('');
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const pathName = usePathname();

    const handleInv = async (e: FormEvent) => {
        e.preventDefault()
        const room = pathName.split("/").pop();
        if (!room) return;
        startTransition(async () => {
            const { success } = await inviteUserToDocu(room, email);

            if (success) {
                setIsOpen(false);
                setEmail('');
                toast.success("User Added to Room");
            } else {
                toast.error("Failed to add user the room")
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger >Invite</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a User to Collaborate</DialogTitle>
                    <DialogDescription>
                        Enter the email of the user you want to invite.
                    </DialogDescription>
                </DialogHeader>


                <form className="flex gap-2" onSubmit={handleInv}>
                    <Input
                        type="email"
                        placeholder="Email"
                        className="w-full"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }} />
                    <Button type="submit" disabled={!email || isPending}>
                        {isPending ? "Inviting.." : "Invite"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default InvUser