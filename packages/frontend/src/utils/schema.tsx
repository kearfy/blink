import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { CodeMirrorBlock } from "~/blocks/code";

export const BLOCKNOTE_SCHEMA = BlockNoteSchema.create({
	blockSpecs: {
		...defaultBlockSpecs,

		codeBlock: CodeMirrorBlock,
	},
});
