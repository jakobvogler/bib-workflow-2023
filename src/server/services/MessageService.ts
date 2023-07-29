import getConfig from "next/config"
import {CLOUD_TASKS_BASE_URL} from "../../../config"
import {HttpRequest} from "../../shared/HttpRequest"

const {serverRuntimeConfig} = getConfig()

export interface IPublishMessagePayload {
  task: {
    httpRequest: {
      url: string
      httpMethod: string
    }
  }
}

export namespace MessageService {
  export async function publishMessage(payload: IPublishMessagePayload, access_token: string) {
    const {body} = await new HttpRequest(
      CLOUD_TASKS_BASE_URL +
        `/v2/projects/${serverRuntimeConfig.GCP_PROJECT_ID}/locations/${serverRuntimeConfig.GCP_LOCATION_ID}/queues/${serverRuntimeConfig.CLOUD_TASKS_QUEUE_ID}/tasks`,
    )
      .setMethod("POST")
      .setHeader("Authorization", "Bearer " + access_token)
      .setJSONBody(payload)
      .send<any>()

    return body
  }
}
