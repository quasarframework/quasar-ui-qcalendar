<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="q-ma-sm row justify-center q-gutter-sm">
      <q-select
        v-model="country"
        label="Pick a Country"
        outlined
        dense
        options-dense
        map-options
        emit-value
        :options="countriesList"
        style="min-width: 320px"
      />
    </div>

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap">
      <div class="q-ma-md" style="font-size: 2em">{{ formattedMonth }}</div>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
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
            <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
              <div
                :class="badgeClasses(event, 'day')"
                :style="badgeStyles(event, 'day')"
                class="my-event"
              >
                <div class="title q-calendar__ellipsis">
                  {{ event.title + (event.time ? ' - ' + event.time : '') }}
                  <q-tooltip>{{
                    event.details + ': ' + event.title + (event.time ? ' - ' + event.time : '')
                  }}</q-tooltip>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QCalendarMonth,
  /// @ts-expect-error ignore for now
  PARSE_DATE, // regex for parsing out date
  addToDate,
  parseTimestamp,
  today,
  isBetweenDates,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, reactive, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'
import Holidays from 'date-holidays'

interface Holiday {
  date: string
  start: Date
  end: Date
  name: string
  type: string
  rule: string
  substitute?: boolean
}

interface Event {
  id: number
  title: string
  details: string
  date: string
  time?: string
  bgColor: string
  days?: number
}

