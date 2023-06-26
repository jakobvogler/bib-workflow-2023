import {HttpRequest} from "../shared/HttpRequest"

export class LibraryHttpRequest extends HttpRequest {
  constructor(url: string) {
    super(url)
  }

  protected getDefaultHeaders() {
    return {
      accept: "*/*",
      Host: this.url.replace("https://", "").split("/")[0],
      "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0",
    }
  }

  public setSessionId(sessionId: string) {
    this.setHeader("cookie", "PHPSESSID=" + sessionId)
    return this
  }
}
