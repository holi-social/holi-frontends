# Production image, copy all the files and run next
FROM europe-north1-docker.pkg.dev/holi-shared/docker-hub-remote/node:22-slim

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
RUN cp -r ./apps/web/* ./ && mv ./apps/web/.next ./ && rm -r ./apps/web

# static could also be hosted by a CDN but we include it into
# the container for now for simplicity reasons
COPY ./.next/static ./.next/static
COPY ./server-preload.js ./server-preload.js

RUN chown -R node:node ./.next/

# Needed to mount a bucket for profiling
# RUN mkdir -p /mount && chown -R node:node /mount

USER node

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# This can be used to enable CPU profiling
# CMD [ "sh", "-c", "echo Staring && node --cpu-prof --cpu-prof-dir=/mount/main --require=./server-preload.js server.js"]

CMD ["node", "--initial-heap-size=200", "--max-heap-size=450", "--trace-gc", "--require", "./server-preload.js", "server.js"]
