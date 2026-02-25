import { prisma } from './lib/prisma';
import { checkAndNotifySubscriptionExpiry } from './lib/subscription';

async function main() {
    const user = await prisma.user.findFirst({
        where: { email: 'admin@admin.com' },
        include: { subscription: true }
    });

    if (!user || !user.subscription) {
        console.log("No test user or subscription found");
        return;
    }

    // Test 1: Almost expired (2 days)
    console.log("--- Test 1: 2 Days Until Expiry ---");
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    await prisma.subscription.update({
        where: { id: user.subscription.id },
        data: { endDate: twoDaysFromNow, status: 'ACTIVE' }
    });

    await checkAndNotifySubscriptionExpiry(user.id, twoDaysFromNow, user.subscription.planName);

    let notifs = await prisma.notification.findMany({
        where: { userId: user.id, type: 'SUBSCRIPTION' },
        orderBy: { createdAt: 'desc' },
        take: 2
    });
    console.log("Notifications after Test 1:");
    console.dir(notifs);

    // Test 2: Expired (-1 days)
    console.log("\n--- Test 2: Already Expired ---");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await prisma.subscription.update({
        where: { id: user.subscription.id },
        data: { endDate: yesterday, status: 'EXPIRED' }
    });

    await checkAndNotifySubscriptionExpiry(user.id, yesterday, user.subscription.planName);

    notifs = await prisma.notification.findMany({
        where: { userId: user.id, type: 'SUBSCRIPTION' },
        orderBy: { createdAt: 'desc' },
        take: 2
    });
    console.log("Notifications after Test 2:");
    console.dir(notifs);
}

main().catch(console.error).finally(() => prisma.$disconnect());
