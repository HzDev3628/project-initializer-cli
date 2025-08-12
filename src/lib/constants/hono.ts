export const USER_ROUTE = `import { Hono } from 'hono'

const userRoute = new Hono()

userRoute.get('/', async (c) => {
  return c.json('Already')
})

export { userRoute }
`

const consoleLog = "`Server is running on http://localhost:${info.port}`"
export const INDEX_ROUTE = `import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { userRoute } from '/routers/user.js'

const PORT = 3001

export const app = new Hono()
    .basePath('/api')
    .route('/user', userRoute)

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(${consoleLog})
  },
)
`
