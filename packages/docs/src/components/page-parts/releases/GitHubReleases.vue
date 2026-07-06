<template>
  <q-card flat bordered>
    <q-card-section v-if="error" class="row no-wrap items-center">
      <q-icon name="warning" size="24px" color="negative" class="q-mr-sm" />
      <div>Cannot connect to GitHub. Try again later.</div>
    </q-card-section>
    <q-card-section v-else-if="loading" class="row no-wrap items-center">
      <q-spinner size="24px" color="primary" class="q-mr-sm" />
      <div>Loading release notes from GitHub</div>
    </q-card-section>
    <template v-else>
      <q-separator />
      <q-tab-panels v-model="currentPackage" animated class="packages-container">
        <q-tab-panel
          v-for="(packageReleases, packageName) in packages"
          :key="packageName"
          :name="packageName"
          class="q-pa-none"
        >
          <PackageReleases
            :latest-version="latestVersions[packageName]"
            :releases="packageReleases"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { date } from 'quasar'

import PackageReleases from './PackageReleases.vue'
import type { ReleaseInfo } from './PackageReleases.vue'

const { extractDate, formatDate } = date
const packageName = 'QCalendar'

interface GitHubRelease {
  name?: string
  tag_name?: string
  published_at: string
  body?: string
}

type ReleasePackageMap = Record<string, ReleaseInfo[]>

const loading = ref(false)
const error = ref(false)
const packages = ref<ReleasePackageMap>({ [packageName]: [] })
const currentPackage = ref(packageName)
const latestVersions = ref<Record<string, string>>({})

function getReleaseVersion(release: GitHubRelease): string | undefined {
  const name = release.name || release.tag_name || ''
  const match = name.match(/(?:^|\s)v?(\d+\.\d+\.\d+(?:[-\w.]+)?)/)

  return match?.[1] ?? release.tag_name?.replace(/^v/, '')
}

async function queryReleases(): Promise<void> {
  loading.value = true
  error.value = false

  try {
    const response = await fetch(
      'https://api.github.com/repos/quasarframework/quasar-ui-qcalendar/releases?per_page=100',
    )

    if (response.ok === false) {
      throw new Error(`GitHub request failed with ${response.status}`)
    }

    const releases = (await response.json()) as GitHubRelease[]
    const parsedReleases = releases
      .map((release) => {
        const version = getReleaseVersion(release)

        if (version === undefined) {
          return null
        }

        return {
          version,
          date: formatDate(extractDate(release.published_at, 'YYYY-MM-DD'), 'YYYY-MM-DD'),
          body: release.body || '',
          label: version,
        }
      })
      .filter((release): release is ReleaseInfo => release !== null)
      .sort((a, b) => {
        return (
          Number.parseInt(b.date.replace(/-/g, ''), 10) -
          Number.parseInt(a.date.replace(/-/g, ''), 10)
        )
      })

    if (parsedReleases.length === 0) {
      throw new Error('No releases returned from GitHub')
    }

    packages.value = { [packageName]: parsedReleases }
    latestVersions.value = { [packageName]: parsedReleases[0]?.label ?? '' }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(queryReleases)
</script>

<style lang="scss">
.packages-container .q-tab-panel {
  padding-right: 0;
  padding-top: 0;
}
</style>
