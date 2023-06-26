import * as Mongoose from "mongoose"
import {Connection, Document, Schema} from "mongoose"

export function getOrCreateModel<T extends Document>(
  name: string,
  schema: Schema,
  connection: Connection,
): Mongoose.Model<T> {
  let model
  try {
    model = connection.model<T>(name)
  } catch {
    model = connection.model<T>(name, schema)
  }
  return model
}
