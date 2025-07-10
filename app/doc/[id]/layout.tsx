import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

export default async function DocLayout({
  children,
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const params = await paramsPromise;
  await auth.protect();

  return <RoomProvider roomId={params.id}>{children}</RoomProvider>;
}
