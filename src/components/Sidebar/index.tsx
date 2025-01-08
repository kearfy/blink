import { ActionIcon, Group, Image, Stack, Text } from "@mantine/core";
import { PlusIcon } from "lucide-react";
import logoImg from "~/assets/logo.svg";
import { Inkling } from "../Inkling";

export function Sidebar() {
	return (
		<Stack gap="xs">
			<Image
				src={logoImg}
				alt="Logo"
			/>

			<Text
				mt="xl"
				fz="xl"
				fw={600}
				c="dark.7"
			>
				Favorites
			</Text>
			<Inkling>Test 1</Inkling>
			<Inkling active>Test 2</Inkling>

			<Group mt="xl">
				<Text
					fz="xl"
					fw={600}
					c="dark.7"
					flex={1}
				>
					Inklings
				</Text>
				<ActionIcon
					variant="subtle"
					color="dark.5"
				>
					<PlusIcon size={18} />
				</ActionIcon>
			</Group>
			<Inkling>Test 1</Inkling>
			<Inkling active>Test 2</Inkling>
			<Inkling>Test 3</Inkling>
			<Inkling>Test 4</Inkling>
		</Stack>
	);
}
