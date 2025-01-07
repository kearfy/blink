import type { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";

export function useEditor({ initialContent }: { initialContent?: Block[] } = {}) {
    const [blocks, setBlocks] = useState<Block[]>(initialContent ?? []);
	const editor = useCreateBlockNote({
        initialContent
    });

    return { blocks, setBlocks, editor };
}

export default function Editor({ setBlocks, editor }: Pick<ReturnType<typeof useEditor>, 'editor' | 'setBlocks'>) {
	return (
        <BlockNoteView
            editor={editor}
            onChange={() => {
                setBlocks(editor.document);
            }}
        />
	);
}
