"use server";

import { adminDb } from "@/firebase-admin";
import { liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { doc } from "firebase/firestore";

export async function createNewDocument() {
    (await auth).protect();
    const { sessionClaims } = await auth();

    console.log('hi', sessionClaims);
    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Document",
    });
    await adminDb
        .collection("users")
        .doc(sessionClaims?.email!)
        .collection('rooms')
        .doc(docRef.id)
        .set({
            userId: sessionClaims?.email!,
            role: "owner",
            roomId: docRef.id,
            createdAt: new Date(),
        });
    return { docId: docRef.id };
}
export async function deleteDocu(roomId: string) {
    auth.protect();

    try {
        //delete the document reference itself
        await adminDb.collection("documents").doc(roomId).delete();
        const query = await adminDb
            .collectionGroup("rooms")
            .where("roomId", "==", roomId)
            .get();
        const batch = adminDb.batch();
        //delete the room reference in the user;s collection for every user in the room
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        })
        await batch.commit();
        await liveblocks.deleteRoom(roomId);
        return { success: true }
    } catch (e) {
        console.error(e);
        return { success: false }
    }
}