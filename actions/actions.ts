"use server";

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { doc } from "firebase/firestore";

export async function createNewDocument() {
    (await auth).protect();
    const { sessionClaims } = await auth();

    console.log('hi',sessionClaims);
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