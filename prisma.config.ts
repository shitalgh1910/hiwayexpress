import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: (() => {
      const raw = process.env.DATABASE_URL ?? 'file:./dev.db'
      return raw.startsWith('file:')
        ? `file:${path.resolve(raw.replace('file:', ''))}`
        : raw
    })(),
  },
})
