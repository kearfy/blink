import { Surreal } from "surrealdb";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useCallback, useState } from "react";

interface SurrealProviderProps {
	children: React.ReactNode;
	/** The database endpoint URL */
	endpoint: string;
	/** Optional existing Surreal client */
	client?: Surreal;
	/* Optional connection parameters */
	params?: Parameters<Surreal["connect"]>[1];
	/** Auto connect on component mount, defaults to true */
	autoConnect?: boolean;
}

interface SurrealProviderState {
	/** The Surreal instance */
	client: Surreal;
	/** Whether the connection is pending */
	isConnecting: boolean;
	/** Whether the connection was successfully established */
	isSuccess: boolean;
	/** Whether the connection rejected in an error */
	isError: boolean;
	/** The connection error, if present */
	error: unknown;
	/** Connect to the Surreal instance */
	connect: () => Promise<true>;
	/** Close the Surreal instance */
	close: () => Promise<true>;
}

const SurrealContext = createContext<SurrealProviderState | undefined>(undefined);

export function SurrealProvider({
	children,
	client,
	endpoint,
	params,
	autoConnect = true,
}: SurrealProviderProps) {
	// Surreal instance remains stable across re-renders
	const [surrealInstance] = useState(() => client ?? new Surreal());

	// React Query mutation for connecting to Surreal
	const {
		mutateAsync: connectMutation,
		isPending,
		isSuccess,
		isError,
		error,
		reset,
	} = useMutation({
		mutationFn: () => surrealInstance.connect(endpoint, params),
	});

	// Wrap mutateAsync in a stable callback
	const connect = useCallback(() => connectMutation(), [connectMutation]);

	// Wrap close() in a stable callback
	const close = useCallback(() => surrealInstance.close(), [surrealInstance]);

	// Auto-connect on mount (if enabled) and cleanup on unmount
	useEffect(() => {
		if (autoConnect) {
			connect();
		}

		return () => {
			reset();
			surrealInstance.close();
		};
	}, [autoConnect, connect, reset, surrealInstance]);

	// Memoize the context value
	const value: SurrealProviderState = useMemo(
		() => ({
			client: surrealInstance,
			isConnecting: isPending,
			isSuccess,
			isError,
			error,
			connect,
			close,
		}),
		[surrealInstance, isPending, isSuccess, isError, error, connect, close],
	);

	return <SurrealContext.Provider value={value}>{children}</SurrealContext.Provider>;
}

/**
 * Access the Surreal connection state from the context.
 */
export function useSurreal() {
	const context = useContext(SurrealContext);
	if (!context) {
		throw new Error("useSurreal must be used within a SurrealProvider");
	}
	return context;
}

/**
 * Access the Surreal client from the context.
 */
export function useSurrealClient() {
	const { client } = useSurreal();
	return client;
}