const calendar = ref<QCalendarMonth>(),
  hd = new Holidays(),
  countries = hd.getCountries(),
  selectedDate = ref(today()),
  selectedMonth = reactive<Timestamp[]>([]),
  year = ref(new Date().getFullYear()),
  country = ref('CA'), // start with Canada
  // map the holiday contry codes to actual ISO 639-1 locale codes
  // so the calendar can show the correct language
  countryCodes: Record<string, string> = {
    AD: 'ca', // 'Andorra', Catalan
    AE: 'ar', // 'دولة الإمارات العربية المتحدة', Arabic
    AG: 'en', // 'Antigua & Barbuda', English
    AI: 'en', // 'Anguilla', English/Creole
    AL: 'sq', // 'Shqipëri', Albanian
    AM: 'hy', // 'Հայաստան', Armenian
    AO: 'pt', // 'Angola', Portuguese
    AR: 'es-AR', // 'Argentina', Spanish
    AS: 'en-US', // 'American Samoa', American English
    AT: 'de-AT', // 'Österreich', German (Austrian)/Bavarian
    AU: 'en-AU', // 'Australia', Australian English
    AW: 'nl', // 'Aruba', Dutch
    AX: 'sv-FI', // 'Landskapet Åland', Swedish (Finnish)
    AZ: 'az', // 'Azərbaycan Respublikası', Azerbaijani
    BA: 'bs', // 'Bosna i Hercegovina', Bosnian
    BB: 'en', // 'Barbados', English
    BD: 'bn', // 'গণপ্রজাতন্ত্রী বাংলাদেশ', Bengali
    BE: 'nl-BE', // 'Belgique', Dutch (Belgian)
    BF: 'fr', // 'Burkina Faso', French
    BG: 'bg', // 'България', Bulgarian
    BH: 'ar', // 'مملكة البحرين', Arabic
    BI: 'fr', // 'République du Burundi', French
    BJ: 'fr', // 'République du Bénin', French
    BL: 'fr', // 'St. Barthélemy', French
    BM: 'en', // 'Bermuda', English
    BN: 'ms', // 'Negara Brunei Darussalam', Malay
    BO: 'es-BO', // 'Bolivia', Spanish
    BQ: 'nl', // 'Caribisch Nederland', Dutch
    BR: 'pt-BR', // 'Brasil', Portuguese (Brazil)
    BS: 'en', // 'Bahamas', English
    BW: 'tn', // 'Botswana', Setswana
    BY: 'ru', // 'Рэспубліка Беларусь', Russian
    BZ: 'en-BZ', // 'Belize', English (Belize)
    CA: 'en-CA', // 'Canada', English (Canada)
    CC: 'en', // 'Cocos (Keeling) Islands', English
    CD: 'fr', // 'République démocratique du Congo', French
    CF: 'fr', // 'République centrafricaine', French
    CG: 'fr', // 'République du Congo', French
    CH: 'de-CH', // 'Schweiz', German (Swiss)
    CI: 'fr', // 'République de Côte d'Ivoire', French
    CK: 'en', // 'Cook Islands', English
    CL: 'es-CL', // 'Chile', Spanish (Chile)
    CM: 'fr', // 'Cameroun', French
    CN: 'zh', // '中华人民共和国', Mandarin (Chinese)
    CO: 'es-CO', // 'Colombia', Spanish (Colombian)
    CR: 'es-CR', // 'Costa Rica', Spanish (Costa Rica)
    CU: 'es-CU', // 'Cuba', Spanish
    CV: 'kea', // 'República de Cabo Verde', Kabuverdianu (ISO 639-3)
    CW: 'nl', // 'Curaçao', Dutch
    CX: 'en', // 'Christmas Island', English
    CY: 'el', // 'Κύπρος', Greek
    CZ: 'cs', // 'Česká republika', Czech
    DE: 'de-DE', // 'Deutschland', German (Germany)
    DJ: 'fr', // 'République de Djibouti', French
    DK: 'da', // 'Danmark', Danish
    DM: 'en', // 'Dominica', English
    DO: 'es-DO', // 'República Dominicana', Spanish (Dominican Republic)
    DZ: 'ar', // 'الجمهورية الجزائرية الديمقراطية الشعبية', Arabic
    EC: 'es-EC', // 'Ecuador', Spanish (Ecuador)
    EE: 'et', // 'Eesti', Estonian
    EG: 'ar', // 'جمهورية مصر العربية', Arabic
    EH: 'ar', // 'الجمهورية العربية الصحراوية الديمقراطية', Arabic
    ER: 'ti', // 'Eritrea', Tigrinya
    ES: 'es', // 'España', Spanish
    ET: 'am', // 'ኢትዮጵያ', Amharic
    FI: 'fi', // 'Suomi', Finnish
    FJ: 'en', // 'Matanitu Tugalala o Viti', English
    FO: 'fo', // 'Føroyar', Faroese
    FR: 'fr', // 'France', French
    GA: 'fr', // 'Gabon', French
    GB: 'en-GB', // 'United Kingdom', English (Great Britain)
    GD: 'en', // 'Grenada', English
    GE: 'ka', // 'საქართველო', Georgian
    GF: 'fr', // 'Guyane', French (Guyane)
    GG: 'en', // 'Guernsey', English
    GH: 'en', // 'Ghana', English
    GI: 'en', // 'Gibraltar', English
    GL: 'kl', // 'Kalaallit Nunaat', Greenlandic
    GM: 'en', // 'The Gambia', English
    GN: 'fr', // 'Guinée', French
    GP: 'fr', // 'Guadeloupe', French
    GQ: 'es', // 'República de Guinea Ecuatorial', Spanish
    GR: 'el', // 'Ελλάδα', Greek
    GT: 'es-GT', // 'Guatemala', Spanish (Guatemala)
    GU: 'en', // 'Guam', English
    GW: 'pt', // 'Guiné-Bissau', Portuguese
    GY: 'en', // 'Guyana', English
    HK: 'zh-HK', // '香港', Chinese (Hong Kong)
    HN: 'es-HN', // 'Honduras', Spanish (Honduras)
    HR: 'hr', // 'Hrvatska', Croatian
    HT: 'ht', // 'Haïti', Haitian Creole
    HU: 'hu', // 'Magyarország', Hungarian
    IC: 'es-IC', // 'Islas Canarias', Spanish (Canary Islands)
    ID: 'id', // 'Indonesia', Indonesian
    IE: 'en-IE', // 'Ireland', English (Ireland)
    IL: 'he', // 'מְדִינַת יִשְׂרָאֵל', Hebrew
    IM: 'en', // 'Isle of Man', English
    IN: 'hi', // 'भारत', Hindi
    IQ: 'ar', // 'جمهورية العراق', Arabic
    IR: 'fa', // 'جمهوری اسلامی ایران', Persian
    IS: 'is', // 'Ísland', Icelandic
    IT: 'it', // 'Italia', Italian
    JE: 'en', // 'Jersey', English
    JM: 'en-JM', // 'Jamaica', English (Jamaica)
    JO: 'ar', // 'المملكة الأردنية الهاشمية', Arabic
    JP: 'ja', // '日本', Japanese
    KE: 'sw', // 'Kenya', Swahili
    KG: 'ky', // 'Кыргызстан', Kyrgyz
    KH: 'km', // 'កម្ពុជា', Khmer
    KI: 'en', // 'Kiribati', English
    KM: 'ar', // 'Union des Comores', Arabic
    KN: 'en', // 'St. Kitts & Nevis', English
    KP: 'ko-KP', // '조선민주주의인민공화국', Korean (North)
    KR: 'ko-KR', // '대한민국', Korean (South)
    KW: 'ar', // 'دولة الكويت', Arabic
    KY: 'en', // 'Cayman Islands', English
    KZ: 'kk', // 'Қазақстан', Kazakh
    LA: 'lo', // 'ປະເທດລາວ', Lao
    LB: 'ar', // 'الجمهورية اللبنانية', Arabic
    LC: 'en', // 'St. Lucia', English
    LI: 'de-LI', // 'Liechtenstein', German (Liechtenstein)
    LK: 'si', // 'ශ්‍රී ලංකාව', Sinhala
    LR: 'en', // 'Liberia', English
    LS: 'en', // 'Lesotho', English
    LT: 'lt', // 'Lietuva', Lithuanian
    LU: 'fr-LU', // 'Luxembourg', French (Luxembourg)
    LV: 'lv', // 'Latvija', Latvian
    LY: 'ar', // 'دولة ليبيا', Arabic
    MA: 'ar', // 'المملكة المغربية', Arabic
    MC: 'fr-MC', // 'Monaco', French (Monaco)
    MD: 'ro', // 'Republica Moldova', Romanian
    ME: 'sr', // 'Црна Гора', Serbian
    MF: 'fr', // 'Saint Martin', French
    MG: 'mg', // 'Madagasikara', Malagasy
    MH: 'en', // 'Marshall Islands', English
    MK: 'mk', // 'Република Македонија', Macedonian
    ML: 'fr', // 'République du Mali', French
    MM: 'my', // 'မြန်မာ', Burmese
    MN: 'mn', // 'Монгол Улс', Mongolian
    MO: 'zh-MO', // '澳門', Chinese (Macau)
    MP: 'en', // 'Northern Mariana Islands', English
    MQ: 'fr', // 'Martinique', French
    MR: 'ar', // 'الجمهورية الإسلامية الموريتانية', Arabic
    MS: 'en', // 'Montserrat', English
    MT: 'mt', // 'Malta', Maltese
    MU: 'mfe', // 'Mauritius', Mauritian Creole
    MV: 'dv', // 'ދިވެހިރާއްޖޭގެ', Dhivehi
    MW: 'en', // 'Malawi', English
    MX: 'es-MX', // 'México', Spanish (Mexico)
    MY: 'ms', // 'Malaysia', Malay
    MZ: 'pt', // 'Moçambique', Portuguese
    NA: 'en', // 'Namibia', English
    NC: 'fr', // 'Nouvelle-Calédonie', French
    NE: 'fr', // 'République du Niger', French
    NG: 'en', // 'Nigeria', English
    NI: 'es-NI', // 'Nicaragua', Spanish (Nicaragua)
    NL: 'nl-NL', // 'Nederland', Dutch (Netherlands)
    NO: 'no', // 'Norge', Norwegian
    NP: 'ne', // 'नेपाल', Nepali
    NR: 'en', // 'Nauru', English
    NU: 'en', // 'Niue', English
    NZ: 'en-NZ', // 'New Zealand', English (New Zealand)
    OM: 'ar', // 'سلطنة عمان', Arabic
    PA: 'es-PA', // 'Panamá', Spanish (Panama)
    PE: 'es-PE', // 'Perú', Spanish (Peru)
    PF: 'fr-PF', // 'Polynésie française', French (Polynesia)
    PG: 'en', // 'Papua New Guinea', English
    PH: 'en-PH', // 'Philippines', English (Philippines)
    PK: 'ur', // 'پاکستان', Urdu
    PL: 'pl', // 'Polska', Polish
    PM: 'fr', // 'Saint-Pierre-et-Miquelon', French
    PN: 'en', // 'Pitcairn Islands', English
    PR: 'es-PR', // 'Puerto Rico', Spanish (Puerto Rico)
    PT: 'pt', // 'Portugal', Portuguese
    PY: 'gn', // 'Paraguay', Guarani
    QA: 'ar', // 'دولة قطر', Arabic
    RE: 'fr', // 'Réunion', French
    RO: 'ro', // 'România', Romanian
    RS: 'sr', // 'Република Србија', Serbian
    RU: 'ru', // 'Россия', Russian
    RW: 'rw', // 'Rwanda', Kinyarwanda
    SA: 'ar', // 'المملكة العربية السعودية', Arabic
    SB: 'en', // 'Solomon Islands', English
    SC: 'fr', // 'Seychelles', French
    SD: 'ar', // 'جمهورية السودان', Arabic
    SE: 'sv', // 'Sverige', Swedish
    SG: 'zh-SG', // 'Singapore', Chinese (Singapore)
    SH: 'en', // 'Saint Helena', English
    SI: 'sl', // 'Slovenija', Slovenian
    SJ: 'no', // 'Svalbard og Jan Mayen', Norwegian
    SK: 'sk', // 'Slovensko', Slovak
    SL: 'en', // 'Sierra Leone', English
    SM: 'it', // 'San Marino', Italian
    SN: 'fr', // 'Sénégal', French
    SO: 'so', // 'Soomaaliya', Somali
    SR: 'nl', // 'Suriname', Dutch
    SS: 'en', // 'South Sudan', English
    ST: 'pt', // 'São Tomé e Príncipe', Portuguese
    SV: 'es-SV', // 'El Salvador', Spanish (El Salvador)
    SX: 'nl', // 'Sint Maarten', Dutch
    SY: 'ar', // 'الجمهورية العربية السورية', Arabic
    SZ: 'en', // 'Eswatini', English
    TC: 'en', // 'Turks and Caicos Islands', English
    TD: 'fr', // 'Tchad', French
    TG: 'fr', // 'Togo', French
    TH: 'th', // 'ประเทศไทย', Thai
    TJ: 'tg', // 'Тоҷикистон', Tajik
    TK: 'en', // 'Tokelau', English
    TL: 'pt', // 'Timor-Leste', Portuguese
    TM: 'tk', // 'Türkmenistan', Turkmen
    TN: 'ar', // 'الجمهورية التونسية', Arabic
    TO: 'to', // 'Tonga', Tongan
    TR: 'tr', // 'Türkiye', Turkish
    TT: 'en', // 'Trinidad and Tobago', English
    TV: 'en', // 'Tuvalu', English
    TW: 'zh-TW', // '台灣', Chinese (Taiwan)
    TZ: 'sw', // 'Tanzania', Swahili
    UA: 'uk', // 'Україна', Ukrainian
    UG: 'en-UG', // 'Uganda', English (Uganda)
    US: 'en-US', // 'United States of America', English (USA)
    UY: 'es-UY', // 'Uruguay', Spanish (Uruguay)
    UZ: 'uz', // 'Oʻzbekiston', Uzbek
    VA: 'it', // 'Città del Vaticano', Italian
    VC: 'en', // 'Saint Vincent and the Grenadines', English
    VE: 'es-VE', // 'Venezuela', Spanish (Venezuela)
    VG: 'en', // 'British Virgin Islands', English
    VI: 'en', // 'U.S. Virgin Islands', English
    VN: 'vi', // 'Việt Nam', Vietnamese
    VU: 'bi', // 'Vanuatu', Bislama
    WF: 'fr', // 'Wallis et Futuna', French
    WS: 'sm', // 'Samoa', Samoan
    XK: 'sq', // 'Kosovo', Albanian
    YE: 'ar', // 'اليمن', Arabic
    YT: 'fr', // 'Mayotte', French
    ZA: 'af', // 'South Africa', Afrikaans
    ZM: 'en', // 'Zambia', English
    ZW: 'en', // 'Zimbabwe', English
  }

