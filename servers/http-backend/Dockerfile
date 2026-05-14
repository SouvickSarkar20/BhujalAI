FROM golang:1.26-alpine AS builder


WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o http-backend .

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/http-backend .

EXPOSE 9001

CMD ["./http-backend"]