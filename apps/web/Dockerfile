# Production image, copy all the files and run next
FROM node:16-alpine

WORKDIR /app

ENV NODE_ENV production

COPY ./next.config.js ./
COPY ./public ./public
COPY ./package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY ./.next/standalone ./

# due to our monorepo, server.js and other files "accidentally"
# are placed in apps/web, so we move them back to the root
RUN mv ./apps/web/* ./ && mv ./apps/web/.next ./

# static could also be hosted by a CDN but we include it into
# the container for now for simplicity reasons
COPY ./.next/static ./.next/static

RUN chown -R node:node ./.next/

USER node

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "server.js"]