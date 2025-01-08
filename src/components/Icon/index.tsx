import { Box, BoxProps } from "@mantine/core";
import { LucideProps } from "lucide-react";
import { FC } from "react"

const ICON_SIZES: Record<string, number> = {
	xs: 14,
	sm: 18,
	md: 24,
	lg: 28,
	xl: 32,
};

export interface IconProps extends BoxProps {
	icon: FC<LucideProps>;
	size?: string | number;
}

export function Icon({ icon: Icon, size, ...other }: IconProps) {
	return (
		<Box {...other}>
			<Icon size={(size && ICON_SIZES[size]) || size} />
		</Box>
	)
}