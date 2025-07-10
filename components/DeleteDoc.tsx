'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from "react"
import { Button } from "./ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import { usePathname, useRouter } from "next/navigation"
import { deleteDocu } from "@/actions/actions"
import { toast } from "sonner"

function DelDoc() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const pathName = usePathname();
    const router = useRouter();
    const handleDelete = async () => {
        const room = pathName.split("/").pop();
        if (!room)  return;
        startTransition(async ()=>{
            const {success} = await deleteDocu(room);

            if(success){
                setIsOpen(false);
                router.replace("/");
                toast.success("Document deleted successfully");
            } else{
                toast.error("Failed to delete the room")
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="destructive">
                <DialogTrigger className="bg-red-500 text-white">Delete</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure you want to Delete?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your document and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default DelDoc