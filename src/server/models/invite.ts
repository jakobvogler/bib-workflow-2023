import * as Mongoose from "mongoose"
import {getOrCreateModel} from "../getOrCreateModel"

export interface IInvite extends Mongoose.Document {
  name?: string

  active: boolean

  usages: number
  maxUsages: number

  code: string

  createdAt: Date
  updatedAt: Date
}

export const InviteSchema = new Mongoose.Schema(
  {
    name: {type: String, required: false},

    active: {type: Boolean, required: true},

    usages: {type: Number, required: true},
    maxUsages: {type: Number, required: true},

    code: {type: String, required: true},
  },
  {
    timestamps: true,
  },
)

export function createInviteModel(connection: Mongoose.Connection) {
  return getOrCreateModel<IInvite>("Invite", InviteSchema, connection)
}
