import {
	ActionIcon,
	Box,
	Group,
	Image,
	ScrollArea,
	Stack,
	Text,
} from "@mantine/core";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import logoImg from "~/assets/logo.svg";
import { type Page, usePages } from "~/queries/page";
import { Inkling } from "../Inkling";

export function Sidebar() {
	const pages = usePages({ filter: { parent: undefined } });
	const [favorites, inklings] = useMemo((): [Page[], Page[]] => {
		if (!pages.data) return [[], []];

		return pages.data.reduce<[Page[], Page[]]>(
			([fav, ink], cur) => {
				if (cur.favorite) {
					fav.push(cur);
				} else {
					ink.push(cur);
				}

				return [fav, ink];
			},
			[[], []],
		);
	}, [pages.data]);

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
				<Stack
					gap="xs"
					p="xl"
				>
					<Image
						src={logoImg}
						alt="Logo"
					/>

					<Text
						mt="xl"
						fz="xl"
						fw={600}
						c="dark.7"
					>
						Favorites
					</Text>
					{favorites.map((page) => (
						<Inkling key={page.id.toString()}>{page.title}</Inkling>
					))}

					<Group mt="xl">
						<Text
							fz="xl"
							fw={600}
							c="dark.7"
							flex={1}
						>
							Inklings
						</Text>
						<ActionIcon
							variant="subtle"
							color="dark.5"
						>
							<PlusIcon size={18} />
						</ActionIcon>
					</Group>
					{inklings.map((page) => (
						<Inkling key={page.id.toString()}>{page.title}</Inkling>
					))}
				</Stack>
			</ScrollArea>
		</Box>
	);
}
