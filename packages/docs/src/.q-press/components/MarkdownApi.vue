<template>
  <q-card class="markdown-api q-my-xl" flat bordered>
    <div class="header-toolbar row items-center q-pr-sm">
      <MarkdownCardTitle :title="nameBanner" />

      <div
        class="col markdown-api__search-field row items-center no-wrap"
        @click="onSearchFieldClick"
      >
        <input
          ref="inputRef"
          v-model="filter"
          class="col markdown-api__search text-right"
          name="filter"
          placeholder="Filter..."
        />
        <q-btn
          :icon="inputIcon"
          class="header-btn q-ml-xs"
          dense
          flat
          round
          @click="onFilterClick"
        />
      </div>

      <q-btn
        v-if="props.pageLink"
        class="q-ml-sm header-btn"
        size="sm"
        padding="xs sm"
        no-caps
        outline
        :to="apiPath"
      >
        <q-icon name="launch" />
        <div class="q-ml-xs">Docs</div>
      </q-btn>
    </div>

    <q-linear-progress v-if="loading" color="brand-primary" indeterminate class="q-mt-xs" />
    <template v-else-if="nothingToShow">
      <q-separator />
      <div class="markdown-api__nothing-to-show">Nothing to display</div>
    </template>
    <template v-else>
      <q-tabs
        v-model="currentTab"
        class="header-tabs"
        active-color="brand-primary"
        indicator-color="brand-primary"
        align="left"
        :breakpoint="0"
      >
        <q-tab v-for="tab in tabsList" :key="`api-tab-${tab}`" :name="tab" class="header-btn">
          <div class="row no-wrap items-center">
            <span class="q-mr-xs text-capitalize">{{ tab }}</span>
            <q-badge v-if="filteredApiCount[tab].overall" :label="filteredApiCount[tab].overall" />
          </div>
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="currentTab" animated>
        <q-tab-panel v-for="tab in tabsList" :key="tab" class="q-pa-none" :name="tab">
          <div v-if="innerTabsList[tab].length !== 1" class="markdown-api__container row no-wrap">
            <div class="col-auto">
              <q-tabs
                v-model="currentInnerTab"
                class="header-tabs markdown-api__subtabs"
                active-color="brand-primary"
                indicator-color="brand-primary"
                :breakpoint="0"
                vertical
                dense
                shrink
              >
                <q-tab
                  v-for="innerTab in innerTabsList[tab]"
                  :key="`api-inner-tab-${innerTab}`"
                  class="markdown-api__subtabs-item header-btn"
                  :name="innerTab"
                >
                  <div class="row no-wrap items-center self-stretch q-pl-sm">
                    <span class="q-mr-xs text-capitalize">{{ innerTab }}</span>
                    <div class="col" />
                    <q-badge
                      v-if="filteredApiCount[tab].category[innerTab]"
                      :label="filteredApiCount[tab].category[innerTab]"
                    />
                  </div>
                </q-tab>
              </q-tabs>
            </div>

            <q-separator vertical />

            <q-tab-panels
              v-model="currentInnerTab"
              class="col"
              animated
              transition-prev="slide-down"
              transition-next="slide-up"
            >
              <q-tab-panel
                v-for="innerTab in innerTabsList[tab]"
                :key="innerTab"
                class="q-pa-none"
                :name="innerTab"
              >
                <MarkdownApiEntry :type="tab" :definition="filteredApi[tab][innerTab]" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div v-else class="markdown-api__container">
            <MarkdownApiEntry :type="tab" :definition="filteredApi[tab][defaultInnerTabName]" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-card>
</template>

<script setup lang="js">
import { ref, computed, watch, onMounted } from 'vue'
import { mdiClose, mdiMagnify } from '@quasar/extras/mdi-v7'

import MarkdownCardTitle from './MarkdownCardTitle.vue'
import MarkdownApiEntry from './MarkdownApiEntry'

const defaultInnerTabName = '__default'

/**
 * Extracts and categorizes properties based on their categories.
 *
 * @param {Object} props - The properties object where each key is a property name and each value is an object containing a `category` string.
 * @returns {Array<string>} - An array of unique category names sorted alphabetically. If there is only one unique category, returns an array with a default inner tab name.
 */
