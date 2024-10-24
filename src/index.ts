import { Hono } from 'hono'
import usersRouter from "./users";


const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/users", usersRouter)



export default app
