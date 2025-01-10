import { Center, Image, Loader, Stack, Transition } from "@mantine/core";
import { type ReactNode, useEffect, useState } from "react";
import logoImg from "~/assets/logo.svg";

export function Loading({
	children,
	isReady,
	logo = true,
	minDuration = 250,
}: {
	children: ReactNode;
	isReady: boolean;
	logo?: boolean;
	minDuration?: number;
}) {
	const [show, setShow] = useState<boolean | number>(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Specifying the show dependency would cause an infinite loop
	useEffect(() => {
		if (typeof show === "number") {
			clearTimeout(show);
		}

		if (isReady) {
			const interval = setTimeout(() => {
				setShow(false);
			}, minDuration);

			setShow(interval as unknown as number);
		} else {
			setShow(true);
		}
	}, [isReady]);

	return (
		<>
			<Transition
				transition="fade"
				duration={0}
				exitDuration={250}
				mounted={show !== false}
			>
				{(style) => (
					<Center
						pos="absolute"
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
							{logo && (
								<Image
									src={logoImg}
									alt="Logo"
									w={400}
									maw="80%"
								/>
							)}
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
