<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <q-select
        v-model="country"
        label="Pick a Country"
        outlined
        dense
        options-dense
        map-options
        emit-value
        :options="countriesList"
        class="button"
        style="min-width: 320px;"
      />
    </div>

    <div style="font-size: 2em;">{{ formattedMonth }}</div>

    <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
      <q-calendar-month
        ref="calendar"
        v-model="selectedDate"
        animated
        bordered
        focusable
        hoverable
        no-active-date
        :day-min-height="60"
        :day-height="0"
        :locale="locale"
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-day="onClickDay"
        @click-workweek="onClickWorkweek"
        @click-head-workweek="onClickHeadWorkweek"
        @click-head-day="onClickHeadDay"
      >
        <template #day="{ scope: { timestamp } }">
          <template
            v-for="event in eventsMap[timestamp.date]"
            :key="event.id"
          >
            <div
              :class="badgeClasses(event, 'day')"
              :style="badgeStyles(event, 'day')"
              class="my-event"
            >
              <abbr
                :title="event.details"
                class="tooltip"
              >
                <span class="title q-calendar__ellipsis">{{ event.title + (event.time ? ' - ' + event.time : '') }}</span>
              </abbr>
            </div>
          </template>
        </template>
      </q-calendar-month>
    </div>
  </div>
</template>

