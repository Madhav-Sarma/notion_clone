'use client'
import * as Y from 'yjs';
import { FormEvent, useState, useTransition } from 'react';
import { LanguagesIcon } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

type Language =
    | "hindi"
    | "english"
    | "french"
    | "german"
    | "spanish"
    | "italian"
    | "portuguese";

const languages: Language[] = [
    "hindi",
    "english",
    "french",
    "german",
    "spanish",
    "italian",
    "portuguese",
];



function extractPlainText(fragment: Y.XmlFragment): string {
    let text = "";
    for (const child of fragment.toArray()) {
        if (child instanceof Y.XmlText) {
            text += child.toString() + "\n";
        } else if (child instanceof Y.XmlElement) {
            text += extractPlainText(child as Y.XmlFragment);
        }
    }
    return text.trim();
}



function TranslateDoc({ doc }: { doc: Y.Doc }) {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState("");
    const [summary, setSummary] = useState("");
    const [question, setQuestion] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const handleQuestion = async (e: FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const fragment = doc.getXmlFragment("document-store");
            const plainText = extractPlainText(fragment);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ documentData: plainText, targetLang: language })

                }
            );

            if (res.ok) {
                const { translated_text } = await res.json();
                setSummary(translated_text);
                toast.success("Document translated successfully");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger>
                    <LanguagesIcon className="mr-2 h-4 w-4" />
                    Translate
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate Document</DialogTitle>
                    <DialogDescription>
                        Select a language to translate the document summary into.
                    </DialogDescription>
                    <hr className="mt-5" />
                    {question && <p className='mt-5 text-gray-500'>Q : {question}</p>}
                </DialogHeader>

                {summary && <p className='mt-5 text-gray-500'>A : {summary}</p>}


                <form className="flex gap-2 items-center" onSubmit={handleQuestion}>
                    <Select
                        value={language}
                        onValueChange={(value) => setLanguage(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button type="submit" disabled={!language || isPending}>
                        {isPending ? "Translating..." : "Translate"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default TranslateDoc;
