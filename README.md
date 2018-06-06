# The Perch

## Client
### Development server
Development server can be accessed at `http://localhost:4200/`
`ng serve`
### Unit tests
`ng test`
### Build
Builds the client app and stores it in the `dist/client` directory.
`npm run build:client`

## Server
### Build and run
Builds the server app and stores it in the `dist/server` directory.
1. `npm run build:server`
2. `npm run start:server`
3. Access the application on `http://localhost:3001`

To receive webhook POSTs in your local development environment, run `npm run webhook-proxy`
### Unit tests
`npm run test:server`
