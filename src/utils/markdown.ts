import DOMPurify from 'dompurify'
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
})

const defaultLinkOpen = markdown.renderer.rules.link_open

markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx]?.attrSet('target', '_blank')
  tokens[idx]?.attrSet('rel', 'noopener noreferrer')

  if (defaultLinkOpen) return defaultLinkOpen(tokens, idx, options, env, self)
  return self.renderToken(tokens, idx, options)
}

/**
 * Рендерит Markdown в безопасный HTML: сырой HTML отключён, ссылки открываются в новой вкладке,
 * результат дополнительно очищается DOMPurify. Подходит для статей любых сущностей.
 */
export const renderMarkdown = (source: string): string => {
  const normalizedSource = source.trim()
  if (!normalizedSource) return ''

  return DOMPurify.sanitize(markdown.render(normalizedSource), {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target'],
  })
}
