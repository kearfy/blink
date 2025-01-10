import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Box, Center, Textarea, rem } from "@mantine/core";
import { type KeyboardEvent, useCallback } from "react";

export function Content() {
	const editor = useCreateBlockNote();

	const handleTitleEnter = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Enter") {
				editor.focus();
			}
		},
		[editor],
	);

	return (
		<Center>
			<Box
				maw={854}
				mih={200}
				flex={1}
				mt={50}
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
				/>
			</Box>
		</Center>
	);
}
