import {connectDatabase} from "@/server/database"
import {ErrorResponse, createRouter} from "@/server/lib/middlewares/errors"
import {GoogleMetaDataService, IGetAccessTokenResponse} from "@/server/services/GoogleMetaDataService"
import {MessageService} from "@/server/services/MessageService"
import type {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"

const router = createRouter()
const {serverRuntimeConfig} = getConfig()

router.get(async (req: NextApiRequest, res: NextApiResponse<any | ErrorResponse>) => {
  const database = await connectDatabase()

  const users = await database.userModel.find({active: true})

  const {access_token} = (await GoogleMetaDataService.getAccessToken()) as IGetAccessTokenResponse

  const jobs = []

  for (const user of users) {
    const request = {
      task: {
        httpRequest: {
          url: serverRuntimeConfig.PERFORMANCE_URL + `/api/permanent-seat/callback?userId=${user._id}`,
          httpMethod: "GET",
        },
      },
    }

    jobs.push(MessageService.publishMessage(request, access_token))
  }

  const promises = await Promise.allSettled(jobs)
  console.log(JSON.stringify(promises))

  res.status(200).json({
    message: "started",
  })
})

export default router
