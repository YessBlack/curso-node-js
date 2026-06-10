import DBLocal from 'db-local'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { SALT_ROUNDS } from './config.js'
const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    // 1. validaciones de username (optional: zod)
    Validation.username(username)
    Validation.password(password)

    // 2. ASEGURARSE QUE EL USERNAME NO EXISTE
    const existingUser = User.findOne({ username })
    if (existingUser) throw new Error('Username already exists')

    // 3. CREAR EL USUARIO
    const id = crypto.randomUUID()
    const hashedPasswrord = await bcrypt.hash(password, SALT_ROUNDS)

    User.create({ _id: id, username, password: hashedPasswrord }).save()
    return id
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('Invalid username or password')

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new Error('Invalid username or password')

    const { password: _, ...publicUser } = user
    return publicUser
  }

  static logout () {
    const user = null
    return user
  }
}

class Validation {
  static username (username) {
    // 1. validaciones de username (optional: zod)
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long')
  }
}
