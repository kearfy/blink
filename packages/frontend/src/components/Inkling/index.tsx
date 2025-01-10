import classes from "./style.module.scss";

import {
	ActionIcon,
	Button,
	type ButtonProps,
	type ElementProps,
	Menu,
	Text,
} from "@mantine/core";

import {
	EllipsisVertical,
	FileTextIcon,
	Link,
	PlusIcon,
	Star,
	StarOff,
	X,
} from "lucide-react";

import { useClipboard } from "@mantine/hooks";
import type { PropsWithChildren } from "react";
import type { RecordId } from "surrealdb";
import { useLocation, useRoute } from "wouter";
import { useCreatePage, useDeletePage, useUpdatePage } from "~/queries/page";
import { Icon } from "../Icon";

export interface InklingProps
	extends ButtonProps,
		ElementProps<"button", "color"> {
	favorite?: boolean;
	pageId: RecordId<"page">;
}

export function Inkling({
	favorite,
	children,
	pageId,
	...other
}: PropsWithChildren<InklingProps>) {
	const [_, navigate] = useLocation();
	const { mutateAsync: createPage } = useCreatePage();
	const { mutateAsync: deletePage } = useDeletePage();
	const { mutateAsync: updatePage } = useUpdatePage(pageId.id as string);
	const clipboard = useClipboard();

	const path = `/inkling/${pageId.id}`;
	const [active] = useRoute(path);

	return (
		<Button
			fullWidth
			variant={active ? undefined : "subtle"}
			color={active ? "gray.2" : "dark.0"}
			className={classes.root}
			c="black"
			miw={0}
			styles={{ label: { flex: 1 } }}
			pr={4}
			leftSection={
				<Icon
					icon={FileTextIcon}
					size="sm"
					c="dark.9"
				/>
			}
			rightSection={
				<>
					<ActionIcon
						variant="subtle"
						color="dark.5"
						className={classes.action}
						component="div"
						onClick={() =>
							createPage({ parent: pageId }).then(
								(page) => page && navigate(`/inkling/${page.id.id}`),
							)
						}
					>
						<PlusIcon size={18} />
					</ActionIcon>
					<Menu position="right-start">
						<Menu.Target>
							<ActionIcon
								variant="subtle"
								className={classes.action}
								component="div"
							>
								<Icon
									icon={EllipsisVertical}
									size="sm"
								/>
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown w={225}>
							{favorite ? (
								<Menu.Item
									leftSection={
										<Icon
											icon={StarOff}
											size="sm"
										/>
									}
									onClick={() =>
										updatePage({
											favorite: false,
										})
									}
								>
									Remove from favorites
								</Menu.Item>
							) : (
								<Menu.Item
									leftSection={
										<Icon
											icon={Star}
											size="sm"
										/>
									}
									onClick={() =>
										updatePage({
											favorite: true,
										})
									}
								>
									Save to favorites
								</Menu.Item>
							)}
							<Menu.Item
								leftSection={
									<Icon
										icon={Link}
										size="sm"
									/>
								}
								onClick={() => {
									const url = `${window.location.origin}${path}`;
									clipboard.copy(url);
								}}
							>
								Copy link to clipboard
							</Menu.Item>
							<Menu.Divider />
							<Menu.Item
								color="red"
								leftSection={
									<Icon
										icon={X}
										size="sm"
									/>
								}
								onClick={() => {
									deletePage(pageId).then(() => {
										if (active) {
											navigate("/");
										}
									});
								}}
							>
								Remove inkling
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</>
			}
			{...other}
		>
			<Text truncate>{children}</Text>
		</Button>
	);
}
