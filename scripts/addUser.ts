import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasourceUrl: "file:C:/CODING PROJECT/RACTIVE/prisma/dev.db"
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
