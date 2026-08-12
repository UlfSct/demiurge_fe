export type EmptyObject = Record<string, never>

export type FileObject = {
  name: string
  url: string
}

export type SelectorItem<T> = {
  text: string
  value: T
}
export type NumberSelectorItem = SelectorItem<number>
export type StringSelectorItem = SelectorItem<string>
