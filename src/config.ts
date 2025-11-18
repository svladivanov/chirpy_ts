import { MigrationConfig } from 'drizzle-orm/migrator'

type APIConfig = {
  fileserverHits: number
  port: number
  plaform: string
  polka: string
}

type DBConfig = {
  url: string
  migrationConfig: MigrationConfig
}

type JWTConfig = {
  defaultDuration: number
  refreshDuration: number
  secret: string
  issuer: string
}

type Config = {
  api: APIConfig
  db: DBConfig
  jwt: JWTConfig
}

process.loadEnvFile()

function envOrThrow(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: './src/db/migrations',
}

export const config: Config = {
  api: {
    fileserverHits: 0,
    port: Number(envOrThrow('PORT')),
    plaform: envOrThrow('PLATFORM'),
    polka: envOrThrow('POLKA_KEY'),
  },
  db: {
    url: envOrThrow('DB_URL'),
    migrationConfig: migrationConfig,
  },
  jwt: {
    defaultDuration: 60 * 60,
    refreshDuration: 60 * 60 * 24 * 60 * 1000,
    secret: envOrThrow('JWT_SECRET'),
    issuer: 'chirpy',
  },
}
