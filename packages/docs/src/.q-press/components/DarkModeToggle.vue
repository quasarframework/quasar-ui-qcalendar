<template>
  <button
    type="button"
    class="dark-mode-toggle"
    :aria-label="toggleLabel"
    :title="toggleLabel"
    @click="toggleMode"
  >
    <div class="toggle-container" :class="{ 'is-dark': isDark }">
      <q-icon :name="props.lightIcon" class="toggle-icon light-icon" aria-hidden="true" />
      <q-icon :name="props.darkIcon" class="toggle-icon dark-icon" aria-hidden="true" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useDark } from '../composables/dark'
import { mdiMoonWaningCrescent, mdiWhiteBalanceSunny } from '@quasar/extras/mdi-v7'

const props = defineProps({
  /**
   * Icon name displayed for the dark mode state.
   *
   * @category content
   * @example mdiMoonWaningCrescent
   */
  darkIcon: {
    type: String,
    default: mdiMoonWaningCrescent, // Default dark mode icon
  },
  /**
   * Icon name displayed for the light mode state.
   *
   * @category content
   * @example mdiWhiteBalanceSunny
   */
  lightIcon: {
    type: String,
    default: mdiWhiteBalanceSunny, // Default light mode icon
  },
})

const emit = defineEmits({
  /**
   * Emitted when the mode is toggled.
   *
   * @param mode - The current mode ('dark' or 'light').
   */
  'update:mode': (mode: 'dark' | 'light') => mode === 'dark' || mode === 'light',
})

const $q = useQuasar()
const { toggleDark } = useDark()

const isDark = computed(() => $q.dark.isActive)
const toggleLabel = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'))

const toggleMode = () => {
  toggleDark()
  emit('update:mode', isDark.value ? 'dark' : 'light')
}

// Watch for changes in Quasar dark mode
watch(
  () => $q.dark.isActive,
  (newVal) => {
    emit('update:mode', newVal ? 'dark' : 'light')
  },
)
</script>

<style scoped lang="scss">
.dark-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  width: 60px;
  height: 30px;
  background-color: $brand-light-bg;
  border: $brand-primary solid 1px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  appearance: none;
}

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.3s ease;
}

.toggle-container.is-dark .light-icon {
  transform: translateX(-100%);
}

.toggle-container.is-dark .dark-icon {
  transform: translateX(0);
}

.toggle-icon {
  color: $brand-primary;
  font-size: 20px;
  width: 50%;
  text-align: center;
  position: absolute;
  transition: transform 0.3s ease;
}

.light-icon {
  left: 0;
  transform: translateX(0);
}

.dark-icon {
  right: 0;
  transform: translateX(100%);
}

body.body--dark {
  .dark-mode-toggle {
    background-color: $brand-dark-bg;
  }
}
</style>
