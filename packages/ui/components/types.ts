export type PropsWithSkeleton<P = unknown> = ({ loading: true } & Partial<P>) | ({ loading?: false } & P)
