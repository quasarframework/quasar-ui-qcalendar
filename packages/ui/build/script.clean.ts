/*global console */
import { rimrafSync } from 'rimraf'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

rimrafSync(path.resolve(__dirname, '../dist'))
console.log(' 💥 Cleaned build artifacts.\n')
