FROM node:14.15.4-alpine3.11 AS build-deps

RUN adduser -D pintra && \
    mkdir /usr/local/pintra && \
    chown pintra:pintra /usr/local/pintra
USER pintra
WORKDIR /usr/local/pintra

COPY package.json package-lock.json ./
RUN npm ci



FROM node:14.15.4-alpine3.11 AS runtime-deps

RUN adduser -D pintra && \
    mkdir /usr/local/pintra && \
    chown pintra:pintra /usr/local/pintra
USER pintra
WORKDIR /usr/local/pintra

COPY package.json package-lock.json ./
RUN npm ci --only=production



# Rebuild the source code only when needed
# This is where because may be the case that you would try
# to build the app based on some `X_TAG` in my case (Git commit hash)
# but the code hasn't changed.
FROM node:14.15.4-alpine3.11 AS builder

RUN adduser -D pintra && \
    mkdir /usr/local/pintra && \
    chown pintra:pintra /usr/local/pintra
USER pintra

WORKDIR /usr/local/pintra
COPY --chown=pintra:pintra package.json package-lock.json tsconfig.json .eslintrc.js next.config.js /usr/local/pintra/
COPY --chown=pintra:pintra src /usr/local/pintra/src/
COPY --chown=pintra:pintra public /usr/local/pintra/public/
COPY --from=build-deps --chown=pintra:pintra /usr/local/pintra/node_modules ./node_modules
RUN npm run build



# Production image, copy all the files and run next
FROM node:14.15.4-alpine3.11 AS runner

RUN adduser -D pintra && \
    mkdir /usr/local/pintra && \
    chown pintra:pintra /usr/local/pintra
USER pintra

WORKDIR /usr/local/pintra
ENV NODE_ENV=production
COPY --from=runtime-deps --chown=pintra:pintra /usr/local/pintra/node_modules ./node_modules
COPY --from=builder --chown=pintra:pintra /usr/local/pintra/next.config.js ./
COPY --from=builder --chown=pintra:pintra /usr/local/pintra/public ./public
COPY --from=builder --chown=pintra:pintra /usr/local/pintra/.next ./.next
CMD ["node_modules/.bin/next", "start"]
