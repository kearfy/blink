import { Box, Divider, Group } from "@mantine/core";
import { Content } from "../Content";
import { Sidebar } from "../Sidebar";

export function Layout() {
	return (
		<Group
			p="xl"
			h="100vh"
			align="stretch"
		>
			<Box w={250}>
				<Sidebar />
			</Box>
			<Divider orientation="vertical" />
			<Box flex={1}>
				<Content />
			</Box>
		</Group>
	);
}
