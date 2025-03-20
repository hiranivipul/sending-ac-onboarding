# Use the official Go image as the base image
FROM golang:1.23-alpine AS Base

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the entire project
COPY . .

# Build the Go application
RUN go build -o /app/main .

FROM golang:1.23-alpine

WORKDIR /app

RUN apk add curl

COPY --from=base /app/main .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["/app/main"]