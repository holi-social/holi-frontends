export type Mutable<T> = { -readonly [P in keyof T]: T[P] }
export type MutableMock<T> = Mutable<jest.Mocked<T>>