function getPropsCategories(props) {
  const acc = new Set()

  for (const key in props) {
    if (props[key] !== void 0) {
      const value = props[key]

      value.category.split('|').forEach((groupKey) => {
        acc.add(groupKey)
      })
    }
  }

  return acc.size === 1 ? [defaultInnerTabName] : Array.from(acc).sort()
}

/**
 * Retrieves the inner tabs for a given API.
 *
 * @param {Object} api - The API object containing the data.
 * @param {Array} tabs - The array of tabs to be populated.
 * @param {string} apiType - The type of the API.
 * @returns {Array} - The array of inner tabs.
 */
function getInnerTabs(api, tabs, apiType) {
  const acc = {}

  tabs.forEach((tab) => {
    acc[tab] =
      apiType === 'component' && tab === 'props'
        ? getPropsCategories(api[tab])
        : [defaultInnerTabName]
  })

  return acc
}

/**
 * Parses the given API data and organizes it into tabs and inner tabs.
 *
 * @param {Object} api - The API data to be parsed.
 * @param {Array} tabs - The array to store the main tabs.
 * @param {Array} innerTabs - The array to store the inner tabs.
 */
function parseApi(api, tabs, innerTabs) {
  const acc = {}

  tabs.forEach((tab) => {
    const apiValue = api[tab]

    if (innerTabs[tab].length > 1) {
      const inner = {}

      innerTabs[tab].forEach((subTab) => {
        inner[subTab] = {}
      })

      for (const key in apiValue) {
        if (apiValue[key] !== void 0) {
          const value = apiValue[key]

          value.category.split('|').forEach((groupKey) => {
            inner[groupKey][key] = value
          })
        }
      }

      acc[tab] = inner
    } else {
      acc[tab] = {}
      acc[tab][defaultInnerTabName] = apiValue
    }
  })

  return acc
}

/**
 * Checks if a given item passes the specified filter criteria.
 *
 * @param {string} filter - The filter criteria to apply.
 * @param {string} name - The name of the item to check.
 * @param {string} desc - The description of the item to check.
 * @returns {boolean} - Returns true if the item passes the filter, otherwise false.
 */
function passesFilter(filter, name, desc) {
  return (
    name.toLowerCase().indexOf(filter) > -1 ||
    (desc !== void 0 && desc.toLowerCase().indexOf(filter) > -1)
  )
}

/**
 * Filters the parsed API data based on the provided filter, tabs, and innerTabs.
 *
 * @param {Object} parsedApi - The parsed API data to be filtered.
 * @param {string} filter - The filter criteria to apply to the parsed API data.
 * @param {Array} tabs - The list of tabs to consider while filtering.
 * @param {Array} innerTabs - The list of inner tabs to consider while filtering.
 * @returns {Object} - The filtered API data.
 */
function getFilteredApi(parsedApi, filter, tabs, innerTabs) {
  if (filter === '') {
    return parsedApi
  }

  const acc = {}

  tabs.forEach((tab) => {
    if (tab === 'injection') {
      const name = parsedApi[tab][defaultInnerTabName]
      acc[tab] = {}
      acc[tab][defaultInnerTabName] = passesFilter(filter, name, '') === true ? name : {}
      return
    }

    if (tab === 'quasarConfOptions') {
      const api = parsedApi[tab][defaultInnerTabName]
      acc[tab] = {}
      acc[tab][defaultInnerTabName] = {
        ...api,
        definition: {},
      }
      const result = acc[tab][defaultInnerTabName]

      for (const name in api.definition || {}) {
        const entry = api.definition[name]
        if (passesFilter(filter, name, entry.desc) === true) {
          result.definition[name] = entry
        }
      }

      if (
        Object.keys(result.definition).length === 0 &&
        passesFilter(filter, api.propName, '') === false
      ) {
        acc[tab][defaultInnerTabName] = {}
      }

      return
    }

    const tabApi = parsedApi[tab]
    const tabCategories = innerTabs[tab]

    acc[tab] = {}
    tabCategories.forEach((categ) => {
      const subTabs = {}
      const categoryEntries = tabApi[categ]

      for (const name in categoryEntries) {
        const entry = categoryEntries[name]
        if (passesFilter(filter, name, entry.desc) === true) {
          subTabs[name] = entry
        }
      }

      acc[tab][categ] = subTabs
    })
  })

  return acc
}

