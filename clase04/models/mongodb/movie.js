import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = 'mongodb://yessblack:S3ff1Luxy@ac-1ceyt3p-shard-00-00.eexhpjd.mongodb.net:27017,ac-1ceyt3p-shard-00-01.eexhpjd.mongodb.net:27017,ac-1ceyt3p-shard-00-02.eexhpjd.mongodb.net:27017/?ssl=true&replicaSet=atlas-llo7dd-shard-0&authSource=admin&appName=Cluster0'
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

let moviesCollectionPromise

async function connect () {
  if (!moviesCollectionPromise) {
    moviesCollectionPromise = client.connect()
      .then(() => client.db('database').collection('movies'))
      .catch((err) => {
        moviesCollectionPromise = undefined
        throw err
      })
  }

  return moviesCollectionPromise
}

export class MovieModel {
  static async getAll ({ genre }) {
    const collection = await connect()

    if (genre) {
      return collection.find({ genre: { $regex: new RegExp(`^${genre}$`, 'i') } }).toArray()
    }

    return collection.find({}).toArray()
  }

  static async getById ({ id }) {
    const collection = await connect()
    return collection.findOne({ _id: id })
  }

  static async create ({ input }) {
    const collection = await connect()

    const { insertedId } = await collection.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async update ({ id, input }) {
    const collection = await connect()
    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: input },
      { returnDocument: 'after' }
    )

    if (!result || !result.value) return false
    return result.value
  }

  static async delete ({ id }) {
    const collection = await connect()
    const { deletedCount } = await collection.deleteOne({ _id: id })
    return deletedCount > 0
  }
}
