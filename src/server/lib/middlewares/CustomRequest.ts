import {NextApiRequest} from "next"

export interface CustomRequest<body extends any, query extends any, params extends any> extends NextApiRequest {
  body: body
  query: query
  params: params
}
