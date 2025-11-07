import express from 'express'
import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'
import statsRoute from './routes/stats'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config'

const app = express()
const { port } = config

// Middlewares
app.use(helmet())
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use(authRoutes)
app.use(statsRoute)
app.use(taskRoutes)

app.listen(port, () => console.log(`Listening on port ${port}...`))
