import { h, ref, type Ref, type PropType, type VNode, defineComponent } from 'vue'
import { QBadge, QBtn, Notify, QBtnToggle } from 'quasar'
import { copyToClipboard } from './markdown-utils'
import { mdiMinusBox, mdiPlusBox } from '@quasar/extras/mdi-v7'

/**
 * This function copies a given property name to the clipboard.
 * It also displays a notification to the user confirming the successful copy.
 *
 * @param propName - The name of the property to be copied.
 * @returns {void} - This function does not return any value.
 */
function copyPropName(propName: string): void {
  copyToClipboard(propName)

  Notify.create({
    message: `"${propName}" has been copied to clipboard.`,
    position: 'top',
    actions: [{ icon: 'cancel', color: 'white', dense: true, round: true }],
    timeout: 2000,
  })
}

/**
 * Generates a string representation of event parameters for a given event object.
 *
 * @param event - An object containing event information.
 * @param event.params - An optional record of parameter names and their corresponding types.
 *                       If undefined, null, or empty, an empty string is used for parameters.
 *
 * @returns A string representation of the event parameters in the format "(param1, param2, ...) => void".
 *          If no parameters are present, it returns "() => void".
 */
function getEventParams(event: { params?: Record<string, any> | null }): string {
  const params =
    event.params === void 0 || event.params === null || event.params.length === 0
      ? ''
      : Object.keys(event.params).join(', ')

  return `(${params}) => void`
}

/**
 * Generates a string representation of method parameters.
 *
 * This function takes a method object and an optional flag to determine how to format the parameters.
 * It handles cases where there are no parameters, all parameters are required, or there's a mix of required and optional parameters.
 *
 * @param method - An object containing information about the method.
 * @param method.params - A record of parameter names and their corresponding details. Can be undefined, null, or empty.
 * @param noRequired - A boolean flag. If true, all parameters are treated as required. If false or undefined, the function distinguishes between required and optional parameters.
 *
 * @returns A string representation of the method parameters enclosed in parentheses.
 *          - Returns " ()" if there are no parameters.
 *          - If noRequired is true, returns all parameters joined by commas.
 *          - If noRequired is false or undefined, optional parameters are suffixed with "?".
 */
function getMethodParams(
  method: { params?: Record<string, any> | null },
  noRequired?: boolean,
): string {
  if (method.params === void 0 || method.params === null || method.params.length === 0) {
    return ' ()'
  }

  if (noRequired === true) {
    return ` (${Object.keys(method.params).join(', ')})`
  }

  const params = Object.keys(method.params)
  const optionalIndex = params.findIndex(
    (param) => method.params && method.params[param]?.required !== true,
  )

  const str =
    optionalIndex !== -1
      ? params.slice(0, optionalIndex).join(', ') +
        (optionalIndex < params.length
          ? (optionalIndex > 0 ? ', ' : '') + params.slice(optionalIndex).join('?, ') + '?'
          : '')
      : params.join(', ')

  return ' (' + str + ')'
}

/**
 * Generates a string representation of a method's return value.
 *
 * @param method - An object containing information about the method.
 * @param method.returns - An optional object containing the return type information.
 *                         If undefined or null, the method is considered to return void.
 * @param method.returns.type - The type of the return value.
 *
 * @returns A string representation of the method's return value,
 *          prefixed with " => ". If no return value is specified,
 *          it returns " => void".
 */
function getMethodReturnValue(method: { returns?: { type: any } | null }): string {
  return (
    ' => ' +
    (method.returns === void 0 || method.returns === null
      ? 'void'
      : getStringType(method.returns.type))
  )
}

/**
 * Converts a type value to its string representation.
 *
 * @param type - The type value to convert. Can be an array of types or a single type.
 * @returns A string representation of the type. If the input is an array, it joins the types with ' | '.
 */
function getStringType(type: any): string {
  return Array.isArray(type) ? type.join(' | ') : type
}

const NAME_PROP_COLOR = ['orange-8', 'brand-primary', 'green-5', 'purple-5']
const NAME_PROP_COLOR_LEN = NAME_PROP_COLOR.length

/**
 * Creates a div element with specific classes and content for use in a markdown API entry.
 *
 * @param col - The number of columns the div should span on small screens and above.
 * @param propName - The name of the property to be displayed in the div.
 * @param propValue - Optional. The value of the property to be displayed. If undefined, the slot will be used instead.
 * @param slot - Optional. A slot to be used for custom content when propValue is undefined.
 * @returns A VNode representing the created div element.
 */
