const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { email: 'admin@admin.com' },
        include: { subscription: true }
    });

    if (!user || !user.subscription) {
        console.log("No test user or subscription found");
        return;
    }

    // Set end date to 2 days from now
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    await prisma.subscription.update({
        where: { id: user.subscription.id },
        data: { endDate: twoDaysFromNow, status: 'ACTIVE' }
    });

    console.log("Set subscription end date to 2 days from now for:", user.email);
}
main().catch(console.error).finally(() => prisma.$disconnect());
