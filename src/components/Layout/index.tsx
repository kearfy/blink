import { Box, Center, Divider, Group, Title } from "@mantine/core";
import { Route, Switch } from "wouter";
import { Content } from "../Content";
import { Sidebar } from "../Sidebar";
import { usePages } from "~/queries/page";

export function Layout() {
	const { data: pages } = usePages({ filter: { parent: undefined } });
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
					<Route path={`${import.meta.env.BASE_URL}inkling/:id`}>
						{(params) => <Content id={params.id} />}
					</Route>
					<Route>
						<Center h="100%">
							<Title order={1}>
								{pages?.length ? "Open" : "Create"} an Inkling!
							</Title>
						</Center>
					</Route>
				</Switch>
			</Box>
		</Group>
	);
}
