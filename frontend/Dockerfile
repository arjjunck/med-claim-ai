# Build (static output, so it runs natively on the build machine)
FROM --platform=$BUILDPLATFORM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Same-origin by default: nginx forwards /api to API_UPSTREAM (see templates/)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Serve
FROM nginx:1.27-alpine
COPY templates/ /etc/nginx/templates/
ENV API_UPSTREAM=http://api:8080
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
