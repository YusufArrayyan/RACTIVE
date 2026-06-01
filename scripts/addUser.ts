import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.upsert({
    where: { email: 'rayyankerz@gmail.com' },
    update: { password: hashedPassword },
    create: { email: 'rayyankerz@gmail.com', password: hashedPassword, name: 'Muhammad Yusuf Arrayyan' }
  });
  console.log('User created/updated successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
