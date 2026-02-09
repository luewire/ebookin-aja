const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const follows = await prisma.follow.findMany({ take: 5 });
        console.log('Follow table exists. Count: ' + follows.length);
        console.log(JSON.stringify(follows, null, 2));
    } catch (err) {
        console.error('Follow table error: ' + err.message);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
