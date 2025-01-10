import { filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import {
	getDefaultReactSlashMenuItems,
	SuggestionMenuController,
	useCreateBlockNote,
} from "@blocknote/react";
import { Box, ScrollArea, Textarea, rem } from "@mantine/core";
import { type KeyboardEvent, useCallback } from "react";
import { insertCodeMirror } from "~/blocks/code";
import { BLOCKNOTE_SCHEMA } from "~/utils/schema";

export function Content() {
	const editor = useCreateBlockNote({
		schema: BLOCKNOTE_SCHEMA,
	});

	const handleTitleEnter = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Enter") {
				editor.focus();
			}
		},
		[editor],
	);

	return (
		<Box
			flex={1}
			h="100%"
			pos="relative"
		>
			<ScrollArea
				pos="absolute"
				inset={0}
			>
				<Box
					w="100%"
					maw={854}
					mih={200}
					flex={1}
					mt={50}
					mx="auto"
					pb={150}
				>
					<Box px={54}>
						<Textarea
							variant="unstyled"
							autosize
							defaultValue="This is my inkling title"
							onKeyDown={handleTitleEnter}
							styles={{
								input: {
									fontSize: rem(48),
									color: "var(--mantine-color-dark-9)",
									fontWeight: 600,
									borderRadius: 0,
									height: rem(52),
								},
							}}
						/>
					</Box>

					<BlockNoteView
						editor={editor}
						theme="light"
						slashMenu={false}
					>
						<SuggestionMenuController
							triggerCharacter={"/"}
							getItems={async (query) =>
								filterSuggestionItems(groupS
									[
										...getDefaultReactSlashMenuItems(editor),
										insertCodeMirror(editor),
									],
									query,
								)
							}
						/>
					</BlockNoteView>
				</Box>
			</ScrollArea>
		</Box>
	);
}
