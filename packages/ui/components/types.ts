export type PropsWithSkeleton<P> = ({ loading: true } & Partial<P>) | ({ loading?: false } & P)
