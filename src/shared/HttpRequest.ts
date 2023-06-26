export class HttpError extends Error {
  constructor(public status: number, body?: any) {
    super("HttpError")
  }
}

export class HttpRequest {
  protected method: string = "GET"
  protected headers: Record<string, string> = {}
  protected body?: string

  constructor(protected url: string) {}

  protected getDefaultHeaders() {
    return {
      accept: "*/*",
    }
  }

  public setMethod(method: string) {
    this.method = method
    return this
  }

  public setHeader(header: string, content: string) {
    this.headers[header] = content
    return this
  }

  public setJSONBody(body: Object) {
    this.headers["content-type"] = "application/json"
    this.body = JSON.stringify(body)
    return this
  }

  public setFormBody(body: URLSearchParams) {
    this.headers["content-type"] = "application/x-www-form-urlencoded"
    this.body = body.toString()
    return this
  }

  private async parseResponse<T>(response: Response) {
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      return (await response.json()) as T
    }

    return await response.text()
  }

  public async send<T>() {
    const response = await fetch(this.url, {
      method: this.method,
      headers: {
        ...this.getDefaultHeaders(),
        ...this.headers,
      },
      ...(this.body && {body: this.body}),
    })

    const body = await this.parseResponse<T>(response)

    if (response.status >= 400) {
      throw new HttpError(response.status, body)
    }

    return {
      response: response,
      body: body,
    }
  }
}
