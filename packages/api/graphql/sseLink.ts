import { ApolloLink, type FetchResult, Observable, type Operation } from '@apollo/client'
import { type Client, type ClientOptions, createClient } from 'graphql-sse'
import { print } from 'graphql'

export class SSELink extends ApolloLink {
  private client: Client

  constructor(options: ClientOptions) {
    super()
    this.client = createClient(options)
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: (result) => {
            sink.next({
              data: result.data,
              errors: result.errors,
              extensions: result.extensions ?? undefined,
            })
          },
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        }
      )
    })
  }
}
