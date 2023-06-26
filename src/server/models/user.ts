import * as Mongoose from "mongoose"
import {getOrCreateModel} from "../getOrCreateModel"

export interface IUser extends Mongoose.Document {
  email: string
  password: string

  active: boolean

  libraryIdentifier?: string
  libraryPassword?: string

  permanentSeat?: string

  createdAt: Date
  updatedAt: Date
}

export const UserSchema = new Mongoose.Schema(
  {
    email: {type: String, required: true},
    password: {type: String, required: true},

    active: {type: Boolean, default: false, required: true},

    libraryIdentifier: {type: String, required: false},
    libraryPassword: {type: String, required: false},

    permanentSeat: {type: String, required: false},
  },
  {
    timestamps: true,
  },
)

export function createUserModel(connection: Mongoose.Connection) {
  return getOrCreateModel<IUser>("User", UserSchema, connection)
}
