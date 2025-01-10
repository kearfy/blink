import type { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Box, Center, ScrollArea, Textarea, Title, rem } from "@mantine/core";
import { type KeyboardEvent, useCallback, useEffect, useState } from "react";
import { type Page, usePage, useUpdatePage } from "~/queries/page";
import { Loading } from "../Loading";

export function Content({ id }: { id: string }) {
	const { data: page, isPending, isRefetching } = usePage(id);

	return (
		<Box
			pos="relative"
			h="100%"
		>
			<Loading
				isReady={!isPending && !isRefetching}
				logo={false}
			>
				{page ? (
					<ContentEditor page={page} />
				) : (
					<Center h="100%">
						<Title order={1}>Inkling not found</Title>
					</Center>
				)}
			</Loading>
		</Box>
	);
}

export function ContentEditor({ page }: { page: Page }) {
	const editor = useCreateBlockNote({
		// initialContent:
		// 	page.content.length > 0 ? (page.content as PartialBlock[]) : undefined,
	});

	const { mutateAsync: updatePage } = useUpdatePage(page.id.id as string);

	const [title, setTitle] = useState(page.title);

	useEffect(() => {
		if (title.length > 0 && title !== page.title) {
			updatePage({
				title,
			});
		}
	}, [page?.title, title, updatePage]);

	// useEffect(() => {
	// 	updatePage({
	// 		content: editor.document,
	// 	});
	// }, [editor.document, updatePage]);

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
							value={title}
							onChange={(e) => setTitle(e.currentTarget.value)}
							placeholder="New Inkling"
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
			</ScrollArea>
		</Box>
	);
}
