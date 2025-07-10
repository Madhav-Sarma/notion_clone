import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
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

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
  userInfo: {
    name: string;
    email: string;
  };
};

function BlockNote({ doc, provider, darkMode, userInfo }: EditorProps) {
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("documnet-store"),
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

function Editor({ title }: { title: string }) {
  const room = useRoom();
  const userInfo = useSelf((me) => me.info);
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yPRovider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yPRovider);
    return () => {
      yDoc?.destroy();
      yPRovider?.destroy();
    };
  }, [room]);

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
