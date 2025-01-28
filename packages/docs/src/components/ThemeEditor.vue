<template>
  <q-dialog ref="borderEditor" v-model="openEditor" position="right">
    <div :class="classes" style="max-width: 360px">
      <div class="text-title">Theme Styles Picker</div>
      <q-separator class="q-mb-md full-width" />

      <div v-if="currentBorderSize !== void 0" class="full-width">
        <div class="full-width text-caption q-pb-lg">
          <strong>Border Width</strong>
        </div>
        <q-slider v-model="editorSize" :min="1" :max="5" label label-always class="fill-width" />
        <q-separator class="q-mb-sm" />
      </div>

      <div v-if="currentBorderType !== void 0" class="full-width row justify-center">
        <div class="full-width text-caption">
          <strong>Border Style</strong>
        </div>
        <q-radio v-model="editorType" val="solid" label="Solid" />
        <q-radio v-model="editorType" val="dashed" label="Dashed" />
        <q-radio v-model="editorType" val="dotted" label="Dotted" />
        <q-separator class="q-mb-sm full-width" />
      </div>

      <div v-if="currentColor !== void 0" class="row justify-center">
        <div class="full-width text-caption">
          <strong>Color</strong>
        </div>

        <q-color
          default-view="palette"
          v-model="editorColor"
          :palette="colorPalette"
          format-model="hexa"
          style="max-width: 200px"
        />
        <p>Hint: current color schema is on the Palette tab</p>
        <q-separator class="q-mb-sm full-width" />
      </div>

      <div class="row justify-center">
        <q-input v-if="isValue" v-model="editorValue" label="Edit css value" />
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
import { colors } from 'quasar'
import { useThemeBuilderStore } from 'stores/ThemeBuilder'

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

const hints = computed(() => store.hints)
const hint = computed(() => (props.itemName ? hints.value[props.itemName] : ''))

const classes = computed(() => ({
  'column items-center q-pa-md': true,
  'bg-grey-11': !props.styleObject.darkMode,
  'bg-grey-9': props.styleObject.darkMode,
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
  return parseInt(parts.find((part) => /^\d+$/.test(part)) || '', 10)
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
