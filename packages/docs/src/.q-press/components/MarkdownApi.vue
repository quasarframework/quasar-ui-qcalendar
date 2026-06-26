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
            <q-badge
              v-if="filteredApiCount[tab]?.overall"
              :label="filteredApiCount[tab]?.overall"
            />
          </div>
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="currentTab" animated>
        <q-tab-panel v-for="tab in tabsList" :key="tab" class="q-pa-none" :name="tab">
          <div
            v-if="hasApiCategories(innerTabsList[tab])"
            class="markdown-api__container row no-wrap"
          >
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
                    <span class="q-mr-xs text-capitalize">{{ getInnerTabLabel(innerTab) }}</span>
                    <div class="col" />
                    <q-badge
                      v-if="filteredApiCount[tab]?.category[innerTab]"
                      :label="filteredApiCount[tab]?.category[innerTab]"
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
                <MarkdownApiEntry :type="tab" :definition="filteredApi[tab]?.[innerTab]" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div v-else class="markdown-api__container">
            <MarkdownApiEntry :type="tab" :definition="filteredApi[tab]?.[defaultInnerTabName]" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { mdiClose, mdiMagnify } from '@quasar/extras/mdi-v7'

import MarkdownCardTitle from './MarkdownCardTitle.vue'
import MarkdownApiEntry from './MarkdownApiEntry'

const defaultInnerTabName = '__default'

type ApiEntry = Record<string, any> & {
  category?: string
  definition?: Record<string, ApiEntry>
  desc?: string
  propName?: string
}

type ApiDefinition = Record<string, ApiEntry>
type ParsedApi = Record<string, Record<string, any>>
type InnerTabsMap = Record<string, string[]>
type ApiCount = Record<string, { overall: number; category: Record<string, number> }>

type ApiFile = Record<string, any> & {
  addedIn?: string
  behavior?: unknown
  generated_at?: string
  internal?: unknown
  meta?: {
    docsUrl?: string
  }
  type?: string
}

type MarkdownApiProps = {
  /**
   * API JSON object to render directly.
   *
   * @category content
   */
  api?: ApiFile | null
  /**
   * API file name to fetch from the generated Quasar API endpoint.
   *
   * @category content
   */
  file?: string
  /**
   * Display name shown in the API card header.
   *
   * @category content
   */
  name?: string
  /**
   * Whether to show the Docs button when `meta.docsUrl` is available.
   *
   * @category navigation
   */
  pageLink?: boolean
}

type QPressEnv = {
  QCLI_FS_QUASAR_FOLDER?: string
  QUASAR_CLIENT?: boolean
  QUASAR_DEV?: boolean
}

const qPressEnv = (import.meta as ImportMeta & { env: QPressEnv }).env

/**
 * Extracts categories from an API entry group.
 *
 * @param {Object} entries - The API group where each key is an entry name and each value can contain a `category` string.
 * @returns {Array<string>} - Unique category names sorted alphabetically. If there are no explicit categories, returns the default inner tab name so the category rail stays hidden.
 */
function getApiCategories(entries: ApiDefinition | undefined): string[] {
  const acc = new Set<string>()
  let hasExplicitCategory = false

  for (const key in entries ?? {}) {
    const value = entries?.[key]

    if (value !== void 0) {
      const category = value.category

      if (typeof category === 'string' && category !== '') {
        hasExplicitCategory = true
      }

      ;(category ?? defaultInnerTabName).split('|').forEach((groupKey: string) => {
        acc.add(groupKey)
      })
    }
  }

  return hasExplicitCategory === true ? Array.from(acc).sort() : [defaultInnerTabName]
}

/**
 * Returns whether an API group has explicit category tabs to show.
 */
function hasApiCategories(categories: string[] | undefined): boolean {
  return categories?.some((category) => category !== defaultInnerTabName) === true
}

/**
 * Returns a user-facing label for an API category tab.
 */
function getInnerTabLabel(category: string): string {
  return category === defaultInnerTabName ? 'default' : category
}

