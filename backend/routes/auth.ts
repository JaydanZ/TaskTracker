import { Router } from 'express'

const router = Router()

router.post('/login', (req, res) => {
  console.log('Made it!')

  const responseObj = {
    userid: 'success',
    token: 'test123'
  }

  res.send(JSON.stringify(responseObj))
})

router.post('/register', (req, res) => {})

router.post('/logout', (req, res) => {})

router.get('/me', (req, res, next) => {})

export default router
