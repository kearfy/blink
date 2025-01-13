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
import { Link, useLocation } from "wouter";
import logoImg from "~/assets/logo.svg";
import { useCreatePage, usePages } from "~/queries/page";
import { Inkling } from "../Inkling";

export function Sidebar() {
	const [_, navigate] = useLocation();
	const { mutateAsync: createPage } = useCreatePage();
	const favorites = usePages({ filter: { favorite: true } });
	const inklings = usePages({ filter: { parent: undefined } });

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

					{favorites.data && favorites.data.length > 0 && (
						<>
							<Text
								mt="xl"
								fz="xl"
								fw={600}
								c="dark.7"
							>
								Favorites
							</Text>
							{favorites.data?.map((page) => (
								<Link
									key={page.id.id.toString()}
									href={`${import.meta.env.BASE_URL}inkling/${page.id.id}`}
									style={{
										width: "100%",
										display: "block",
										textDecoration: "none",
									}}
								>
									<Inkling
										favorite={true}
										page={page}
									>
										{page.title || "New Inkling"}
									</Inkling>
								</Link>
							))}
						</>
					)}

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
									(page) => page && navigate(`${import.meta.env.BASE_URL}inkling/${page.id.id}`),
								)
							}
						>
							<PlusIcon size={18} />
						</ActionIcon>
					</Group>
					{inklings.data?.map((page) => (
						<Link
							key={page.id.id.toString()}
							href={`${import.meta.env.BASE_URL}inkling/${page.id.id}`}
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
