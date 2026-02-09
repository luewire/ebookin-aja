import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
    try {
        const userCount = await prisma.user.count();
        console.log('User count:', userCount);

        const userId = 'placeholder-id';
        const users = await prisma.user.findMany({
            take: 1,
            select: {
                id: true,
                name: true,
                username: true,
                photoUrl: true,
                bio: true,
                // @ts-ignore
                favoriteGenre: true,
                // @ts-ignore
                followers: {
                    where: { followerId: userId }
                },
                // @ts-ignore
                following: {
                    where: { followingId: userId }
                }
            }
        });
        console.log('Detected Users:', users);
    } catch (error: any) {
        console.error('ERROR TYPE:', error.constructor.name);
        console.error('ERROR MESSAGE:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
