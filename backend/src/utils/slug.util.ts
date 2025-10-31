import { PrismaClient } from '@prisma/client'

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function generateUniqueJobSlug(prisma: PrismaClient, companyName: string, title: string) {
  const companySlug = slugify(companyName)
  const titleSlug = slugify(title)
  const base = `${companySlug}-${titleSlug}`
  
  const existing = await (prisma as any).job.findFirst({ where: { slug: base } })
  if (!existing) return base
  
  let counter = 1
  while (true) {
    const slug = `${base}-${counter}`
    const exists = await (prisma as any).job.findFirst({ where: { slug } })
    if (!exists) return slug
    counter += 1
  }
}

export async function generateUniqueCompanySlug(prisma: any, name: string) {
  const base = slugify(name)
  let slug = base
  let counter = 1

  while (true) {
    const existing = await (prisma as any).company.findFirst({ where: { slug } })
    if (!existing) return slug
    counter += 1
    slug = `${base}-${counter}`
  }
}
