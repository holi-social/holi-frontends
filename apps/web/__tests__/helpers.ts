import type { IncomingMessage, ServerResponse } from 'http'
import { graphql } from 'msw'
import type { NextPageContext } from 'next'

export const graphqlLink = graphql.link('http://localhost:3000/api/graphql')

export const createPageContextMock = ({ locale = 'en', ...overrides }: Partial<NextPageContext> = {}) => {
  const writeMock = jest.fn()
  const setHeaderMock = jest.fn()
  // @ts-ignore
  const res: ServerResponse<IncomingMessage> = {
    setHeader: setHeaderMock,
    write: writeMock,
    end: jest.fn(),
  }

  const context = { res, locale, ...overrides } as NextPageContext

  return { context, writeMock, setHeaderMock }
}
