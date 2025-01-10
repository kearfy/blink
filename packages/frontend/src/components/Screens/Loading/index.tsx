import { Center, Image, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { useSurreal } from "~/components/Providers/surreal";
import logoImg from "~/assets/logo.svg";
import { Group } from "@mantine/core";
import { Loader } from '@mantine/core';

export function LoadingScreen({
    children
}: {
    children: ReactNode;
}) {
    const { isSuccess: isSurrealReady } = useSurreal();

    if (!isSurrealReady) {
        return (
            <Center h="100vh">
                <Stack gap="xl">
                    <Image
                        src={logoImg}
                        alt="Logo"
                        w={400}
                        maw="80%"
                    />
                    <Group justify="center" gap="md">
                        <Text fz={23}>
                            Loading
                        </Text>
                        <Loader size="md" mr="sm" type="dots" mt={3} />
                    </Group>
                </Stack>
            </Center>
        );
    }

    return children;
}