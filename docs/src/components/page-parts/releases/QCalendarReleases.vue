<template>
  <q-card flat bordered>
    <q-card-section v-if="error" class="row no-wrap items-center">
      <q-icon name="warning" size="24px" color="negative" class="q=mr-sm">
        <div>Cannot connect to GitHub. Try again later.</div>
      </q-icon>
    </q-card-section>
    <q-card-section v-else-if="loading" class="row no-wrap items-center">
      <q-spinner size="24px" color="primary" class="q-mr-sm" />
      <div>Loading release notes from GitHub</div>
    </q-card-section>
    <template v-else>
      <!-- <q-tabs v-model="currentPackage" align="left" active-color="primary" active-bg-color="blue-1" indicator-color="primary" class="text-grey-7">
        <q-tab v-for="(packageReleases, packageName) in packages" :label="packageName" :name="packageName" :key="packageName" />
      </q-tabs> -->
      <q-separator />
      <q-tab-panels v-model="currentPackage" animated class="packages-container">
        <q-tab-panel v-for="(packageReleases, packageName) in packages" :name="packageName" :key="packageName" class="q-pa-none">
          <package-releases :active="latestVersions[packageName]" :releases="packageReleases" />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'

import PackageReleases from './PackageReleases'

const { extractDate, formatDate } = date
const packagesDefinitions = {
  'QCalendar': []
}

export default {
  name: 'QCalendarReleases',

  components: {
    PackageReleases
  },

  setup () {
    const loading = ref(false)
    const error = ref(false)
    const packages = ref(packagesDefinitions)
    const currentPackage = ref('QCalendar')
    const versions = ref({})
    const latestVersions = ref({})

    function queryReleases (page = 1) {
      loading.value = true
      error.value = false

      const xhrQuasar = new XMLHttpRequest()

      xhrQuasar.addEventListener('load', function () {
        const releases = JSON.parse(this.responseText)

        if (!releases || releases.length === 0) {
          error.value = true
          return
        }

        // 100 rows of data is sufficient
        let stopQuery = true

        for (const release of releases) {
          const [ name, version ] = release.name.split('v')
          if (name !== '' && name.startsWith('@quasar') === true) {
            continue
          }

          const packageName = currentPackage.value

          if (!version) {
            stopQuery = true
            continue
          }

          if (packages.value[ packageName ] === void 0) {
            packages.value[ packageName ] = []
          }

          const releaseInfo = {
            version,
            date: formatDate(extractDate(release.created_at, 'YYYY-MM-DD'), 'YYYY-MM-DD'),
            body: release.body,
            label: version
          }
          packages.value[ packageName ].push(releaseInfo)

          if (latestVersions.value[ packageName ] === void 0) {
            latestVersions.value[ packageName ] = releaseInfo.label
          }
        }

        if (!stopQuery) {
          queryReleases(page + 1)
        }

        // sort by date
        packages.value.QCalendar.sort((a, b) => {
          return parseInt(b.date.replace(/-/g, ''), 10) - parseInt(a.date.replace(/-/g, ''), 10)
        })
      })

      xhrQuasar.addEventListener('error', () => {
        error.value = true
      })

      xhrQuasar.open('GET', `https://api.github.com/repos/quasarframework/quasar-ui-qcalendar/releases?page=${ page }&per_page=100`)
      xhrQuasar.send()
    }

    onMounted(() => { queryReleases(); loading.value = false })

    return {
      loading,
      error,
      packages,
      currentPackage,
      versions,
      latestVersions
    }
  }
}
</script>

<style lang="sass">
.packages-container .q-tab-panel
  padding-right: 0
  padding-top: 0
</style>
