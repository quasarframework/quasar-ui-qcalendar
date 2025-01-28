<template>
  <q-dialog v-model="openImporter">
    <div :class="classes" style="max-width: 380px; width: 100%">
      <div class="text-title">Theme Importer</div>
      <q-separator class="q-mb-md" />
      <q-input
        v-model="editorValue"
        type="textarea"
        label="Paste your theme here..."
        class="full-width"
      />
      <div class="row justify-center full-width q-mt-sm q-gutter-sm">
        <q-btn label="Import" @click="onImport" />
        <q-btn label="Revert" :disable="stylesCopy === void 0" @click="onRevert" />
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import { useThemeBuilderStore } from 'stores/ThemeBuilder'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:model-value'])

const $q = useQuasar()
const openImporter = ref(false)
const editorValue = ref('')
const stylesCopy = ref<any>(void 0)
const store = useThemeBuilderStore()

const classes = computed(() => {
  return {
    'column items-center q-pa-md': true,
    'bg-grey-11': !$q.dark.isActive,
    'bg-grey-9': $q.dark.isActive,
  }
})

watch(
  () => props.modelValue,
  () => {
    openImporter.value = props.modelValue
    // clear anything existing
    editorValue.value = ''
    stylesCopy.value = void 0
  },
)

watch(openImporter, (val) => {
  emit('update:model-value', val)
})

function setStyle({ name, styles }: { name: string; styles: any }) {
  setCurrentStyleName(name)
  Object(store.style).splice(0, Object.keys(store.style).length, ...styles)
}

function setCurrentStyleName(name: string) {
  store.currentStyleName = name
}

onBeforeMount(() => {
  openImporter.value = props.modelValue
})

function onImport() {
  // make a copy
  stylesCopy.value = JSON.parse(JSON.stringify(store.style))

  let newStyles

  try {
    newStyles = JSON.parse(editorValue.value)
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
    }
    return
  }

  if (newStyles) {
    Object.keys(newStyles).forEach((name) => {
      // make sure there is a corresponding name in styles
      // and if a match, only then import
      if (store.style[name] !== void 0) {
        setStyle({ name, styles: newStyles[name] })
      }
    })
  }
}

function onRevert() {
  if (stylesCopy.value !== void 0) {
    Object.keys(stylesCopy.value).forEach((name) => {
      setStyle({ name, styles: stylesCopy.value[name] })
    })
  }
}
</script>