<script>
import {
  PARSE_DATE, // regex for parsing out date
  addToDate,
  parseTimestamp,
  today,
  isBetweenDates
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import {
  defineComponent,
  ref,
  reactive,
  computed
} from 'vue'
import NavigationBar from '../components/NavigationBar.vue'
import Holidays from 'date-holidays'

export default defineComponent({
  name: 'MonthSlotDay',
  components: {
    NavigationBar,
    QCalendarMonth
  },

  setup (props, { slots, emit }) {
    const countries = new Holidays().getCountries()
    const selectedDate = ref(today()),
      selectedMonth = reactive([]),
      year = ref(new Date().getFullYear()),
      calendar = ref(null),
      country = ref('CA'), // start with Canada
      // map the holiday contry codes to actual ISO 639-1 locale codes
      // so the calendar can show the correct language
      countryCodes = {
        AD: 'ca', // 'Andorra', Catalan
        AE: 'ar', // 'دولة الإمارات العربية المتحدة', Arabic
        AG: 'en', // 'Antigua & Barbuda', English
        AI: 'en', // 'Anguilla', English/Creole
        AL: 'sq', // 'Shqipëri', Albanian
        AM: 'hy', // 'Հայաստան', Armenian
        AO: 'pt', // 'Angola', Potuguese
        AR: 'es-AR', // 'Argentina', Spanish
        AS: 'en-US', // 'American Samoa', American English
        AT: 'de-AT', // 'Österreich', German (Austrian)/Bavarian
        AU: 'en-AU', // 'Australia', Austraian English
        AW: 'nl', // 'Aruba', Dutch
        AX: 'sv-FI', // 'Landskapet Åland', Swedish (finnish)
        AZ: 'az', // 'Azərbaycan Respublikası', Azerbaijani
        BA: 'bs', // 'Bosna i Hercegovina', Bosnian
        BB: 'en', // 'Barbados', English
        BD: 'bn', // 'গণপ্রজাতন্ত্রী বাংলাদেশ', Bengali
        BE: 'nl-BE', // 'Belgique', Ditch (Belgian)
        BF: 'nl', // 'Burkina Faso', Dutch
        BG: 'mk', // 'България', Macedonian
        BH: 'ar', // 'مملكة البحرين', Arabix
        BI: 'fr', // 'République du Burundi', French
        BJ: 'fr', // 'République du Bénin', French
        BL: 'fr', // 'St. Barthélemy', French
        BM: 'en', // 'Bermuda', English
        BN: 'en', // 'Negara Brunei Darussalam', Maylay/English
        BO: 'es-BO', // 'Bolivia', English Bolian
        BQ: 'nl', // Caribisch Nederland', Dutch
        BR: 'pt-BR', // 'Brasil', Portuguese Brazil
        BS: 'bah', // 'Bahamas', Bahamian Creole
        BW: 'tn', // 'Botswana', Setswana
        BY: 'ru', // 'Рэспубліка Беларусь', Russian
        BZ: 'en-BZ', // 'Belize', English Belize
        CA: 'en-CA', // 'Canada',
        CC: 'en', // 'Cocos (Keeling) Islands', Maylay/English
        CD: 'fr', // 'République démocratique du Congo', French
        CF: 'fr', // 'République centrafricaine', French
        CG: 'fr', // 'République du Congo', French
        CH: 'de-LI', // 'Schweiz', German Swiss
        CL: 'es-CL', // 'Chile', Spanish Chile
        CM: 'fr', // 'Cameroun', French
        CN: 'zh', // '中华人民共和国', Mandarin (Chinese)
        CO: 'es-CO', // 'Colombia', Spanish Columbian
        CR: 'es-CR', // 'Costa Rica', Spanish Costa Rica
        CU: 'es-CU', // 'Cuba', Spanish
        CV: 'kea', // 'República de Cabo Verde', Spanish (ISO 693-3)
        CW: 'nl', // 'Curaçao', Dutch
        CX: 'en', // 'Christmas Island', English
        CY: 'el', // 'Κύπρος', Greek
        CZ: 'cs', // 'Česká republika', Czech
        DE: 'de-DE', // 'Deutschland', German Germany
        DK: 'da', // 'Danmark', Danish
        DM: 'fr', // 'Dominica', French
        DO: 'fr', // 'República Dominicana', French
        EC: 'es-EC', // 'Ecuador', Spanish Ecuador
        EE: 'et', // 'Eesti', Estonian
        ES: 'es', // 'España', Spanish
        ET: 'ak', // 'ኢትዮጵያ', Afrikans
        FI: 'fi', // 'Suomi', Finish
        FO: 'de', // 'Føroyar', German
        FR: 'fr', // 'France', French
        GA: 'fr', // 'Gabon', French
        GB: 'en-GB', // 'United Kingdom', English Great Britain
        GD: 'en', // 'Grenada', Englsih
        GE: 'ka', // 'საქართველო', Georgian
        GF: 'fr-GY', // 'Guyane', Grench Guyane
        GG: 'fr', // 'Guernsey', French
        GI: 'es', // 'Gibraltar', Spanish
        GL: 'kl', // 'Kalaallit Nunaat', (ISO 639-1)
        GP: 'fr', // 'Guadeloupe', French
        GQ: 'fr', // 'República de Guinea Ecuatorial', French (Spanish, Portuguese)
        GR: 'el', // 'Ελλάδα', Greek
        GT: 'es-GT', // 'Guatemala', Spanish Guatemala
        GU: 'ch', // 'Guam', Chamorro
        GY: 'en', // 'Guyana', English
        HN: 'es-HN', // 'Honduras', English Honduras
        HR: 'hr', // 'Hrvatska', Croation
        HT: 'ht', // 'Haïti', Haitian
        HU: 'hu', // 'Magyarország', Hungary
        ID: 'hy-AM', // 'Indonesia', Armenian
        IE: 'en-IE', // 'Ireland', English Ireland
        IM: 'en', // 'Isle of Man', English
        IS: 'is', // 'Ísland', Icelandic
        IT: 'it', // 'Italia', Italian
        JE: 'en', // 'Jersey', English
        JM: 'en-JM', // 'Jamaica', English Jamaica
        JP: 'ja', // '日本', Japanese
        KE: 'sw', // 'Kenya', Swahili
        KR: 'ko-KP', // '대한민국', Korean (South)
        LI: 'gsw', // 'Lichtenstein', Swiss German
        LS: 'en', // "'Muso oa Lesotho", English
        LT: 'lt', // 'Lietuva', Lithuanian
        LU: 'fr-LU', // 'Luxembourg', French Luxembourg
        LV: 'lv', // 'Latvija', Latvian
        MC: 'fr-MC', // 'Monaco', French Monaco
        MD: 'mo', // 'Republica Moldova',
        ME: 'bs', // 'Crna Gora', Bosnian
        MG: 'mg', // "Repoblikan'i Madagasikara", Madagascar
        MK: 'mk', // 'Република Македонија', Macedonian
        MQ: 'fr', // 'Martinique', French
        MT: 'mt', // 'Malta', Malta
        MW: 'en', // 'Malawi', English
        MX: 'es-MX', // 'México', Spanish Mexican
        MZ: 'pt', // 'Moçambique', Potuguese
        NA: 'en', // 'Namibia', English (German)
        NI: 'es-NI', // 'Nicaragua', Spanish Nicaragua
        NL: 'nl-NL', // 'Nederland', Dutch Netherlands
        NO: 'no', // 'Norge', Norwegian
        NZ: 'en-NZ', // 'New Zealand', English New Zealand
        PA: 'es', // 'Panamá', Spanish
        PE: 'es-PE', // 'Perú', Spanish Peru
        PH: 'en-PH', // 'Philippines', English Philippines
        PL: 'pl', // 'Polska', Polish
        PT: 'pt', // 'Portugal', Portuguese
        PY: 'gn', // 'Paraguay', Paraguay
        RE: 'fr', // 'Réunion', French
        RO: 'ro', // 'Romania', Romanian
        RS: 'sr', // 'Република Србија', Serbian
        RU: 'ru', // 'Россия', Russian
        RW: 'rw', // "Repubulika y'u Rwanda", Rwanda
        SE: 'sv', // 'Sverige', Swedish
        SG: 'zh-SG', // 'Singapore', Chinese Singapore
        SH: 'en', // 'St. Helena', English
        SI: 'sq', // 'Republika Slovenija', Albanian
        SJ: 'no', // 'Svalbard & Jan Mayen', Norwegian
        SK: 'sk', // 'Slovenská republika', Slovak
        SM: 'it', // 'San Marino', Italian
        SO: 'ar', // 'Jamhuuriyadda Federaalka Soomaaliya', Arabic
        SS: 'en', // 'South Sudan', English
        SV: 'es-SV', // 'El Salvador', Spanish El Salvador
        TG: 'fr', // 'République togolaise', French
        TO: 'to', // 'Puleʻanga Fakatuʻi ʻo Tonga', Tongan
        TR: 'tr', // 'Türkiye', Turkish
        TZ: 'sw', // 'Tanzania', Swahili
        UA: 'uk', // 'Україна', Ukraine
        UG: 'en-UG', // 'Uganda', English Uganda
        US: 'en-US', // 'United States of America', English USA
        UY: 'es-UY', // 'Uruguay', Spanish Uruguay
        VA: 'it', // 'Stato della Città del Vaticano', Italian
        VE: 'es-VE', // 'Venezuela', Spanish Venezuela
        VN: 'vi', // 'Cộng hòa Xã hội chủ nghĩa Việt Nam', Vietnamese
        XK: 'sq', // 'Republika e Kosovës', Albanian
        YT: 'fr', // 'Mayotte', French
        ZA: 'af', // 'South Africa', Afrikaans
        ZM: 'en', // 'Zambia', English
        ZW: 'en' // 'Zimbabwe' English
      }

    const countriesList = computed(() => {
      return Object.keys(countries).map(key => {
        return { label: countries[ key ], value: key }
      })
    })

    console.log(countriesList.value)

    const locale = computed(() => {
      if (country.value) {
        return countryCodes[ country.value ]
      }
      return 'en-CA'
    })

    const formattedMonth = computed(() => {
      const date = new Date(selectedDate.value)
      return monthFormatter().format(date)
    })

    function monthFormatter () {
      try {
        return new Intl.DateTimeFormat(locale.value || undefined, {
          month: 'long',
          timeZone: 'UTC'
        })
      }
      catch (e) {
        //
      }
    }

    const holidaysMap = computed(() => {
      // keep previous, current and next year so in dec/jan
      // you can see holidays from different years
      return [
        ...(new Holidays(country.value).getHolidays(year.value - 1)),
        ...(new Holidays(country.value).getHolidays(year.value)),
        ...(new Holidays(country.value).getHolidays(year.value + 1))
      ]
    })

    function getColor (item) {
      switch (item.type) {
        case 'public':
          return 'blue'
        case 'observance':
          return 'green'
        case 'optional':
          return 'red'
        default: // bank|school
          return 'orange'
      }
    }

    /// where the magic happens...
    const eventsMap = computed(() => {
      const map = {}
      if (selectedMonth.length > 0) {
        const start = selectedMonth[ 0 ]
        const end = selectedMonth[ selectedMonth.length - 1 ]
        holidaysMap.value
          .filter(item => {
            const timestamp = parseTimestamp((PARSE_DATE.exec(item.date))[ 0 ])
            return isBetweenDates(timestamp, start, end)
          })
          .map((item, index) => {
            return {
              id: index,
              title: item.name,
              details: item.type,
              date: (PARSE_DATE.exec(item.date))[ 0 ],
              bgcolor: getColor(item)
            }
          })
          .forEach(event => {
            (map[ event.date ] = (map[ event.date ] || [])).push(event)
            if (event.days !== undefined) {
              let timestamp = parseTimestamp(event.date)
              let days = event.days
              // add a new event for each day
              // skip 1st one which would have been done above
              do {
                timestamp = addToDate(timestamp, { day: 1 })
                if (!map[ timestamp.date ]) {
                  map[ timestamp.date ] = []
                }
                map[ timestamp.date ].push(event)
                // already accounted for 1st day
              } while (--days > 1)
            }
          })
      }
      return map
    })

    function badgeClasses (event, type) {
      return {
        [ `text-white bg-${ event.bgcolor }` ]: true,
        'rounded-border': true
      }
    }

    function badgeStyles (day, event) {
      const s = {}
      // s.left = day.weekday === 0 ? 0 : (day.weekday * parsedCellWidth) + '%'
      // s.top = 0
      // s.bottom = 0
      // s.width = (event.days * parsedCellWidth) + '%'
      return s
    }

    function onToday () {
      calendar.value.moveToToday()
    }
    function onPrev () {
      calendar.value.prev()
    }
    function onNext () {
      calendar.value.next()
    }
    function onMoved (data) {
      console.log('onMoved', data)
    }
    function onChange (data) {
      console.log('onChange', data)
      selectedMonth.splice(0, selectedMonth.length, ...data.days)
      // get year of 1st of the month
      for (let index = 0; index < selectedMonth.length; ++index) {
        if (selectedMonth[ index ].day === 1) {
          year.value = selectedMonth[ index ].year
          break
        }
      }
    }
    function onClickDate (data) {
      console.log('onClickDate', data)
    }
    function onClickDay (data) {
      console.log('onClickDay', data)
    }
    function onClickWorkweek (data) {
      console.log('onClickWorkweek', data)
    }
    function onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
    function onClickHeadWorkweek (data) {
      console.log('onClickHeadWorkweek', data)
    }

    return {
      selectedDate,
      calendar,
      countries,
      countriesList,
      country,
      locale,
      eventsMap,
      formattedMonth,
      badgeClasses,
      badgeStyles,
      onToday,
      onPrev,
      onNext,
      onMoved,
      onChange,
      onClickDate,
      onClickDay,
      onClickWorkweek,
      onClickHeadDay,
      onClickHeadWorkweek
    }
  }
})
</script>

<style lang="sass" scoped>
.my-event
  position: relative
  font-size: 12px
  width: 100%
  margin: 1px 0 0 0
  justify-content: center
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.rounded-border
  border-radius: 2px

abbr.tooltip
  text-decoration: none

</style>