const countriesList = computed(() => {
  return Object.keys(countries).map((key) => {
    return { label: countries[key], value: key }
  })
})

// console.info(countriesList.value)

const locale = computed(() => {
  if (country.value) {
    return countryCodes[country.value]
  }
  return 'en-CA'
})

const formattedMonth = computed(() => {
  const date = new Date(selectedDate.value)
  const formatter = monthFormatter()
  return formatter ? formatter.format(date) + ' ' + date.getFullYear() : ''
})

function monthFormatter() {
  try {
    return new Intl.DateTimeFormat(locale.value || undefined, {
      month: 'long',
      timeZone: 'UTC',
    })
  } catch {
    //
  }
}

const holidaysMap = computed<Holiday[]>(() => {
  // get previous, current and next year so in dec/jan
  // you can see holidays from different years
  return [
    ...new Holidays(country.value).getHolidays(year.value - 1),
    ...new Holidays(country.value).getHolidays(year.value),
    ...new Holidays(country.value).getHolidays(year.value + 1),
  ]
})

function getColor(item: { type: string }) {
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
  const map: Record<string, Event[]> = {}
  if (selectedMonth.length > 0) {
    const start = selectedMonth[0]
    const end = selectedMonth[selectedMonth.length - 1]
    holidaysMap.value
      .filter((item) => {
        const timestamp = parseTimestamp(PARSE_DATE.exec(item.date)![0])
        return isBetweenDates(timestamp!, start!, end!)
      })
      .map((item, index) => ({
        id: index,
        title: item.name,
        details: item.type,
        date: PARSE_DATE.exec(item.date)![0],
        bgColor: getColor(item),
        days: 1,
      }))
      .forEach((event) => {
        ;(map[event.date] = map[event.date] || []).push(event)
        if (event.days !== undefined) {
          let timestamp = parseTimestamp(event.date)
          let days = event.days
          // add a new event for each day, skip the first one which is already added
          while (--days > 0) {
            timestamp = addToDate(timestamp!, { day: 1 })
            if (!map[timestamp.date]) {
              map[timestamp.date] = []
            }
            map[timestamp.date]!.push(event)
          }
        }
      })
  }
  return map
})

