import * as Mongoose from "mongoose"
import getConfig from "next/config"
import {IUser, createUserModel} from "./models/user"

export interface IDatabase {
  userModel: Mongoose.Model<IUser>
  connection: Mongoose.Connection
}

const {serverRuntimeConfig} = getConfig()

Mongoose.set("strictQuery", true)

const connection = Mongoose.createConnection(serverRuntimeConfig.MONGO_URI)

connection.on("error", (err) => {
  throw err
})

export async function connectDatabase() {
  await new Promise<void>((resolve) => {
    if (connection.readyState === 1) {
      resolve()
    }

    connection?.once("open", () => {
      console.log("Connected to database!")
      resolve()
    })
  })

  return {
    userModel: createUserModel(connection),
    connection: connection,
  }
}
