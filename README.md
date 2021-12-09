## SR Challenge
A demo of phone number and email validation

### Prerequisites
- Node.js v14.x LTS
- Docker

### Preparation
Prepare `.env` with below variables

- Client

```
VITE_BACKEND_BASE_URL=
```

- Server

```
NODE_ENV=production
PORT=

VALIDATION_API_URL=http://apilayer.net/api
PHONE_VALIDATION_API_ACCESS_KEY=
EMAIL_VALIDATION_API_ACCESS_KEY=
```

### Local Development
Install dependencies:
```
cd {client|server}
npm install
```

Execute below commands to start with development mode

- Client

```
npm run dev
```

- Server

```
npm run start:dev
```

### Deployment
Execute below commands to start with Docker

- Client


```
cd client
docker build . -t sr-client
docker run -p {port for public}:5000 sr-client
```

- Server

```
cd server
docker build . -t sr-server
docker run -p {port for public}:{port in env} sr-server
```