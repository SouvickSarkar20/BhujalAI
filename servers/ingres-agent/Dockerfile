FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o ingres-agent .

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/ingres-agent .

EXPOSE 9000

CMD ["./ingres-agent"]