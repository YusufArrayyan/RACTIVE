const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasourceUrl: "file:../dev.db"
});

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.upsert({
    where: { email: 'rayyankerz@gmail.com' },
    update: { password: hashedPassword },
    create: { email: 'rayyankerz@gmail.com', password: hashedPassword, name: 'Rayyan' }
  });
  console.log('User created/updated successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
