<template>
  <q-dialog ref="borderEditor" v-model="openEditor" position="right">
    <div :class="classes" style="max-width: 360px">
      <div class="text-title">Theme Styles Picker</div>
      <q-separator class="q-mb-md full-width" />

      <div v-if="currentBorderSize !== void 0" class="full-width">
        <div class="full-width text-caption q-pb-lg theme-editor__label">
          <strong>Border Width</strong>
        </div>
        <q-slider
          v-model="editorSize"
          :min="1"
          :max="5"
          label
          label-always
          class="fill-width"
        />
        <q-separator class="q-mb-sm" />
      </div>

      <div v-if="currentBorderType !== void 0" class="full-width row justify-center">
        <div class="full-width text-caption theme-editor__label">
          <strong>Border Style</strong>
        </div>
        <q-radio v-model="editorType" val="solid" label="Solid" />
        <q-radio v-model="editorType" val="dashed" label="Dashed" />
        <q-radio v-model="editorType" val="dotted" label="Dotted" />
        <q-separator class="q-mb-sm full-width" />
      </div>

      <div v-if="currentColor !== void 0" class="row justify-center">
        <div class="full-width text-caption theme-editor__label">
          <strong>Color</strong>
        </div>

        <q-color
          v-model="editorColor"
          :dark="isDarkMode"
          :palette="colorPalette"
          default-view="palette"
          format-model="hexa"
          style="max-width: 200px"
        />
        <p class="theme-editor__hint">Hint: current color schema is on the Palette tab</p>
        <q-separator class="q-mb-sm full-width" />
      </div>

      <div class="row justify-center">
        <q-input
          v-if="isValue"
          v-model="editorValue"
          :dark="isDarkMode"
          label="Edit css value"
        />
      </div>

      <div class="row justify-center">
        <q-btn
          label="Revert change"
          dense
          :disabled="itemStyleOrig === itemStyle"
          class="q-ma-md"
          @click="onRevert"
        />
      </div>
      <q-separator />
      <div class="full-width q-mt-sm">
        <div class="text-title2">
          {{ itemName }}
        </div>
        {{ hint }}
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeMount } from 'vue'
import { colors, useQuasar } from 'quasar'
import { useThemeBuilderStore } from '@/stores/ThemeBuilder'

const { brightness } = colors

const props = defineProps<{
  modelValue: boolean
  itemName: string
  itemStyle: string
  styleObject: Record<string, string>
}>()

const emit = defineEmits(['update:model-value', 'style'])

const openEditor = ref(false)
const editorSize = ref<number | undefined>(undefined)
const editorType = ref<string | undefined>(undefined)
const editorColor = ref<string | undefined>(undefined)
const editorValue = ref<string | undefined>(undefined)
const itemNameOrig = ref('')
const itemStyleOrig = ref('')
const styleCopy = ref<Record<string, string>>({})
const store = useThemeBuilderStore()
const $q = useQuasar()

const hints = computed(() => store.hints)
const hint = computed(() => (props.itemName ? hints.value[props.itemName] : ''))
const isDarkMode = computed(() => $q.dark.isActive)

const classes = computed(() => ({
  'theme-editor column items-center q-pa-md': true,
  'theme-editor--light bg-grey-11 text-dark': !isDarkMode.value,
  'theme-editor--dark bg-grey-10 text-grey-2': isDarkMode.value,
}))

const currentStyle = computed(() => {
  let style = ''
  if (editorValue.value !== undefined) {
    style += editorValue.value
  } else {
    if (editorColor.value) style += editorColor.value
    if (editorSize.value && !isNaN(editorSize.value)) style += ` ${editorSize.value}px`
    if (editorType.value) style += ` ${editorType.value}`
  }
  return style
})

const currentColor = computed(() => {
  if (!props.itemStyle) return
  const parts = props.itemStyle.split(' ')
  return parts.find((part) => /^(#|(rgb|hsl)a?\()/.test(part))
})

const currentBorderType = computed(() => {
  if (!props.itemStyle) return
  const parts = props.itemStyle.split(' ')
  return parts.find((part) => ['solid', 'dashed', 'dotted'].includes(part))
})

const currentBorderSize = computed(() => {
  if (!props.itemStyle || !props.itemName.includes('border')) return
  const parts = props.itemStyle.split(' ')
  const size = parts.find((part) => /^\d+(px)?$/.test(part))
  return size !== undefined ? parseInt(size, 10) : undefined
})

const isValue = computed(() => {
  return props.itemName && !currentBorderType.value && !currentColor.value
})

const colorPalette = computed(() => {
  const uniqueColors = new Set<string>()
  Object.entries(styleCopy.value).forEach(([_name, value]) => {
    if (value.match(/^(#|(rgb|hsl)a?\()/)) uniqueColors.add(value.toLowerCase())
  })
  return Array.from(uniqueColors).sort((a, b) => brightness(b) - brightness(a))
})

const updateEditor = () => {
  editorSize.value = currentBorderSize.value
  editorType.value = currentBorderType.value
  editorColor.value = currentColor.value
  editorValue.value = props.itemStyle
  if (itemNameOrig.value !== props.itemName) {
    itemNameOrig.value = props.itemName
    itemStyleOrig.value = props.itemStyle
    styleCopy.value = { ...props.styleObject }
  }
}

const onRevert = () => {
  emit('style', itemStyleOrig.value)
}

watch(
  () => props.modelValue,
  (val) => (openEditor.value = val),
)
watch(
  () => openEditor.value,
  (val) => emit('update:model-value', val),
)
watch(() => props.itemStyle, updateEditor)
watch(
  () => currentStyle.value,
  (val) => emit('style', val),
)

onBeforeMount(() => {
  openEditor.value = props.modelValue
  updateEditor()
})
</script>

<style lang="scss" scoped>
.theme-editor {
  color: #1d1d1d;
}

.theme-editor--dark {
  color: rgba(255, 255, 255, 0.88);
}

.theme-editor--dark :deep(.q-separator) {
  background: rgba(255, 255, 255, 0.14);
}

.theme-editor--dark :deep(.q-field__label),
.theme-editor--dark :deep(.q-field__native),
.theme-editor--dark :deep(.q-radio__label) {
  color: rgba(255, 255, 255, 0.82);
}

.theme-editor--dark :deep(.q-btn--disabled) {
  color: rgba(255, 255, 255, 0.62) !important;
}

.theme-editor__label {
  color: currentColor;
}

.theme-editor__hint {
  color: inherit;
}

.text-title {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.375rem;
  letter-spacing: 0.00714em;
}

.text-title2 {
  font-size: 0.775rem;
  font-weight: 600;
  line-height: 1.375rem;
  letter-spacing: 0.00714em;
}
</style>
