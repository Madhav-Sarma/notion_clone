"use server";

import { adminDb } from "@/firebase-admin";
import { liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

/**
 * Create a new document and register the creator as the owner
 */
export async function createNewDocument() {
  const { sessionClaims } = await auth();
  const email = sessionClaims?.email;
  if (!email) return { success: false, error: "No email in session" };

  const docRef = await adminDb.collection("documents").add({
    title: "New Document",
    owner: email,
    createdAt: new Date(),
  });

  await adminDb
    .collection("users")
    .doc(email)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: email,
      role: "owner",
      roomId: docRef.id,
      createdAt: new Date(),
    });

  return { success: true, docId: docRef.id };
}

/**
 * Delete a document and all user references to it
 */
export async function deleteDocu(roomId: string) {
  try {
    await adminDb.collection("documents").doc(roomId).delete();

    const userRefs = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();
    userRefs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error("DeleteDocu error:", error);
    return { success: false };
  }
}

/**
 * Invite a user to collaborate in a room
 */
export async function inviteUserToDocu(roomId: string, email: string) {
  try {
    const docSnap = await adminDb.collection("documents").doc(roomId).get();

    if (!docSnap.exists) {
      return { success: false, error: "Room does not exist" };
    }

    const docData = docSnap.data();
    if (docData?.owner === email) {
      return { success: false, isOwner: true };
    }

    const collabRef = adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId);

    const collabSnap = await collabRef.get();
    if (collabSnap.exists) {
      return { success: false, isCollaborator: true };
    }

    await collabRef.set({
      userId: email,
      role: "Collaborator",
      roomId,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Invite error:", error);
    return { success: false };
  }
}

/**
 * Remove a user from a document's collaborator list
 */
export async function removeUserFromDoc({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) {
  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error("Remove user error:", error);
    return { success: false };
  }
}
