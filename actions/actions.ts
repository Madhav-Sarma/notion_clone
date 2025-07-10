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

export async function inviteUserToDocu(roomId: string, email: string) {
  auth.protect();

  try {
    // 1. Check if the user is the owner of the room
    const roomSnap = await adminDb.collection("documents").doc(roomId).get();

    if (!roomSnap.exists) {
      return { success: false, error: "Room does not exist" };
    }

    const roomData = roomSnap.data();
    if (roomData?.owner === email) {
      return { success: false, isOwner: true };
    }

    // 2. Check if already a collaborator
    const collaboratorDoc = await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .get();

    if (collaboratorDoc.exists) {
      return { success: false, isCollaborator: true };
    }

    // 3. Add as a new collaborator
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "Collaborator",
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function removeUserFromDoc({ roomId, email }: { roomId: string, email: string }) {
    auth.protect();
    try{
      await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();
    return { success: true }
    } catch (e) {
        console.error(e);
        return { success: false };
    }
}