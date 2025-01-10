import { Center, Image, Stack, Transition } from "@mantine/core";
import { Loader } from "@mantine/core";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import logoImg from "~/assets/logo.svg";
import { useMigrations } from "~/components/Providers/migrations";
import { useSurreal } from "~/components/Providers/surreal";

export function LoadingScreen({
	children,
}: {
	children: ReactNode;
}) {
	const [show, setShow] = useState<boolean | number>(true);

	const { isSuccess: isSurrealReady } = useSurreal();
	const { isSuccess: isMigrationsReady } = useMigrations();
	const isReady = useMemo(
		() => isSurrealReady && isMigrationsReady,
		[isSurrealReady, isMigrationsReady],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Specifying the show dependency would cause an infinite loop
	useEffect(() => {
		if (typeof show === "number") {
			clearTimeout(show);
		}

		if (isReady) {
			const interval = setTimeout(() => {
				setShow(false);
			}, 250);

			setShow(interval as unknown as number);
		} else {
			setShow(true);
		}
	}, [isReady]);

	return (
		<>
			<Transition
				transition={"fade"}
				duration={250}
				mounted={show !== false}
			>
				{(style) => (
					<Center
						pos="fixed"
						top={0}
						left={0}
						w="100%"
						h="100%"
						style={{
							...style,
							zIndex: 100,
						}}
						bg="white"
					>
						<Stack gap="xl">
							<Image
								src={logoImg}
								alt="Logo"
								w={400}
								maw="80%"
							/>
							<Center>
								<Loader
									size="md"
									mr="sm"
									type="dots"
									mt={3}
								/>
							</Center>
						</Stack>
					</Center>
				)}
			</Transition>
			{isReady && children}
		</>
	);
}
