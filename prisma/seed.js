const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function main() {
    console.log("🚀 Starting admin seeding process...\n");

    // System Admin credentials from environment or defaults
    const systemAdminEmail = process.env.SYSTEM_ADMIN_EMAIL || "superadmin@civnet.gov";
    const systemAdminPassword = process.env.SYSTEM_ADMIN_PASSWORD || "CivNet$uperAdmin2026!";
    const systemAdminName = process.env.SYSTEM_ADMIN_NAME || "System Administrator";

    // Default Admin credentials from environment or defaults
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@civnet.gov";
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "CivNetAdmin2026!";
    const defaultAdminName = process.env.DEFAULT_ADMIN_NAME || "CivNet Administrator";

    // Create or update System Admin
    console.log(`📧 Processing System Admin: ${systemAdminEmail}`);
    const hashedSystemPassword = await bcrypt.hash(systemAdminPassword, 12);

    await db.user.upsert({
        where: { email: systemAdminEmail },
        update: {
            password: hashedSystemPassword,
            fullName: systemAdminName,
            role: "system_admin"
        },
        create: {
            email: systemAdminEmail,
            password: hashedSystemPassword,
            fullName: systemAdminName,
            role: "system_admin"
        }
    });
    console.log("✅ System Admin ready!\n");

    // Create or update Default Admin
    console.log(`📧 Processing Default Admin: ${defaultAdminEmail}`);
    const hashedAdminPassword = await bcrypt.hash(defaultAdminPassword, 12);

    await db.user.upsert({
        where: { email: defaultAdminEmail },
        update: {
            password: hashedAdminPassword,
            fullName: defaultAdminName,
            role: "admin"
        },
        create: {
            email: defaultAdminEmail,
            password: hashedAdminPassword,
            fullName: defaultAdminName,
            role: "admin"
        }
    });
    console.log("✅ Default Admin ready!\n");

    // Verify
    const admins = await db.user.findMany({
        where: { role: { in: ["admin", "system_admin"] } },
        select: { email: true, role: true, fullName: true }
    });

    console.log("📋 Admin users in database:");
    admins.forEach(a => console.log(`   ✓ ${a.email} (${a.role})`));

    console.log("\n🎉 Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
