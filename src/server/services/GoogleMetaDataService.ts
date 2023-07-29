import {HttpRequest} from "../../shared/HttpRequest"

export interface IGetAccessTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

export namespace GoogleMetaDataService {
  export async function getAccessToken() {
    const {body} = await new HttpRequest(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
    )
      .setHeader("Metadata-Flavor", "Google")
      .send<IGetAccessTokenResponse>()

    return body
  }
}