/**
 * Calculates the count of API entries based on the provided parsed API data and tab configurations.
 *
 * @param {Object} parsedApi - The parsed API data.
 * @param {Array} tabs - The array of main tab configurations.
 * @param {Array} innerTabs - The array of inner tab configurations.
 * @returns {number} - The count of API entries.
 */
function getApiCount(parsedApi, tabs, innerTabs) {
  const acc = {}

  tabs.forEach((tab) => {
    const tabApi = parsedApi[tab]
    const tabCategories = innerTabs[tab]

    if (['value', 'arg', 'injection'].includes(tab)) {
      acc[tab] = {
        overall: Object.keys(tabApi[tabCategories[0]]).length === 0 ? 0 : 1,
      }
      return
    }

    if (tab === 'quasarConfOptions') {
      const api = tabApi[tabCategories[0]]
      acc[tab] = {
        overall:
          Object.keys(api).length === 0
            ? 0
            : api.definition === void 0
              ? 1
              : Object.keys(api.definition).length,
      }
      return
    }

    acc[tab] = { overall: 0 }

    if (tabCategories.length === 1) {
      const categ = tabCategories[0]
      const count = Object.keys(tabApi[categ]).length

      acc[tab] = {
        overall: count,
        category: { [categ]: count },
      }
    } else {
      acc[tab].category = {}

      tabCategories.forEach((categ) => {
        const count = Object.keys(tabApi[categ]).length
        acc[tab].category[categ] = count
        acc[tab].overall += count
      })
    }
  })

  return acc
}

const getJsonUrl =
  process.env.DEV === true
    ? (file) => `/@fs/${process.env.FS_QUASAR_FOLDER}/dist/api/${file}.json`
    : (file) => `/quasar-api/${file}.json`

const props = defineProps({
  file: {
    type: String,
    required: false,
    default: '',
  },
  api: {
    type: Object,
    required: false,
    default: null,
  },
  name: {
    type: String,
    default: 'API Documentation',
  },
  pageLink: Boolean,
})

const inputRef = ref(null)

const loading = ref(true)
const nameBanner = ref(`Loading ${props.file || props.name} API...`)
const nothingToShow = ref(false)

const apiPath = ref('')

const filter = ref('')
const apiDef = ref({})

const tabsList = ref([])
const innerTabsList = ref({})

const currentTab = ref(null)
const currentInnerTab = ref(null)

watch(currentTab, (val) => {
  currentInnerTab.value = innerTabsList.value[val][0]
})

const inputIcon = computed(() => (filter.value !== '' ? mdiClose : mdiMagnify))

/**
 * A computed property that filters the API data based on certain criteria.
 * The filtering logic is defined within the computed function.
 *
 * @returns {Array} The filtered API data.
 */
const filteredApi = computed(() =>
  getFilteredApi(apiDef.value, filter.value.toLowerCase(), tabsList.value, innerTabsList.value),
)

/**
 * A computed property that returns the count of filtered API items.
 * This property is reactive and will update whenever the dependencies change.
 */
const filteredApiCount = computed(() =>
  getApiCount(filteredApi.value, tabsList.value, innerTabsList.value),
)

/**
 * Parses the API file and extracts relevant information.
 *
 * @param {string} name - The name of the API file.
 * @param {Object} options - The options object containing various properties.
 * @param {string} options.type - The type of the API.
 * @param {string} options.behavior - The behavior of the API.
 * @param {Object} options.meta - Metadata associated with the API.
 * @param {string} options.addedIn - The version in which the API was added.
 * @param {Object} api - Additional API properties.
 * @returns {Object} The parsed API information.
 */
