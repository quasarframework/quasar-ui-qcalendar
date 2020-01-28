process.env.NODE_ENV = 'production'

const parallel = require('os').cpus().length > 1
const runJob = parallel ? require('child_process').fork : require
const { join } = require('path')
const { createFolder } = require('./utils')
const { green, blue } = require('chalk')

console.log()

require('./script.app-ext').syncAppExt()
require('./script.clean.js')

console.log(` 📦 Building ${green('v' + require('../package.json').version)}...${parallel ? blue(' [multi-threaded]') : ''}\n`)

createFolder('dist')
createFolder('dist/api')
createFolder('dist/vetur')

// require('./script.javascript')
// require('./script.css')
runJob(join(__dirname, './script.javascript'))
runJob(join(__dirname, './script.css'))
