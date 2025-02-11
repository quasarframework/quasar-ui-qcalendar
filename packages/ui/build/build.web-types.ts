import { version, resolveToRoot, logError, writeFile, kebabCase } from './build.utils.js'

const resolve = (file: string): string => resolveToRoot('dist/web-types', file)

const alternateUrl = 'https://qcalendar.netlify.app'

interface Api {
  components: Component[]
  directives: Directive[]
  utils: Util[]
}

interface Component {
  api: {
    events?: Record<string, EventApi>
    props?: Record<string, PropApi>
    scopedSlots?: Record<string, SlotApi>
    slots?: Record<string, SlotApi>
    meta: Meta
  }
  name: string
}

interface Directive {
  name: string
  api: {
    modifiers?: Record<string, ModifierApi>
    value: ValueApi
    meta: Meta
  }
}

interface Util {
  name: string
  api: {
    meta: Meta
    methods: Record<string, Method>
  }
}

interface Method {
  addedIn?: string
  desc: string
  params?: Record<string, ParamApi> | null
  returns: ReturnApi
}

interface EventApi {
  params?: Record<string, ParamApi>
  desc: string
  examples?: string[]
}

interface PropApi {
  type: string
  values?: string[]
  category?: string
  required?: boolean
  default?: any
  desc: string
  examples?: string[]
}

interface SlotApi {
  scope?: Record<string, ScopeApi>
  desc: string
  examples?: string[]
}

interface ModifierApi {
  desc: string
  examples?: string[]
}

interface ValueApi {
  type: string
}

interface ParamApi {
  type: string
  tsType?: string
  desc: string
  required?: boolean
  examples?: string[]
}

interface ReturnApi {
  type: string
  tsType?: string
  desc: string
}

interface ScopeApi {
  type: string
  desc: string
  examples?: string[]
}

interface Meta {
  docsUrl?: string
}

function resolveType({ type, values }: { type: string; values?: string[] }): string {
  if (Array.isArray(type)) {
    return type.map((type) => resolveType({ type })).join('|')
  }
  if (type === 'String' && values) {
    return values.map((v) => (v === null ? 'null' : `'${v}'`)).join('|')
  }
  if (['Any', 'String', 'Boolean', 'Number', 'Object'].includes(type)) {
    return type.toLowerCase()
  }
  if (type === 'Array') {
    return 'any[]'
  }
  return type
}

function getDescription(api: { desc: string; examples?: string[] }): string {
  return api.examples ? `${api.desc}\n\nExamples:\n${api.examples.join('\n')}` : api.desc
}

export function generate({ api, compact = false }: { api: Api; compact?: boolean }): void {
  const encodeFn = compact === true ? JSON.stringify : (json: any) => JSON.stringify(json, null, 2)

  try {
    const webtypes = encodeFn({
      $schema: '',
      framework: 'vue',
      name: 'qcalendar',
      version,
      contributions: {
        html: {
          'types-syntax': 'typescript',

          tags: api.components.map(({ api: { events, props, scopedSlots, slots, meta }, name }) => {
            const slotTypes: any[] = []
            if (slots) {
              Object.entries(slots).forEach(([name, slotApi]) => {
                slotTypes.push({
                  name,
                  description: getDescription(slotApi),
                  'doc-url': meta.docsUrl || alternateUrl,
                })
              })
            }

            if (scopedSlots) {
              Object.entries(scopedSlots).forEach(([name, slotApi]) => {
                slotTypes.push({
                  name,
                  'vue-properties':
                    slotApi.scope &&
                    Object.entries(slotApi.scope).map(([name, api]) => ({
                      name,
                      type: resolveType(api),
                      description: getDescription(api),
                      'doc-url': meta.docsUrl || alternateUrl,
                    })),
                  description: getDescription(slotApi),
                  'doc-url': meta.docsUrl || alternateUrl,
                })
              })
            }

            const result: any = {
              name,
              source: {
                module: 'qcalendar',
                symbol: name,
              },
              attributes:
                props &&
                Object.entries(props).map(([name, propApi]) => {
                  const result: any = {
                    name,
                    value: {
                      kind: 'expression',
                      type: resolveType(propApi),
                    },
                    description: getDescription(propApi),
                    'doc-url': meta.docsUrl || alternateUrl,
                  }
                  if (propApi.required) {
                    result.required = true
                  }
                  if (propApi.default) {
                    result.default = JSON.stringify(propApi.default)
                  }
                  if (propApi.type === 'Boolean') {
                    // Deprecated but used for compatibility with WebStorm 2019.2.
                    result.type = 'boolean'
                  }
                  return result
                }),
              events:
                events &&
                Object.entries(events).map(([name, eventApi]) => ({
                  name,
                  arguments:
                    eventApi.params &&
                    Object.entries(eventApi.params).map(([paramName, paramApi]) => ({
                      name: paramName,
                      type: resolveType(paramApi),
                      description: getDescription(paramApi),
                      'doc-url': meta.docsUrl || alternateUrl,
                    })),
                  description: getDescription(eventApi),
                  'doc-url': meta.docsUrl || alternateUrl,
                })),
              slots: slotTypes,
              description: `${name} - QCalendar component`,
              'doc-url': meta.docsUrl || alternateUrl,
            }
            if (
              props &&
              props.value &&
              ((events && events.input) || props.value.category === 'model')
            ) {
              result['vue-model'] = {
                prop: 'value',
                event: 'input',
              }
            }
            Object.entries(result).forEach(([key, v]) => {
              if (!v) {
                delete result[key]
              }
            })

            return result
          }),

          attributes: api.directives.map(({ name, api: { modifiers, value, meta } }) => {
            const valueType = value.type
            const result: any = {
              name: 'v-' + kebabCase(name),
              source: {
                module: 'qcalendar',
                symbol: name,
              },
              required: false,
              description: `${name} - QCalendar directive`,
              'doc-url': meta.docsUrl || alternateUrl,
            }
            if (modifiers) {
              result['vue-modifiers'] = Object.entries(modifiers).map(([name, api]) => ({
                name,
                description: getDescription(api),
                'doc-url': meta.docsUrl || alternateUrl,
              }))
            }
            if (valueType !== 'Boolean') {
              result.value = {
                kind: 'expression',
                type: resolveType(value),
              }
            }
            return result
          }),

          // Add utils section
          utils: api.utils.map(({ api: { meta, methods }, name }) => ({
            name,
            methods: Object.entries(methods).map(([methodName, method]) => ({
              name: methodName,
              addedIn: method.addedIn,
              description: method.desc,
              params:
                method.params &&
                Object.entries(method.params).map(([paramName, param]) => ({
                  name: paramName,
                  type: resolveType(param),
                  description: getDescription(param),
                  'doc-url': meta.docsUrl || alternateUrl,
                })),
              returns: {
                type: resolveType(method.returns),
                description: getDescription(method.returns),
                'doc-url': meta.docsUrl || alternateUrl,
              },
            })),
            'doc-url': meta.docsUrl || alternateUrl,
          })),
        },
      },
    })

    writeFile(resolve('web-types.json'), webtypes)
  } catch (err) {
    logError('build.web-types.ts: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