function badgeClasses(event: Event, _type: string) {
  return {
    [`text-white bg-${event.bgColor}`]: true,
    'rounded-border': true,
  }
}

function badgeStyles(_event: Event, _type: string) {
  const s = {}
  // s.left = day.weekday === 0 ? 0 : (day.weekday * parsedCellWidth) + '%'
  // s.top = 0
  // s.bottom = 0
  // s.width = (event.days * parsedCellWidth) + '%'
  return s
}

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
  selectedMonth.splice(0, selectedMonth.length, ...data.days)
  // get year of 1st of the month
  for (let index = 0; index < selectedMonth.length; ++index) {
    if (selectedMonth[index]!.day === 1) {
      year.value = selectedMonth[index]!.year
      break
    }
  }
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickDay(data: Timestamp) {
  console.info('onClickDay', data)
}
function onClickWorkweek(data: Timestamp) {
  console.info('onClickWorkweek', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
function onClickHeadWorkweek(data: Timestamp) {
  console.info('onClickHeadWorkweek', data)
}
</script>

<style lang="scss" scoped>
.my-event {
  position: relative;
  font-size: 12px;
  width: 100%;
  margin: 1px 0 0 0;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
}

.my-event .title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 100%;
  width: 100%;
}

.text-white {
  color: white;
}

.bg-blue {
  background: blue;
}

.bg-green {
  background: green;
}

.bg-orange {
  background: orange;
}

.bg-red {
  background: red;
}

.bg-teal {
  background: teal;
}

.bg-grey {
  background: grey;
}

.bg-purple {
  background: purple;
}

.rounded-border {
  border-radius: 2px;
}
</style>