function parseApiFile(name, { type, behavior, meta, addedIn, ...api }) {
  nameBanner.value = `${name} API`
  apiPath.value = meta.docsUrl

  const { internal: _, ...apiSections } = api
  const tabs = Object.keys(apiSections)

  if (tabs.length === 0) {
    nothingToShow.value = true
    return
  }

  tabsList.value = tabs
  currentTab.value = tabs[0]

  const subTabs = getInnerTabs(api, tabs, type)
  innerTabsList.value = subTabs
  apiDef.value = parseApi(api, tabs, subTabs)
}

function onSearchFieldClick() {
  inputRef.value.focus()
}

function onFilterClick() {
  if (filter.value !== '') {
    filter.value = ''
  }
}

if (process.env.CLIENT) {
  onMounted(() => {
    if (props.file) {
      fetch(getJsonUrl(props.file))
        .then((response) => response.json())
        .then((json) => {
          parseApiFile(props.file, json)
          loading.value = false
        })
    } else if (props.api) {
      parseApiFile(props.name, props.api)
      loading.value = false
    }
  })
}
</script>

<style lang="scss">
.markdown-api {
  &__subtabs .q-tabs__content {
    padding: 8px 0;
  }

  &__subtabs-item {
    justify-content: left;
    min-height: 36px !important;

    .q-tab__content {
      width: 100%;
    }
  }

  &__subtabs,
  &__subtabs-item {
    border-radius: 0 !important;
  }

  &__container {
    max-height: 600px;
  }

  &__nothing-to-show {
    padding: 16px;
  }

  &__search-field {
    cursor: text;
    min-width: 10em !important;
  }

  &__search {
    border: 0;
    outline: 0;
    background: none;
    color: inherit;
    width: 1px !important; // required when on narrow width window to not overflow the page
    height: 37px;
  }
}

.markdown-api-entry {
  padding: 16px;
  color: $header-btn-color--light;

  .markdown-api-entry {
    padding: 8px;
  }

  & + & {
    border-top: 1px solid #ddd;
  }

  &__expand-btn {
    margin-left: 4px;
  }

  &__item {
    min-height: 25px;

    & + & {
      margin-top: 4px;
    }
  }

  &__subitem {
    padding: 4px 0 0 8px;
    border-radius: $generic-border-radius;

    > div {
      border: 1px solid rgba(0, 0, 0, 0.12) !important;
      border-radius: inherit;
    }

    > div + div {
      margin-top: 8px;
    }
  }

  &__type {
    line-height: ($font-size + 8px);
  }

  &__value {
    color: $light-text;
  }

  &--indent {
    padding-left: 8px;
  }

  .markdown-token {
    margin: 4px;
    display: inline-block;
  }

  &__added-in,
  &__pill {
    font-size: ($font-size - 1px);
    letter-spacing: $letter-spacing-brand;
    line-height: 1.4em;
  }

  &__added-in {
    font-size: ($font-size - 4px);
  }
}

body.body--light {
  .markdown-api .q-badge {
    color: $brand-light;
    background-color: $brand-dark;
  }

  .markdown-api .markdown-token {
    background-color: #eee;
    border: 1px solid $separator-color;
    color: $light-text;
  }

  .markdown-api-entry__pill {
    color: #fff;
  }

  .markdown-api-entry__added-in {
    color: $red-7;
    border-color: $red;
    background-color: $red-1;
  }
}

body.body--dark {
  .markdown-api .q-badge {
    color: $brand-dark;
    background-color: $brand-primary;
  }

  .markdown-api .markdown-token {
    background-color: $dark-bg;
    border: 1px solid $separator-dark-color;
    color: $dark-text;
  }

  .markdown-api__search {
    color: $dark-text;
  }

  .markdown-api-entry {
    color: $brand-medium;

    & + .markdown-api-entry,
    &__subitem > div {
      border-color: $separator-dark-color !important;
    }

    &__value {
      color: $dark-text;
    }

    &__example {
      color: $brand-primary;
      border-color: $brand-primary;
    }

    &__pill {
      color: $dark;
    }

    &__added-in {
      color: $red;
      border-color: $red;
      background-color: $dark-bg;
    }
  }
}
</style>
