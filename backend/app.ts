import express from 'express'
import authRoutes from './routes/auth'
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

app.listen(port, () => console.log(`Listening on port ${port}...`))