function getDiv(col: number, propName: string, propValue?: string, slot?: any): VNode {
  return h('div', { class: `markdown-api-entry__item col-xs-12 col-sm-${col}` }, [
    h('div', { class: 'markdown-api-entry__type' }, propName),
    propValue !== void 0
      ? h('div', { class: 'markdown-api-entry__value' }, parseForInlineCode(propValue))
      : slot,
  ])
}

/**
 * Creates a div element representing a name entry in the markdown API documentation.
 * This function generates a complex div structure with badges and labels for API properties.
 *
 * @param prop - An object containing property information. It may include 'required' and 'addedIn' fields.
 * @param label - The main text label for the property.
 * @param level - A number indicating the nesting level of the property, used for color selection.
 * @param suffix - Optional. Additional text to be appended after the main label.
 * @param prefix - Optional. Text to be prepended before the main label.
 * @returns A VNode representing the constructed div element for the name entry.
 */
function getNameDiv(
  prop: any,
  label: string,
  level: number,
  suffix?: string,
  prefix?: string,
): VNode {
  const child: VNode[] = []

  if (prefix !== void 0) {
    child.push(h('div', { class: 'markdown-api-entry__type q-mr-xs' }, prefix))
  }

  child.push(
    h(QBadge, {
      class: 'markdown-api-entry__pill cursor-pointer',
      label,
      color: NAME_PROP_COLOR[level % NAME_PROP_COLOR_LEN],
      onClick: () => {
        copyPropName(label)
      },
    }),
  )

  const suffixLabel = `${suffix ? ` : ${suffix}` : ''}${prop.required ? ' - required!' : ''}`
  if (suffixLabel !== '') {
    child.push(h('div', { class: 'markdown-api-entry__type q-ml-xs' }, suffixLabel))
  }

  if (prop.addedIn !== void 0) {
    child.push(
      h(QBadge, {
        class: 'q-ml-sm markdown-api-entry__added-in',
        outline: true,
        label: prop.addedIn + '+',
      }),
    )
  }

  return h('div', { class: 'markdown-api-entry__item col-xs-12 col-sm-12 row items-center' }, child)
}

/**
 * Creates an expandable section for API documentation.
 *
 * This function generates a VNode array representing an expandable section
 * in the API documentation. It includes a description and, if expandable,
 * a toggle button to show/hide additional details.
 *
 * @param openState - A reactive reference to an object tracking the open state of expandable sections.
 * @param desc - The description text to be displayed.
 * @param isExpandable - A boolean indicating whether the section should be expandable.
 * @param key - A unique key for this expandable section, used to track its open state.
 * @param getDetails - A function that returns an array of additional details to be shown when expanded.
 * @returns An array of VNodes representing the expandable section.
 */
function getExpandable(
  openState: Ref<Record<string, boolean>>,
  desc: string,
  isExpandable: boolean,
  key: string,
  getDetails: () => any[],
): VNode[] {
  if (isExpandable === true) {
    const expanded = openState.value[key] === true
    const child = [
      h('div', { class: 'markdown-api-entry__item col-xs-12 col-sm-12' }, [
        h('div', { class: 'markdown-api-entry__type row items-center no-wrap' }, [
          h('span', 'Description'),
          h(QBtn, {
            class: 'markdown-api-entry__expand-btn header-btn',
            flat: true,
            size: '11px',
            padding: '1px',
            icon: expanded === true ? mdiMinusBox : mdiPlusBox,
            onClick: () => {
              openState.value[key] = expanded === false
            },
          }),
        ]),
        h('div', { class: 'markdown-api-entry__value' }, parseForInlineCode(desc)),
      ]),
    ]

    return expanded === true ? child.concat(getDetails()) : child
  } else {
    return [getDiv(12, 'Description', desc)]
  }
}

/**
 * Parses a string for inline code segments and converts them into VNodes with special styling.
 *
 * This function splits the input string by backticks and creates VNodes for code segments.
 * Text outside of backticks is left as plain strings.
 *
 * @param code - The input string containing potential inline code segments delimited by backticks.
 * @returns An array of VNodes and strings, where code segments are wrapped in styled span elements.
 */
