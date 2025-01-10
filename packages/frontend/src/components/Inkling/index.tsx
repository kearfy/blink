import { Button, type ButtonProps, type ElementProps } from "@mantine/core";
import { FileTextIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Icon } from "../Icon";

export interface InklingProps
	extends ButtonProps,
		ElementProps<"button", "color"> {
	active?: boolean;
}

export function Inkling({
	active,
	children,
	...other
}: PropsWithChildren<InklingProps>) {
	return (
		<Button
			fullWidth
			variant={active ? undefined : "subtle"}
			color={active ? "gray.2" : "dark.0"}
			c="black"
			styles={{ label: { flex: 1 } }}
			leftSection={
				<Icon
					icon={FileTextIcon}
					size="sm"
					c="dark.9"
				/>
			}
			{...other}
		>
			{children}
		</Button>
	);
}
