const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function updateCompanySlugs() {
  console.log('📦 Fetching companies without slugs...');
  
  // Fetch all companies — user confirmed no records have slugs, so
  // we can update every record without filtering.
  const companies = await prisma.company.findMany();

  console.log(`Found ${companies.length} companies to update`);

  for (const company of companies) {
    const baseSlug = slugify(company.name);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.company.findFirst({
        where: { 
          slug,
          id: { not: company.id }
        }
      });

      if (!existing) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.company.update({
      where: { id: company.id },
      data: { slug }
    });

    console.log(`✅ Updated company: ${company.name} -> ${slug}`);
  }

  console.log('✨ Company slugs updated successfully!\n');
}

async function updateJobSlugs() {
  console.log('💼 Fetching jobs without slugs...');
  
  // Fetch all jobs (ordered by creation time). We'll set slugs for every job.
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  });

  console.log(`Found ${jobs.length} jobs to update`);

  for (const job of jobs) {
    const baseSlug = slugify(job.title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.job.findFirst({
        where: { 
          slug,
          id: { not: job.id }
        }
      });

      if (!existing) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.job.update({
      where: { id: job.id },
      data: { slug }
    });

    console.log(`✅ Updated job: ${job.title} -> ${slug}`);
  }

  console.log('✨ Job slugs updated successfully!\n');
}

async function main() {
  try {
    console.log('🚀 Starting slug migration...\n');

    await updateCompanySlugs();
    await updateJobSlugs();

    console.log('🎉 All slugs updated successfully!');
  } catch (error) {
    console.error('❌ Error updating slugs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
