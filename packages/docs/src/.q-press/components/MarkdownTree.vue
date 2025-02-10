<template>
  <q-tree class="markdown-tree" :nodes="nodes" node-key="id" children-key="c" default-expand-all>
    <template #default-header="prop">
      <div class="markdown-tree__label text-no-wrap">{{ prop.node.l }}</div>

      <q-btn
        v-if="prop.node.url"
        class="markdown-tree__btn q-ml-sm"
        padding="0"
        color="brand-accent"
        flat
        :icon="mdiLaunch"
        :href="prop.node.url"
        target="_blank"
        @click.stop
      />

      <template v-if="prop.node.e">
        <q-icon
          v-if="prop.node.e"
          :name="mdiInformationOutline"
          class="q-ml-sm lt-sm"
          color="grey"
          @click.stop
          @touchstart.stop
        >
          <q-tooltip>{{ prop.node.e }}</q-tooltip>
        </q-icon>
        <div v-if="prop.node.e" class="markdown-tree__explanation text-grey q-ml-sm gt-xs">
          # {{ prop.node.e }}
        </div>
      </template>
    </template>
  </q-tree>
</template>

<script setup>
import { mdiLaunch, mdiInformationOutline } from '@quasar/extras/mdi-v6'

const props = defineProps({
  def: {
    type: Object,
    required: true,
  },
})

let id = 0
const addId = (node) => {
  node.id = id++
  if (node.c !== void 0) {
    node.l += '/'
    node.c.forEach(addId)
  }
  return node
}

const nodes = [addId(props.def)]
</script>

<style lang="scss">
.markdown-tree {
  &__label {
    font-size: ($font-size - 1px);
  }

  &__btn .q-icon {
    font-size: 17px;
  }

  &__explanation {
    font-size: ($font-size - 3px);
    letter-spacing: 0.2px;
  }

  .q-tree__node {
    padding: 0 0 3px 11px;

    &:after {
      left: -9px;
    }
  }

  .q-tree__children {
    padding-left: 19px;
  }

  .q-tree__node--parent {
    padding-left: 4px;
  }

  .q-tree__node-header {
    padding: 0 3px;

    &:before {
      left: -13px;
    }
  }

  .q-tree__node--child {
    padding-left: 10px;

    > .q-tree__node-header:before {
      left: -19px;
      width: 15px;
    }
  }
}
</style>
