<template>
  <div class="markdown-mermaid q-my-md">
    <div
      v-if="errorMessage"
      class="markdown-mermaid__error"
      role="alert"
    >
      {{ errorMessage }}
    </div>
    <div
      v-else-if="isRendering"
      class="markdown-mermaid__loading"
    >
      Rendering diagram...
    </div>
    <div
      ref="containerRef"
      class="markdown-mermaid__diagram"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { uid, useQuasar } from 'quasar'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  code: string
}>()

const $q = useQuasar()
const containerRef = ref<HTMLElement | null>(null)
const errorMessage = ref('')
const isRendering = ref(false)

let disposed = false
let renderRequest = 0

async function renderDiagram(): Promise<void> {
  if (import.meta.env.QUASAR_CLIENT !== true || containerRef.value === null) {
    return
  }

  const requestId = ++renderRequest

  errorMessage.value = ''
  isRendering.value = true

  await nextTick()

  try {
    const { default: mermaid } = await import('mermaid')

    mermaid.initialize({
      securityLevel: 'strict',
      startOnLoad: false,
      theme: $q.dark.isActive === true ? 'dark' : 'default',
    })

    const { svg, bindFunctions } = await mermaid.render(`markdown-mermaid-${uid()}`, props.code)

    if (disposed === true || requestId !== renderRequest || containerRef.value === null) {
      return
    }

    containerRef.value.innerHTML = svg
    bindFunctions?.(containerRef.value)
  } catch (error) {
    if (disposed === false && requestId === renderRequest) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to render diagram.'
    }
  } finally {
    if (disposed === false && requestId === renderRequest) {
      isRendering.value = false
    }
  }
}

onMounted(() => {
  void renderDiagram()
})

watch(
  () => [props.code, $q.dark.isActive] as const,
  () => {
    void renderDiagram()
  },
)

onBeforeUnmount(() => {
  disposed = true
})
</script>

<style lang="scss">
.markdown-mermaid {
  border: 1px solid var(--q-separator-color);
  border-radius: 8px;
  overflow-x: auto;
  padding: 1rem;

  &__diagram {
    min-width: 100%;
    text-align: center;

    svg {
      max-width: 100%;
      height: auto;
    }
  }

  &__error {
    color: var(--q-negative);
    font-family: monospace;
    white-space: pre-wrap;
  }

  &__loading {
    color: var(--q-secondary);
    font-style: italic;
  }
}
</style>
