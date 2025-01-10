import classes from "./style.module.scss";

import {
	ActionIcon,
	Button,
	Menu,
	type ButtonProps,
	type ElementProps,
} from "@mantine/core";

import {
	EllipsisVertical,
	FileTextIcon,
	Link,
	Star,
	StarOff,
	X,
} from "lucide-react";

import type { PropsWithChildren } from "react";
import { Icon } from "../Icon";

export interface InklingProps
	extends ButtonProps,
		ElementProps<"button", "color"> {
	active?: boolean;
	favorite?: boolean;
}

export function Inkling({
	active,
	favorite,
	children,
	...other
}: PropsWithChildren<InklingProps>) {
	return (
		<Button
			fullWidth
			variant={active ? undefined : "subtle"}
			color={active ? "gray.2" : "dark.0"}
			className={classes.root}
			c="black"
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
				<Menu position="right-start">
					<Menu.Target>
						<ActionIcon
							variant="subtle"
							className={classes.action}
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
						>
							Remove inkling
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			}
			{...other}
		>
			{children}
		</Button>
	);
}
