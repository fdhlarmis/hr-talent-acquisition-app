FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm install
COPY . .
WORKDIR /app/backend
CMD ["npm", "run", "start"]
