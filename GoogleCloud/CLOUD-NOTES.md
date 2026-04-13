docker-compose.yml content on Ubuntu

services:
  database:
    image: postgres:16
    container_name: directus-db
    restart: always
    volumes:
      - ./database:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: directus
      POSTGRES_PASSWORD: directus_password_2026
      POSTGRES_DB: directus

  directus:
    image: directus/directus:latest
    container_name: directus-app
    restart: always
    ports:
      - 80:8055
    volumes:
      - ./uploads:/directus/uploads
      - ./extensions:/directus/extensions
    environment:
      KEY: '6d9263a4-8b6b-4e8a-8d1a-7b3b2e5a1c9d'
      SECRET: '9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c'
      DB_CLIENT: 'pg'
      DB_HOST: 'database'
      DB_PORT: '5432'
      DB_DATABASE: 'directus'
      DB_USER: 'directus'
      DB_PASSWORD: 'directus_password_2026'
      ADMIN_EMAIL: 'meet.tamamat@gmail.com'
      ADMIN_PASSWORD: ''