/**
 * Retrieves the inner tabs for a given API.
 *
 * @param {Object} api - The API object containing the data.
 * @param {Array} tabs - The array of tabs to be populated.
 * @returns {Array} - The array of inner tabs.
 */
function getInnerTabs(api: ApiFile, tabs: string[]): InnerTabsMap {
  const acc: InnerTabsMap = {}

  tabs.forEach((tab: string) => {
    acc[tab] = getApiCategories(api[tab])
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
function parseApi(api: ApiFile, tabs: string[], innerTabs: InnerTabsMap): ParsedApi {
  const acc: ParsedApi = {}

  tabs.forEach((tab: string) => {
    const apiValue = api[tab]
    const tabInnerTabs = innerTabs[tab] ?? [defaultInnerTabName]

    if (hasApiCategories(tabInnerTabs) === true) {
      const inner: Record<string, ApiDefinition> = {}

      tabInnerTabs.forEach((subTab: string) => {
        inner[subTab] = {}
      })

      for (const key in apiValue) {
        if (apiValue[key] !== void 0) {
          const value = apiValue[key]

          ;(value.category ?? defaultInnerTabName).split('|').forEach((groupKey: string) => {
            if (inner[groupKey] !== undefined) {
              inner[groupKey][key] = value
            }
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
function passesFilter(filter: string, name: string, desc?: string): boolean {
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
function getFilteredApi(
  parsedApi: ParsedApi,
  filter: string,
  tabs: string[],
  innerTabs: InnerTabsMap,
): ParsedApi {
  if (filter === '') {
    return parsedApi
  }

  const acc: ParsedApi = {}

  tabs.forEach((tab: string) => {
    if (tab === 'injection') {
      const injection = parsedApi[tab]?.[defaultInnerTabName]
      acc[tab] = {}

      if (typeof injection === 'string') {
        acc[tab][defaultInnerTabName] =
          passesFilter(filter, injection, '') === true ? injection : {}
        return
      }

      const result: ApiDefinition = {}

      for (const name in injection ?? {}) {
        const entry = injection[name]
        if (entry !== undefined && passesFilter(filter, name, entry.desc) === true) {
          result[name] = entry
        }
      }

      acc[tab][defaultInnerTabName] = result
      return
    }

    if (tab === 'quasarConfOptions') {
      const api = (parsedApi[tab]?.[defaultInnerTabName] ?? {}) as ApiEntry
      acc[tab] = {}
      acc[tab][defaultInnerTabName] = {
        ...api,
        definition: {},
      }
      const result = acc[tab][defaultInnerTabName]

      for (const name in api.definition ?? {}) {
        const entry = api.definition[name]!
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

    const tabApi = parsedApi[tab] ?? {}
    const tabCategories = innerTabs[tab] ?? [defaultInnerTabName]

    acc[tab] = {}
    tabCategories.forEach((categ: string) => {
      const subTabs: ApiDefinition = {}
      const categoryEntries = (tabApi[categ] ?? {}) as ApiDefinition

      for (const name in categoryEntries) {
        const entry = categoryEntries[name]
        if (entry !== undefined && passesFilter(filter, name, entry.desc) === true) {
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
function getApiCount(parsedApi: ParsedApi, tabs: string[], innerTabs: InnerTabsMap): ApiCount {
  const acc: ApiCount = {}

  tabs.forEach((tab: string) => {
    const tabApi = parsedApi[tab] ?? {}
    const tabCategories = innerTabs[tab] ?? [defaultInnerTabName]
    const firstCategory = tabCategories[0] ?? defaultInnerTabName

    if (['value', 'arg'].includes(tab)) {
      acc[tab] = {
        overall: Object.keys(tabApi[firstCategory] ?? {}).length === 0 ? 0 : 1,
        category: {},
      }
      return
    }

    if (tab === 'injection') {
      const injection = tabApi[firstCategory] ?? {}

      acc[tab] = {
        overall:
          typeof injection === 'string'
            ? 1
            : Object.keys(injection).length === 0
              ? 0
              : Object.keys(injection).length,
        category: {},
      }
      return
    }

    if (tab === 'quasarConfOptions') {
      const api = (tabApi[firstCategory] ?? {}) as ApiEntry
      acc[tab] = {
        overall:
          Object.keys(api).length === 0
            ? 0
            : api.definition === void 0
              ? 1
              : Object.keys(api.definition).length,
        category: {},
      }
      return
    }

    acc[tab] = { overall: 0, category: {} }

    if (tabCategories.length === 1) {
      const categ = tabCategories[0] ?? defaultInnerTabName
      const count = Object.keys(tabApi[categ] ?? {}).length

      acc[tab] = {
        overall: count,
        category: { [categ]: count },
      }
    } else {
      tabCategories.forEach((categ: string) => {
        const count = Object.keys(tabApi[categ] ?? {}).length
        acc[tab].category[categ] = count
        acc[tab].overall += count
      })
    }
  })

  return acc
}

const getJsonUrl =
  qPressEnv.QUASAR_DEV === true
    ? (file: string) => `/@fs/${qPressEnv.QCLI_FS_QUASAR_FOLDER ?? ''}/dist/api/${file}.json`
    : (file: string) => `/quasar-api/${file}.json`

const props = withDefaults(defineProps<MarkdownApiProps>(), {
  api: null,
  file: '',
  name: 'API Documentation',
  pageLink: false,
})

const inputRef = ref<HTMLInputElement | null>(null)

const loading = ref(true)
const nameBanner = ref(`Loading ${props.file || props.name} API...`)
const nothingToShow = ref(false)

const apiPath = ref('')

const filter = ref('')
const apiDef = ref<ParsedApi>({})

const tabsList = ref<string[]>([])
const innerTabsList = ref<InnerTabsMap>({})

const currentTab = ref('')
const currentInnerTab = ref('')

watch(currentTab, (val) => {
  currentInnerTab.value = innerTabsList.value[val]?.[0] ?? defaultInnerTabName
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
function parseApiFile(
  name: string,
  {
    type,
    behavior: _behavior,
    generated_at: _generatedAt,
    meta,
    addedIn: _addedIn,
    ...api
  }: ApiFile,
) {
  nameBanner.value = `${name} API`
  apiPath.value = meta?.docsUrl ?? ''

  const { internal: _internal, ...apiSections } = api
  const tabs = Object.keys(apiSections)

  if (tabs.length === 0) {
    nothingToShow.value = true
    return
  }

  tabsList.value = tabs
  currentTab.value = tabs[0]

  const subTabs = getInnerTabs(api, tabs)
  innerTabsList.value = subTabs
  apiDef.value = parseApi(api, tabs, subTabs)
}

function onSearchFieldClick() {
  inputRef.value?.focus()
}

function onFilterClick() {
  if (filter.value !== '') {
    filter.value = ''
  }
}

if (qPressEnv.QUASAR_CLIENT === true) {
  onMounted(() => {
    if (props.file) {
      fetch(getJsonUrl(props.file))
        .then((response) => response.json())
        .then((json: ApiFile) => {
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
    max-width: calc(100% - 8px);
    overflow-x: auto;
    vertical-align: middle;
    white-space: nowrap;
  }

  &__typescript {
    display: block;
    margin: 4px 0;
    max-width: 100%;
    overflow-x: auto;
    padding: 8px 10px;
    white-space: pre;

    code {
      font: inherit;
    }
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
    border: 1px solid $brand-border-color-light;
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
    color: $brand-dark-text;
    background-color: $brand-primary;
  }

  .markdown-api .markdown-token {
    background-color: $dark-bg;
    border: 1px solid $brand-border-color-dark;
    color: $dark-text;
  }

  .markdown-api__search {
    color: $dark-text;
  }

  .markdown-api-entry {
    color: $brand-medium;

    & + .markdown-api-entry,
    &__subitem > div {
      border-color: $brand-border-color-dark !important;
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
