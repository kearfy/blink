import classes from "./style.module.scss";

import {
	ActionIcon,
	Box,
	Button,
	type ButtonProps,
	Collapse,
	type ElementProps,
	Loader,
	Menu,
	Stack,
	Text,
} from "@mantine/core";

import {
	ChevronDown,
	ChevronRight,
	EllipsisVertical,
	FileTextIcon,
	Link as LinkIcon,
	PlusIcon,
	Star,
	StarOff,
	X,
} from "lucide-react";

import { useClipboard } from "@mantine/hooks";
import { useState } from "react";
import { Link, useLocation, useRoute } from "wouter";

import {
	type Page,
	useCreatePage,
	useDeletePage,
	usePages,
	useUpdatePage,
} from "~/queries/page";

import { Icon } from "../Icon";

export interface InklingProps
	extends ButtonProps,
		ElementProps<"button", "color"> {
	favorite?: boolean;
	page: Page;
}

export function Inkling({ favorite, children, page, ...other }: InklingProps) {
	const [_, navigate] = useLocation();
	const { mutateAsync: createPage } = useCreatePage();
	const { mutateAsync: deletePage } = useDeletePage();
	const { mutateAsync: updatePage } = useUpdatePage(page.id.id as string);
	const clipboard = useClipboard();

	const path = `/inkling/${page.id}`;
	const [active] = useRoute(path);
	const [expanded, setExpanded] = useState(false);

	const {
		data: childPages,
		isSuccess,
		isFetching,
	} = usePages({
		filter: { parent: page.id },
		enabled: expanded,
	});

	return (
		<Box>
			<Button
				fullWidth
				variant={active ? undefined : "subtle"}
				color={active ? "gray.2" : "dark.0"}
				className={classes.root}
				c="black"
				miw={0}
				styles={{ label: { flex: 1 } }}
				px={4}
				leftSection={
					<>
						<ActionIcon
							variant="subtle"
							color="dark.5"
							className={classes.expander}
							component="div"
							loading={isFetching}
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setExpanded(!expanded);
							}}
						>
							<Icon
								icon={expanded ? ChevronDown : ChevronRight}
								size="sm"
							/>
						</ActionIcon>
						<Icon
							icon={FileTextIcon}
							className={classes.icon}
							size="sm"
							c="dark.9"
							px={5}
						/>
					</>
				}
				rightSection={
					<>
						<ActionIcon
							variant="subtle"
							color="dark.5"
							className={classes.action}
							component="div"
							onClick={() =>
								createPage({ parent: page.id }).then(
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
											icon={LinkIcon}
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
										deletePage(page.id).then(() => {
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
				<Text truncate>{page.title || "New Inkling"}</Text>
			</Button>
			<Collapse in={expanded && isSuccess}>
				{(childPages?.length || 0) > 0 ? (
					<Stack pl="xl">
						{childPages?.map((child) => (
							<Link
								key={child.id.id.toString()}
								href={`/inkling/${child.id.id}`}
								style={{
									width: "100%",
									display: "block",
									textDecoration: "none",
								}}
							>
								<Inkling
									page={child}
									favorite={child.favorite}
								>
									{child.title || "New Inkling"}
								</Inkling>
							</Link>
						))}
					</Stack>
				) : (
					<Text
						c="grey"
						pl="xl"
					>
						No pages here
					</Text>
				)}
			</Collapse>
		</Box>
	);
}
