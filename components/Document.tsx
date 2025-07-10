'use client';
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input"
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DelDoc from "./DeleteDoc";

function Document({ id }: { id: string }) {
    const [data, ,] = useDocumentData(doc(db, 'documents', id));
    const [input, setInput] = useState('');
    const [isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();
    useEffect(() => {

        if (data) {
            setInput(data.title);
        }
    }, [data])

    const updateTitle = (e: FormEvent) => {
        e.preventDefault();

        if (input.trim()) {
            startTransition(async () => {
                await updateDoc(doc(db, 'documents', id), { title: input });
            })
        }
    }

    return (
        <div>
            <div className="flex max-w-6xl mx-auto justify-between pb-5">
                <form className="flex flex-1 items-center gap-2" onSubmit={updateTitle}>
                    {/*Title Update*/}
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button disabled={isUpdating} type="submit">
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>

                    {/* check isOwner */}
                    {isOwner && (
                        <>
                            {/* invite user or delete doc */}

                            {/* Delete Doc */}
                            <DelDoc/>
                        </>
                    )}

                    {/*CRUD isOwner, invite,DeleteDoc */}
                </form>
            </div>
            <div>
                {/*Manage Users*/}

                {/* Avatar */}
            </div>
            <hr className="pb-10" />
            {/* Collabarative Error*/}
            <Editor title={data?.title} />
        </div>
    )
}
export default Document