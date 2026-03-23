import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import argon2 from "argon2";
import { PrismaClient } from "../generated/prisma/client";

const { ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL } = process.env;

const adapter = new PrismaMariaDb(DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.studentBehaviorRecord.deleteMany();
  await prisma.codeOfConduct.deleteMany();

  const adminUser = await prisma.user.create({
    data: {
      docNumber: "000000000",
      docType: "CC",
      name: "Richard A.",
      lastName: "Rich",
      email: ADMIN_EMAIL!,
      hashedPassword: await argon2.hash(ADMIN_PASSWORD!),
      role: "ADMIN",
    },
  });

  console.info({ message: "Admin user created", adminUser });
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
  process.exit(0);
}
