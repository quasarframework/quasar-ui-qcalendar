/* global console process */
import path from 'node:path'
import { compileAsync } from 'sass-embedded'
import postcss from 'postcss'
import cssnano from 'cssnano'
import rtl from 'rtlcss'
import autoprefixer from 'autoprefixer'
import { fileURLToPath } from 'node:url'

import buildConf from './config'
import * as buildUtils from './build.utils'

// Convert __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postCssCompiler = postcss([autoprefixer()])
const postCssRtlCompiler = postcss([rtl()])
const nano = postcss([
  cssnano({
    preset: [
      'default',
      {
        mergeLonghand: false,
        convertValues: false,
        cssDeclarationSorter: false,
        reduceTransforms: false,
      },
    ],
  }),
])

const styles = [
  'index',
  'QCalendar',
  'QCalendarAgenda',
  'QCalendarDay',
  'QCalendarMonth',
  'QCalendarResource',
  'QCalendarScheduler',
  'QCalendarTask',
  'QCalendarTransitions',
  'QCalendarVariables',
]

;(async () => {
  try {
    await Promise.all(styles.map((style) => generate(`src/${style}.scss`, `dist/${style}`)))
    console.log('CSS generation completed successfully.')
  } catch (e) {
    console.error('Error during CSS generation:', e)
    process.exit(1)
  }
})()

/**
 * Resolve file paths relative to the project root.
 */
function resolve(_path: string): string {
  return path.resolve(__dirname, '..', _path)
}

/**
 * Generate CSS files for a given source and destination.
 */
async function generate(src: string, dest: string): Promise<void> {
  const resolvedSrc = resolve(src)
  const resolvedDest = resolve(dest)

  try {
    const result = await compileAsync(resolvedSrc, { loadPaths: ['node_modules'] })
    let banner = buildConf.banner + result.css

    const code = await processCss(postCssCompiler, banner)

    await Promise.all([
      writeAndMinifyCss(resolvedDest, code.css),
      processCss(postCssRtlCompiler, code.css).then((rtlCode) =>
        writeAndMinifyCss(resolvedDest, rtlCode.css, '.rtl'),
      ),
    ])
  } catch (err) {
    console.error(`Error processing ${src}:`, err)
    throw err
  }
}

/**
 * Process CSS using a PostCSS compiler.
 */
interface Compiler {
  process(css: string, options: { from: undefined }): Promise<PostCssResult>
}

interface PostCssResult {
  css: string
  warnings(): { toString(): string }[]
}

async function processCss(compiler: Compiler, css: string): Promise<PostCssResult> {
  const result = await compiler.process(css, { from: undefined })
  result.warnings().forEach((warn) => {
    console.warn(warn.toString())
  })
  return result
}

/**
 * Write the CSS file and its minified version.
 */
async function writeAndMinifyCss(dest: string, css: string, ext = '') {
  const filePath = `${dest}${ext}.css`
  await buildUtils.writeFile(filePath, css, true)

  const minified = await nano.process(css, { from: undefined })
  const minFilePath = `${dest}${ext}.min.css`
  await buildUtils.writeFile(minFilePath, minified.css, true)
}
