export type EmptyObject = Record<string, never>

export type FileObject = {
  name: string
  url: string
}

export type FileDetail = {
  id: number
  file: FileObject
  help_text: string | null
  is_image: boolean
}

export type WorldArticle = {
  id: number
  title: string
  article_text: string
  is_visible: boolean
}

export type SelectorItem<T> = {
  text: string
  value: T
}
export type NumberSelectorItem = SelectorItem<number>
export type StringSelectorItem = SelectorItem<string>
