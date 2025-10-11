const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Find all users with password 'Password123!'
  const usersToUpdate = await prisma.user.findMany({
    where: {
      password: 'Password123!'
    }
  });

  console.log(`Found ${usersToUpdate.length} users with password 'Password123!'`);

  // Update each user's password
  for (const user of usersToUpdate) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: '$2b$10$m9iDsOCB2iFDye2EFLouEOO2Xjg2upQ6Msj9D12shCIHe6Y5hvIb6'
      }
    });
    console.log(`Updated password for user: ${user.email}`);
  }

  console.log(`Successfully updated ${usersToUpdate.length} users`);
}

main()
  .catch((e) => {
    console.error('Error updating passwords:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });