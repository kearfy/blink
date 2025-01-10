import { Box, Divider, Group } from "@mantine/core";
import { Route, Switch } from "wouter";
import { Content } from "../Content";
import { Sidebar } from "../Sidebar";

export function Layout() {
	return (
		<Group
			h="100vh"
			align="stretch"
			gap={0}
		>
			<Box w={300}>
				<Sidebar />
			</Box>
			<Divider
				orientation="vertical"
				my="xl"
			/>
			<Box flex={1}>
				<Switch>
					<Route path="/inkling/:id">
						{(params) => <Content id={params.id} />}
					</Route>
				</Switch>
			</Box>
		</Group>
	);
}
