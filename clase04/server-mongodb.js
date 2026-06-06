import { createApp } from './app'
import { MovieModel } from './models/mongodb/movie'

createApp({ movieModel: MovieModel })
