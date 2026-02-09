
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const username = process.argv[2];
    if (!username) {
        console.error('Usage: tsx check_user.ts <username>');
        process.exit(1);
    }

    console.log(`Checking for user: "${username}"`);

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { username: { equals: username, mode: 'insensitive' } },
                { id: username }
            ]
        }
    });

    if (users.length === 0) {
        console.log('No user found.');
        const allUsers = await prisma.user.findMany({ take: 5, select: { username: true, id: true } });
        console.log('Sample users in DB:', allUsers);
    } else {
        console.log('User found:', JSON.stringify(users, null, 2));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
