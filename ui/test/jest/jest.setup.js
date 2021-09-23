jest.setTimeout(50000)

setTimeout(() => {
  // do nothing
}, 1)

require('dotenv').config({ path: '.env.jest' })
