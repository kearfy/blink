import { Box, Divider, Group } from "@mantine/core";
import { Content } from "../Content";
import { Sidebar } from "../Sidebar";

export function Layout() {
	return (
		<Group
			h="100vh"
			align="stretch"
			gap={0}
		>
			<Box w={250}>
				<Sidebar />
			</Box>
			<Divider
				orientation="vertical"
				my="xl"
			/>
			<Box flex={1}>
				<Content />
			</Box>
		</Group>
	);
}