function parseForInlineCode(code: string) {
  const parts = code.split(/(`[^`]+`)/g)
  return parts.map((part) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return h('span', { class: 'markdown-token' }, part.slice(1, -1))
    } else {
      return part
    }
  })
}

/**
 * Generates detailed property information for API documentation.
 *
 * This function creates a series of VNodes that represent various aspects of a property,
 * including its synchronization status, default value, external links, accepted values,
 * nested properties, parameters, return types, scope, and examples.
 *
 * @param openState - A reactive reference to an object tracking the open state of expandable sections.
 * @param masterKey - A unique identifier for the property, used in generating child keys.
 * @param prop - The property object containing all the details to be displayed.
 * @param level - The nesting level of the property, used for styling and indentation.
 * @returns An array of VNodes representing the detailed property information.
 */
function getPropDetails(
  openState: Ref<Record<string, boolean>>,
  masterKey: string,
  prop: any,
  level: number,
): VNode[] {
  const details: VNode[] = []

  if (prop.sync === true) {
    details.push(getDiv(3, 'Note', 'Required to be used with v-model!'))
  }

  if (prop.default !== void 0) {
    details.push(
      getDiv(
        3,
        'Default value',
        void 0,
        h(
          'div',
          { class: 'markdown-api-entry--indent markdown-api-entry__value' },
          h('div', { class: 'markdown-token' }, '' + prop.default),
        ),
      ),
    )
  }

  if (prop.link === true) {
    details.push(getDiv(6, 'External link', prop.link))
  }

  if (prop.values !== void 0) {
    details.push(
      getDiv(
        12,
        'Accepted values',
        void 0,
        h(
          'div',
          { class: 'markdown-api-entry--indent markdown-api-entry__value' },
          prop.values.map((val: any) => h('div', { class: 'markdown-token' }, '' + val)),
        ),
      ),
    )
  }

  if (prop.definition !== void 0) {
    const nodes: VNode[] = []
    for (const propName in prop.definition) {
      nodes.push(...getProp(openState, masterKey, prop.definition[propName], propName, level))
    }

    details.push(
      getDiv(12, 'Props', void 0, h('div', { class: 'markdown-api-entry__subitem' }, nodes)),
    )
  }

  if (prop.params !== void 0 && prop.params !== null) {
    const nodes: VNode[] = []

    for (const propName in prop.params) {
      nodes.push(...getProp(openState, masterKey, prop.params[propName], propName, level))
    }

    details.push(
      getDiv(12, 'Params', void 0, h('div', { class: 'markdown-api-entry__subitem' }, nodes)),
    )
  }

  if (prop.returns !== void 0 && prop.returns !== null) {
    details.push(
      getDiv(
        12,
        `Return type: ${getStringType(prop.returns.type)}`,
        void 0,
        h('div', { class: 'markdown-api-entry__subitem' }, [
          getProp(openState, masterKey, prop.returns, void 0, level),
        ]),
      ),
    )
  }

  if (prop.scope !== void 0) {
    const nodes: VNode[] = []
    for (const propName in prop.scope) {
      nodes.push(...getProp(openState, masterKey, prop.scope[propName], propName, level))
    }

    details.push(
      getDiv(12, 'Scope', void 0, h('div', { class: 'markdown-api-entry__subitem' }, nodes)),
    )
  }

  if (prop.examples !== void 0) {
    details.push(
      getDiv(
        12,
        `Example${prop.examples.length > 1 ? 's' : ''}`,
        void 0,
        h(
          'div',
          { class: 'markdown-api-entry--indent markdown-api-entry__value' },
          prop.examples.map((example: any) => h('div', { class: 'markdown-token' }, '' + example)),
        ),
      ),
    )
  }

  return details
}

/**
 * Generates VNodes for a property in the API documentation.
 *
 * This function creates a detailed representation of a property, including its name,
 * type, description, and any additional details. It handles configuration toggles,
 * expandable sections, and nested properties.
 *
 * @param openState - A reactive reference to an object tracking the open state of expandable sections.
 * @param masterKey - A unique identifier for the property, used in generating child keys.
 * @param prop - The property object containing all the details to be displayed.
 * @param propName - The name of the property. If undefined, the property is treated as a nested or unnamed property.
 * @param level - The nesting level of the property, used for styling and indentation.
 * @param onlyChildren - If true, only child elements are returned without wrapping them in a container.
 * @returns An array of VNodes representing the property and its details.
 */
function getProp(
  openState: Ref<Record<string, boolean>>,
  masterKey: string,
  prop: any,
  propName: string | undefined,
  level: number,
  onlyChildren?: boolean,
): VNode[] {
  const configToggle = useConfigToggle(openState)
  if (configToggle.enabled && configToggle.type === 'configFile' && prop.configFileType === null) {
    return [] // empty array
  }

  const rawType = configToggle.enabled
    ? configToggle.type === 'configFile'
      ? prop.configFileType || prop.type
      : prop.type
    : prop.type
  const type = getStringType(rawType)
  const child: VNode[] = []

  if (propName !== void 0) {
    const suffix =
      type === 'Function' ? `${getMethodParams(prop, true)}${getMethodReturnValue(prop)}` : type

    child.push(getNameDiv(prop, propName, level, suffix))

    if (prop.reactive === true) {
      child.push(getDiv(3, 'Reactive', 'yes'))
    }
  }

  const isExpandable =
    prop.sync === true ||
    prop.default !== void 0 ||
    prop.link === true ||
    prop.values !== void 0 ||
    prop.definition !== void 0 ||
    (prop.params !== void 0 && prop.params !== null) ||
    (prop.returns !== void 0 && prop.returns !== null) ||
    prop.scope !== void 0 ||
    prop.examples !== void 0

  const childKey = `${masterKey}|||prop|${prop.type}|${propName}|${level}`

  child.push(
    ...getExpandable(openState, prop.desc, isExpandable, childKey, () =>
      getPropDetails(openState, childKey, prop, level + 1),
    ),
  )

  return onlyChildren !== true ? [h('div', { class: 'markdown-api-entry row' }, child)] : child
}

const describe: Record<string, any> = {}

const describePropsLike =
  (masterKey: string) => (openState: Ref<Record<string, boolean>>, props: any) => {
    const child: VNode[] = []

    for (const propName in props) {
      child.push(...getProp(openState, masterKey, props[propName], propName, 0))
    }

    return child
  }
describe.props = describePropsLike('props')
describe.computedProps = describePropsLike('computedProps')
describe.slots = describePropsLike('slots')

/**
 * Generates VNodes for event descriptions in the API documentation.
 *
 * This function creates a detailed representation of events, including their names,
 * parameters, and descriptions. It handles expandable sections for each event
 * and generates child elements for event parameters.
 *
 * @param openState - A reactive reference to an object tracking the open state of expandable sections.
 * @param events - An object containing event definitions. Each key is an event name,
 *                 and the value is an object describing the event.
 * @returns An array of VNodes representing the events and their details.
 */
describe.events = (openState: Ref<Record<string, boolean>>, events: any): VNode[] => {
  const child: VNode[] = []

  if (events === void 0) {
    return child
  }

  for (const eventName in events) {
    const event = events[eventName]
    const masterKey = `event|${eventName}`

    child.push(
      h('div', { class: 'markdown-api-entry row' }, [
        getNameDiv(event, `@${eventName}`, 0, getEventParams(event)),

        ...getExpandable(
          openState,
          event.desc,
          event.params !== void 0 && event.params !== null,
          masterKey,
          () => {
            const params: VNode[] = []

            for (const paramName in event.params) {
              params.push(...getProp(openState, masterKey, event.params[paramName], paramName, 1))
            }

            return [
              getDiv(
                12,
                'Parameters',
                void 0,
                h('div', { class: 'markdown-api-entry__subitem' }, params),
              ),
            ]
          },
        ),
      ]),
    )
  }

  return child
}

/**
 * Generates VNodes for method descriptions in the API documentation.
 *
 * This function creates a detailed representation of methods, including their names,
 * parameters, return types, and descriptions. It handles expandable sections for each method
 * and generates child elements for method parameters and return values.
 *
 * @param openState - A reactive reference to an object tracking the open state of expandable sections.
 * @param methods - An object containing method definitions. Each key is a method name,
 *                  and the value is an object describing the method.
 * @returns An array of VNodes representing the methods and their details.
 */
describe.methods = (openState: Ref<Record<string, boolean>>, methods: any) => {
  const child: VNode[] = []

  for (const methodName in methods) {
    const method = methods[methodName]
    const masterKey = `method|${methodName}`

    const alias = method.alias ? `Alias: "${method.alias}"; ` : ''
    const desc = `${alias}${method.desc}`

    const methodNode = h('div', { class: 'markdown-api-entry row' }, [
      getNameDiv(
        method,
        methodName,
        0,
        `${getMethodParams(method)}${getMethodReturnValue(method)}`,
      ),

      ...getExpandable(
        openState,
        desc,
        method.params !== void 0 || method.returns !== void 0,
        masterKey,
        () => {
          const nodes: VNode[] = []

          if (method.params !== void 0 && method.params !== null) {
            const props: VNode[] = []
            for (const paramName in method.params) {
              props.push(...getProp(openState, masterKey, method.params[paramName], paramName, 1))
            }
            nodes.push(
              getDiv(
                12,
                'Parameters',
                void 0,
                h('div', { class: 'markdown-api-entry__subitem' }, props),
              ),
            )
          }

          if (method.returns !== void 0 && method.returns !== null) {
            nodes.push(
              getDiv(
                12,
                `Return type: ${getStringType(method.returns.type)}`,
                void 0,
                h('div', { class: 'markdown-api-entry__subitem' }, [
                  getProp(openState, masterKey, method.returns, void 0, 1),
                ]),
              ),
            )
          }

          return nodes
        },
      ),
    ])

    child.push(methodNode)
  }

  return child
}

/**
 * Generates VNodes for describing a value in the API documentation.
 *
 * This function creates a detailed representation of a value, including its type
 * and any additional properties. It uses the 'getDiv' and 'getProp' helper functions
 * to generate the necessary VNodes.
 *
 * @param openState - A reactive reference to an object tracking the open state of expandable sections.
 *                    This is used to manage the state of collapsible content.
 * @param value - An object containing the details of the value to be described.
 *                It should include at least a 'type' property.
 * @returns An array of VNodes representing the value description, wrapped in a div
 *          with the class 'markdown-api-entry row'.
 */
describe.value = (openState: Ref<Record<string, boolean>>, value: any): VNode[] => {
  return [
    h(
      'div',
      { class: 'markdown-api-entry row' },
      [getDiv(12, 'Type', getStringType(value.type))].concat(
        ...(getProp(openState, 'value', value, void 0, -1, true) || []),
      ),
    ),
  ]
}

/**
 * Generates VNodes for describing an argument in the API documentation.
 *
 * This function creates a detailed representation of an argument, including its type
 * and any additional properties. It uses the 'getDiv' and 'getProp' helper functions
 * to generate the necessary VNodes.
 *
 * @param openState - A reactive reference to an object tracking the open state of expandable sections.
 *                    This is used to manage the state of collapsible content.
 * @param arg - An object containing the details of the argument to be described.
 *              It should include at least a 'type' property.
 * @returns An array containing a single VNode representing the argument description,
 *          wrapped in a div with the class 'markdown-api-entry row'.
 */
describe.arg = (openState: Ref<Record<string, boolean>>, arg: any): VNode[] => {
  return [
    h(
      'div',
      { class: 'markdown-api-entry row' },
      [getDiv(12, 'Type', getStringType(arg.type))].concat(
        getProp(openState, 'arg', arg, void 0, -1, true),
      ),
    ),
  ]
}

/**
 * Generates VNodes for describing modifiers in the API documentation.
 *
 * This function creates a detailed representation of modifiers, including their names
 * and properties. It iterates through the provided modifiers and generates
 * a VNode for each one using the 'getProp' helper function.
 *
 * @param openState - A reactive reference to an object tracking the open state of expandable sections.
 *                    This is used to manage the state of collapsible content.
 * @param modifiers - An object containing modifier definitions. Each key is a modifier name,
 *                    and the value is an object describing the modifier.
 * @returns An array of VNodes representing the modifiers and their details,
 *          each wrapped in a div with the class 'markdown-api-entry row'.
 */
describe.modifiers = (openState: Ref<Record<string, boolean>>, modifiers: any): VNode[] => {
  const child: VNode[] = []

  for (const modifierName in modifiers) {
    const modifier = modifiers[modifierName]

    child.push(
      h(
        'div',
        { class: 'markdown-api-entry row' },
        getProp(openState, 'modifiers', modifier, modifierName, 0, true),
      ),
    )
  }

  return child
}

/**
 * Generates a VNode array for describing an injection in the API documentation.
 *
 * This function creates a single div element containing the injection's name and details.
 *
 * @param _ - A Ref object containing a record of boolean values. This parameter is not used in the function.
 * @param injection - An object containing the details of the injection to be described.
 * @returns An array containing a single VNode representing the injection description,
 *          wrapped in a div with the class 'markdown-api-entry row'.
 */
describe.injection = (_: Ref<Record<string, boolean>>, injection: any): VNode[] => {
  return [h('div', { class: 'markdown-api-entry row' }, [getNameDiv(injection, injection, 0)])]
}

/**
 * Creates a configuration toggle object for managing UI and config file options.
 *
 * This function generates an object with properties and methods to handle
 * the state of configuration options, allowing toggling between UI config
 * and config file modes.
 *
 * @param openState - A reactive reference to an object containing boolean values
 *                    representing the open state of various UI elements.
 *                    The `quasarConfOptions` property is used to determine
 *                    the current configuration mode.
 *
 * @returns An object with the following properties:
 *   - enabled: A boolean indicating whether configuration options are available.
 *   - type: A string representing the current configuration mode ('uiConfig' or 'configFile').
 *   - setType: A function to update the configuration mode.
 */
function useConfigToggle(openState: Ref<Record<string, boolean>>) {
  return {
    enabled: openState.value.quasarConfOptions !== undefined,
    type: openState.value.quasarConfOptions ? 'uiConfig' : 'configFile',
    setType: (type: string) => {
      openState.value.quasarConfOptions = type === 'uiConfig'
    },
  }
}

/**
 * Generates VNodes for describing Quasar configuration options in the API documentation.
 *
 * This function creates a detailed representation of Quasar configuration options,
 * including their names, types, and descriptions. It handles both UI config and
 * config file modes, and generates appropriate UI elements for each.
 *
 * @param openState - A reactive reference to an object tracking the open state of expandable sections.
 *                    It also contains information about the current configuration mode.
 * @param conf - An object containing the configuration options to be described.
 *               It should include properties like 'propName', 'type', 'desc', and 'definition'.
 *
 * @returns An array containing a single VNode representing the configuration options description,
 *          wrapped in a div with the class 'markdown-api-entry row'.
 */
describe.quasarConfOptions = (openState: Ref<Record<string, boolean>>, conf: any): VNode[] => {
  const configToggle = useConfigToggle(openState)

  if (configToggle.enabled === false) {
    const needsConfigToggle =
      conf.definition &&
      Object.values(conf.definition).some(
        (value) => (value as { configFileType: any }).configFileType !== undefined,
      )
    if (needsConfigToggle) {
      openState.value.quasarConfOptions = false
    }
  }

  const configFileName = () =>
    getNameDiv(conf, conf.propName, 0, 'quasar.config file > framework > config > ')
  const uiConfigName = () =>
    getNameDiv(conf, conf.propName, 0, '... }})', 'app.use(Quasar, { config: { ')

  const entry = configToggle.enabled
    ? [
        configToggle.type === 'configFile' ? configFileName() : uiConfigName(),
        getDiv(8, 'Type', getStringType(conf.configFileType || conf.type || 'Object')),
        h('div', { class: 'markdown-api-entry__item col row justify-end items-center' }, [
          h(QBtnToggle, {
            modelValue: configToggle.type,
            'onUpdate:modelValue': configToggle.setType,
            options: [
              { label: 'quasar.config file', value: 'configFile' },
              { label: 'UI config', value: 'uiConfig' },
            ],
            noCaps: true,
            rounded: true,
            outline: true,
            toggleColor: 'orange-8',
          }),
        ]),
      ]
    : [configFileName(), uiConfigName(), getDiv(12, 'Type', getStringType(conf.type || 'Object'))]

  if (conf.desc) {
    entry.push(getDiv(12, 'Description', conf.desc))
  }

  entry.push(getPropDetails(openState, 'quasarConfOptions', conf, 0) as unknown as VNode)

  if (conf.definition && Object.keys(conf.definition).length === 0) {
    entry.push(
      h('div', { class: 'q-pa-md markdown-api__nothing-to-show' }, [
        h('div', 'No matching props found.'),
        h(
          'div',
          'Please check the other tabs/subtabs with a number badge on their label or refine the filter.',
        ),
      ]),
    )
  }

  return [h('div', { class: 'markdown-api-entry row' }, entry)]
}

export default defineComponent({
  name: 'DocApiEntry',

  props: {
    type: {
      type: String as PropType<string>,
      required: true,
    },
    definition: {
      type: [Object, String] as PropType<Record<string, any> | string>,
      required: true,
    },
  },

  setup(props) {
    const openState = ref<Record<string, any>>({})

    return () => {
      const content =
        Object.keys(props.definition).length !== 0
          ? describe[props.type](openState, props.definition)
          : [
              h('div', { class: 'q-pa-md markdown-api__nothing-to-show' }, [
                h('div', 'No matching entries found on this tab.'),
                h(
                  'div',
                  'Please check the other tabs/subtabs with a number badge on their label or refine the filter.',
                ),
              ]),
            ]

      return h('div', { class: 'markdown-api-entrys' }, content)
    }
  },
})
