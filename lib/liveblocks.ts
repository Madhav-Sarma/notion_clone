import { Liveblocks } from "@liveblocks/node"


const key = process.env.LIVEBLOCKS_PRIVATE_KEY;
if (!key) throw new Error('Missing LIVEBLOCKS_PRIVATE_KEY environment variable')

export const liveblocks = new Liveblocks({ secret: key })