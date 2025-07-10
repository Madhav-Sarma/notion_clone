'use client'

import { useMyPresence } from "@liveblocks/react/suspense";
import { useOthers } from "@liveblocks/react/suspense";
import { PointerEvent } from "react";
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
    const [, setMyPresence] = useMyPresence();
    const others = useOthers();
    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
        const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) }
        setMyPresence({ cursor })
    }
    function handlePointerLeave() {
        setMyPresence({ cursor: null })
    }
    return (
        <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
            {/*render cursors */}
            {children}
            {others
            .filter((other) => other.presence.cursor !== null)
            .map(({ connectionId, presence, info }) => (
                <FollowPointer
                    key={connectionId}
                    info={info}
                    x={presence.cursor!.x}
                    y={presence.cursor!.y}
                />
            ))}

        </div>
    )
}
export default LiveCursorProvider