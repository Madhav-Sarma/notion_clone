'use client'

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMemo } from "react";

function Avatars() {
    const others = useOthers();
    const self = useSelf();

    const all = useMemo(() => [self, ...others], [self, others]);

    return (
        <div className="flex flex-1 gap-2 items-center justify-end">
            <p className="font-light text-sm">Users currently editing this page</p>
            <div className="flex -space-x-5">
                {all.map((other, i) => (
                    <Tooltip key={`${other?.id}-${i}`}>
                        <TooltipTrigger>
                            <Avatar className="border-2 hover:brightness-110">
                                <AvatarImage src={other?.info?.avatar || ""} />
                                <AvatarFallback>
                                    {other?.info?.name?.[0] || "?"}
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{self?.id === other?.id ? "You" : other?.info?.name || "Unknown"}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}

export default Avatars;
