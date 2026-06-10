import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, PORT } from './config.js'
import { UserRepository } from './user-repository.js'
import cookieParser from 'cookie-parser'

const app = express()

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // ← formularios HTML
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }
  try {
    const data = jwt.verify(token, JWT_SECRET)
    req.session.user = data
  } catch {}
  next()
})

app.get('/', (req, res) => {
  res.render('index', { user: req.session.user })
})

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard')
  res.render('login', { error: null })
})

app.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard')
  res.render('register', { error: null })
})

app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login')
  res.render('dashboard', { user: req.session.user })
})

// ── POST auth ──────────────────────────────────────────────────
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
      })
      .redirect('/dashboard')
  } catch (error) {
    res.render('login', { error: error.message })
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    await UserRepository.create({ username, password })
    res.redirect('/login')
  } catch (error) {
    res.render('register', { error: error.message })
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('access_token').redirect('/')
})

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`)
})
