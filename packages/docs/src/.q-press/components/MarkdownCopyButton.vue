<template>
  <div class="markdown-copy-btn">
    <q-icon :name="mdiClipboardOutline" color="brand-primary" @click="copy" />

    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-badge v-show="copied" class="absolute header-badge" label="Copied to clipboard" />
    </transition>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { copyToClipboard } from './markdown-utils'
import { mdiClipboardOutline } from '@quasar/extras/mdi-v7'

const props = defineProps({
  lang: {
    type: String,
    default: 'markdown',
  },
})

const { proxy } = getCurrentInstance()

let timer
const copied = ref(false)

function copy() {
  const target = proxy.$el.previousSibling

  // We need to remove artifacts (like line numbers)
  // before we copy the content.
  // The markdown-code--copying class will do that for us
  target.classList.add('markdown-code--copying')
  let text = target.innerText
  target.classList.remove('markdown-code--copying')

  if (props.lang === 'bash') {
    const bashStartRE = /^\$ /
    text = text
      .split('\n')
      .map((line) => line.replace(bashStartRE, ''))
      .join('\n')
  }

  copyToClipboard(text)
    .then(() => {
      copied.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
        timer = null
      }, 2000)
    })
    .catch(() => {})
}
</script>

<style lang="scss">
.markdown-copy-btn {
  position: absolute;
  top: 8px;
  right: 16px; // account for scrollbar

  .q-icon {
    cursor: pointer;
    color: $brand-primary;
    font-size: 20px;
    padding: 4px;
    border-radius: $generic-border-radius;
    border: 1px solid $brand-primary;
    opacity: 0;
    transition: opacity 0.28s;
  }

  .q-badge {
    top: 4px;
    right: 34px;
  }
}

body.body--light {
  .markdown-copy-btn .q-icon {
    background-color: $light-pill;

    &:hover {
      background-color: #fff;
    }
  }
}

body.body--dark {
  .markdown-copy-btn .q-icon {
    background-color: $dark-pill;

    &:hover {
      background-color: #000;
    }
  }
}

.markdown-copybtn-hover:hover {
  .markdown-copy-btn .q-icon {
    opacity: 1;
  }
}
</style>
