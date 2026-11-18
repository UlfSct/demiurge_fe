<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown.ts'

interface IProps {
  source: string
  title?: string
  emptyText?: string
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  emptyText: 'Статья пока не заполнена',
})

const html = computed(() => renderMarkdown(props.source))
</script>

<template>
  <v-card class="default-card pa-6 w-100">
    <v-card-title
      v-if="props.title"
      class="card-title card-title--no-margins card-title--small mb-3 text-wrap text-break"
    >
      {{ props.title }}
    </v-card-title>
    <div v-if="html" class="markdown-body" v-html="html" />
    <p v-else class="text-body-1">{{ props.emptyText }}</p>
  </v-card>
</template>

<style scoped lang="scss">
.markdown-body {
  color: var(--color-text-primary);
  font-family: var(--font-primary), serif;
  font-size: calc(var(--font-size-body) + 1px);
  line-height: 1.75;
  overflow-wrap: anywhere;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    color: var(--color-text-gold);
    font-weight: bold;
    letter-spacing: var(--letter-spacing-normal);
    line-height: 1.3;
    text-shadow: 0 0 12px rgba(var(--gold-accent-rgb), 0.25);
  }

  :deep(h1) {
    margin: 0 0 var(--spacing-md);
    font-size: 28px;
  }

  :deep(h2) {
    margin: var(--spacing-lg) 0 var(--spacing-md);
    padding-bottom: var(--spacing-xs);
    border-bottom: 1px solid var(--color-border);
    font-size: 23px;
  }

  :deep(h3) {
    margin: var(--spacing-md) 0 var(--spacing-sm);
    font-size: 19px;
  }

  :deep(h4) {
    margin: var(--spacing-md) 0 var(--spacing-sm);
    font-size: 16px;
    letter-spacing: var(--letter-spacing-tight);
  }

  :deep(p) {
    margin: 0 0 var(--spacing-md);
  }

  :deep(a) {
    color: var(--gold-light);
    text-decoration: underline;
    text-decoration-color: rgba(var(--gold-accent-rgb), 0.5);
    text-underline-offset: 3px;
    transition: all 0.2s;

    &:hover {
      color: var(--color-text-gold);
      text-decoration-color: var(--gold-accent);
      text-shadow: var(--text-glow-link-hover);
    }
  }

  :deep(strong) {
    color: var(--gold-light);
  }

  :deep(em) {
    color: var(--text-light);
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--spacing-md);
    padding-left: 24px;
  }

  :deep(li) {
    margin-bottom: var(--spacing-xs);

    &::marker {
      color: var(--gold-accent);
    }
  }

  :deep(blockquote) {
    margin: var(--spacing-md) 0;
    padding: var(--spacing-sm) var(--spacing-md);
    border-left: 3px solid var(--gold-accent);
    background: var(--gradient-panel);
    color: var(--color-text-primary);
    font-style: italic;
  }

  :deep(code) {
    padding: 2px 6px;
    border: 1px solid var(--color-border);
    background: rgba(0, 0, 0, 0.35);
    color: var(--gold-light);
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    margin: var(--spacing-md) 0;
    padding: var(--spacing-md);
    overflow-x: auto;
    border: 1px solid var(--color-border);
    background: var(--color-bg-tertiary);
    box-shadow: var(--shadow-input);
  }

  :deep(pre code) {
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text-light);
  }

  :deep(table) {
    display: block;
    width: 100%;
    margin: var(--spacing-md) 0;
    overflow-x: auto;
    border-collapse: collapse;
  }

  :deep(th),
  :deep(td) {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--color-border);
    text-align: left;
    vertical-align: top;
  }

  :deep(th) {
    background: rgba(var(--gold-accent-rgb), 0.08);
    color: var(--color-text-gold);
  }

  :deep(tr:nth-child(even) td) {
    background: rgba(255, 255, 255, 0.02);
  }

  :deep(img) {
    display: block;
    max-width: 100%;
    height: auto;
    margin: var(--spacing-md) auto;
    border: 1px solid var(--color-border-focus);
    box-shadow: var(--shadow-gold-glow);
  }

  :deep(hr) {
    height: 1px;
    margin: var(--spacing-lg) 0;
    border: 0;
    background: var(--gradient-gold);
    opacity: 0.6;
  }

  :deep(del) {
    color: var(--color-text-muted);
  }

  @media (max-width: 600px) {
    :deep(h1) {
      font-size: 23px;
    }

    :deep(h2) {
      font-size: 20px;
    }

    :deep(h3) {
      font-size: 17px;
    }
  }
}
</style>
