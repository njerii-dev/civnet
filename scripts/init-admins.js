// Script to initialize admins and verify they exist
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function main() {
    console.log("🔍 Checking existing users...\n");

    // Check existing users
    const allUsers = await db.user.findMany({
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            password: true
        }
    });

    console.log("Current users in database:");
    allUsers.forEach(u => {
        console.log(`  - ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Has Password: ${!!u.password}`);
    });
    console.log("");

    // Check for System Admin
    const systemAdminEmail = process.env.SYSTEM_ADMIN_EMAIL || "superadmin@civnet.gov";
    const systemAdminPassword = process.env.SYSTEM_ADMIN_PASSWORD || "CivNet$uperAdmin2026!";
    const systemAdminName = process.env.SYSTEM_ADMIN_NAME || "System Administrator";

    console.log(`\n📧 System Admin Email: ${systemAdminEmail}`);

    let systemAdmin = await db.user.findUnique({
        where: { email: systemAdminEmail }
    });

    if (!systemAdmin) {
        console.log("⚠️ System Admin not found. Creating...");
        const hashedPassword = await bcrypt.hash(systemAdminPassword, 12);
        systemAdmin = await db.user.create({
            data: {
                email: systemAdminEmail,
                password: hashedPassword,
                fullName: systemAdminName,
                role: "system_admin"
            }
        });
        console.log("✅ System Admin created!");
    } else {
        console.log("✅ System Admin exists. Updating password...");
        const hashedPassword = await bcrypt.hash(systemAdminPassword, 12);
        await db.user.update({
            where: { email: systemAdminEmail },
            data: {
                password: hashedPassword,
                role: "system_admin"
            }
        });
        console.log("✅ System Admin password updated!");
    }

    // Check for Default Admin
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@civnet.gov";
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "CivNetAdmin2026!";
    const defaultAdminName = process.env.DEFAULT_ADMIN_NAME || "CivNet Administrator";

    console.log(`\n📧 Default Admin Email: ${defaultAdminEmail}`);

    let defaultAdmin = await db.user.findUnique({
        where: { email: defaultAdminEmail }
    });

    if (!defaultAdmin) {
        console.log("⚠️ Default Admin not found. Creating...");
        const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);
        defaultAdmin = await db.user.create({
            data: {
                email: defaultAdminEmail,
                password: hashedPassword,
                fullName: defaultAdminName,
                role: "admin"
            }
        });
        console.log("✅ Default Admin created!");
    } else {
        console.log("✅ Default Admin exists. Updating password...");
        const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);
        await db.user.update({
            where: { email: defaultAdminEmail },
            data: {
                password: hashedPassword,
                role: "admin"
            }
        });
        console.log("✅ Default Admin password updated!");
    }

    // Verify final state
    console.log("\n\n🔍 Final verification...\n");
    const admins = await db.user.findMany({
        where: {
            role: { in: ["admin", "system_admin"] }
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true
        }
    });

    console.log("Admin users:");
    admins.forEach(a => {
        console.log(`  ✓ ${a.email} (${a.role})`);
    });

    console.log("\n\n🔑 Login Credentials:");
    console.log("------------------------");
    console.log(`System Admin: ${systemAdminEmail} / ${systemAdminPassword}`);
    console.log(`Default Admin: ${defaultAdminEmail} / ${defaultAdminPassword}`);
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect());
