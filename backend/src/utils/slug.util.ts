import { PrismaClient } from '@prisma/client'

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function generateUniqueJobSlug(prisma: PrismaClient, title: string) {
  const base = slugify(title)
  let slug = base
  let counter = 1

  while (true) {
    const existing = await (prisma as any).job.findFirst({ where: { slug } })
    if (!existing) return slug
    counter += 1
    slug = `${base}-${counter}`
  }
}
