import { NextResponse } from 'next/server';

export async function GET() {
  const openApiDoc = {
    openapi: '3.0.3',
    info: {
      title: 'LiveCalicut Enterprise API Gateway Specification',
      version: '1.0.0',
      description: 'Public, Merchant, and Admin REST v1 API specification for LiveCalicut digital operating system.',
    },
    servers: [
      {
        url: 'https://livecalicut.in/api/v1',
        description: 'Production API Gateway',
      },
    ],
    paths: {
      '/home': {
        get: {
          summary: 'Get aggregated homepage payload',
          responses: {
            '200': { description: 'Homepage feeds and featured items' },
          },
        },
      },
      '/businesses': {
        get: {
          summary: 'List verified businesses',
          responses: {
            '200': { description: 'Business directory items' },
          },
        },
      },
      '/search': {
        get: {
          summary: 'Universal full-text search query across modules',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
          ],
          responses: {
            '200': { description: 'Universal search hits' },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiDoc);
}
