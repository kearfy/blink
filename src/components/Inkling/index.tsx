import { Button, type ButtonProps, type ElementProps } from "@mantine/core";
import type { PropsWithChildren } from "react";

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
			variant={active ? undefined : "subtle"}
			color={active ? "gray.2" : "dark.0"}
			c="black"
			styles={{ label: { flex: 1 } }}
			{...other}
		>
			{children}
		</Button>
	);
}
