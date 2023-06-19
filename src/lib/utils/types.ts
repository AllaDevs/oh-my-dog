export type ResolveTypes<T> = {
    [K in keyof T]: T[K];
} & {};

// export type FirstArg<T extends (...args: any[]) => unknown,FirstArg = Parameters<T>[0], K extends keyof FirstArg | undefined = undefined> = K extends undefined ? FirstArg : FirstArg extends Record<string, unknown>? FirstArg[K]: never;
export type FirstArg<T, K = undefined> = T extends (...args: infer Args) => unknown
    ? Args extends [infer Arg1, ...unknown[]]
    ? Arg1 extends Record<string, unknown>
    ? K extends keyof Arg1
    ? ResolveTypes<Arg1[K]>
    : ResolveTypes<Arg1>
    : never
    : never
    : never;

export type PathType<T, K extends any[]> = K extends [infer First, ...infer Rest]
    ? First extends keyof T
    ? Rest extends []
    ? T[First]
    : PathType<T[First], Rest>
    : never
    : never;

export type SuccessOf<T extends { success: boolean; } & Record<string, unknown>> = T extends { success: true; } & Record<string, unknown> ? T : never;
