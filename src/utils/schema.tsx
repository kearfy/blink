import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";

export const EDITOR_SCHEMA = BlockNoteSchema.create({
	blockSpecs: {
		...defaultBlockSpecs,
	},
});
