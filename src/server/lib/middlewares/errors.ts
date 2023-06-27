import {NextApiRequest, NextApiResponse} from "next"
import connect from "next-connect"

export interface ErrorResponse {
  error?: string
  message?: string
}

export class ApiError extends Error {
  status: number
  error: string

  constructor(status: number, error: string, message?: string) {
    super(message ?? "")

    this.status = status
    this.error = error
  }
}

export function createRouter() {
  return connect({
    onError: (e, req: NextApiRequest, res: NextApiResponse, next) => {
      if (e instanceof ApiError) {
        return res.status(e.status).json({error: e.error, message: e.message})
      }

      res.status(500).json({error: "Internal Server Error"})
    },
  })
}
