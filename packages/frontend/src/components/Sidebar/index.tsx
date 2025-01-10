import classes from "./style.module.scss";

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
import { Link, useLocation } from "wouter";
import logoImg from "~/assets/logo.svg";
import { type Page, useCreatePage, usePages } from "~/queries/page";
import { Inkling } from "../Inkling";

export function Sidebar() {
	const [_, navigate] = useLocation();
	const { mutateAsync: createPage } = useCreatePage();
	const pages = usePages({ filter: { parent: undefined } });

	const [favorites, inklings] = useMemo((): [Page[], Page[]] => {
		if (!pages.data) return [[], []];

		const [fav, ink] = pages.data.reduce<[Page[], Page[]]>(
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

		return [
			fav.sort((a, b) => b.updated.getTime() - a.updated.getTime()),
			ink.sort((a, b) => b.updated.getTime() - a.updated.getTime()),
		];
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
				className={classes.scroller}
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
						<Inkling
							key={page.id.toString()}
							favorite={true}
							page={page}
						>
							{page.title || "New Inkling"}
						</Inkling>
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
							onClick={() =>
								createPage({}).then(
									(page) => page && navigate(`/inkling/${page.id.id}`),
								)
							}
						>
							<PlusIcon size={18} />
						</ActionIcon>
					</Group>
					{inklings.map((page) => (
						<Link
							key={page.id.id.toString()}
							href={`/inkling/${page.id.id}`}
							style={{
								width: "100%",
								display: "block",
								textDecoration: "none",
							}}
						>
							<Inkling page={page} />
						</Link>
					))}
				</Stack>
			</ScrollArea>
		</Box>
	);
}
