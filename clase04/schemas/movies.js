import { z } from 'zod'

export const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
  }),
  year: z.number().int().min(1990).max(2026),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Animation', 'Adventure', 'Crime'], {
      message: 'Genre must be one of the following: Action, Comedy, Drama, Horror, Sci-Fi, Romance'
    })
  )
})

export const validateMovie = (object) => {
  return movieSchema.safeParse(object)
}

export const validatePartialMovie = (object) => {
  return movieSchema.partial().safeParse(object)
}
