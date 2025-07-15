'use client';

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import "@blocknote/shadcn/style.css";
import { stringToColor } from "@/lib/stringToColor";
import TranslateDoc from "./TranslateDoc";
import type { OpaqueRoom } from "@liveblocks/core";

// collaboration setup
function useLiveblocksCollaboration(room: OpaqueRoom) {
  const { doc, provider } = useMemo(() => {
    const doc = new Y.Doc();
    const provider = new LiveblocksYjsProvider(room, doc);
    return { doc, provider };
  }, [room]);

  useEffect(() => {
    return () => {
      provider.disconnect();
    };
  }, [provider]);

  return { doc, provider };
}

function BlockNote({ doc, provider, darkMode, userInfo }: EditorProps) {
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo.name,
        color: stringToColor(userInfo.email),
      },
    },
  });

  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

// main editor
function Editor({ title }: { title: string }) {
  const room = useRoom() as OpaqueRoom;
  const userInfo = useSelf((me) => me.info);
  const { doc, provider } = useLiveblocksCollaboration(room);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const style = `hover:text-white ${
    darkMode
      ? "text-gray-700 bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-100 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        {/* Translate the doc AI*/}
        {doc && <TranslateDoc doc={doc} />}

        {/* CHAT TO Doc with AI */}

        {/* heading */}
        <div className="text-4xl font-bold">{title}</div>

        {/* datk mode */}
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {/* Block Note */}
      {doc && provider && userInfo && (
        <BlockNote
          doc={doc}
          provider={provider}
          darkMode={darkMode}
          userInfo={userInfo}
        />
      )}
    </div>
  );
}

export default Editor;

type EditorProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
  userInfo: {
    name: string;
    email: string;
  };
};