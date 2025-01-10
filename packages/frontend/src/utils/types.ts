export type Entries<T> = Exclude<
	{
		[K in keyof T]: [K, T[K]];
	}[keyof T][],
	undefined
>;
