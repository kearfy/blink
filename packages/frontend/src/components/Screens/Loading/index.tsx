import { type ReactNode, useMemo } from "react";
import { Loading } from "~/components/Loading";
import { useMigrations } from "~/components/Providers/migrations";
import { useSurreal } from "~/components/Providers/surreal";

export function LoadingScreen({
	children,
}: {
	children: ReactNode;
}) {
	const { isSuccess: isSurrealReady } = useSurreal();
	const { isSuccess: isMigrationsReady } = useMigrations();
	const isReady = useMemo(
		() => isSurrealReady && isMigrationsReady,
		[isSurrealReady, isMigrationsReady],
	);

	return <Loading isReady={isReady} zIndex={200}>{children}</Loading>;
}
