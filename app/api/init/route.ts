import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

/**
 * API route to initialize admin users in production.
 * Call this endpoint after deployment to seed the database with admin users.
 * 
 * GET /api/init - Creates or updates admin users from environment variables
 */
export async function GET() {
    try {
        const results: string[] = [];

        // System Admin credentials from environment
        const systemAdminEmail = process.env.SYSTEM_ADMIN_EMAIL;
        const systemAdminPassword = process.env.SYSTEM_ADMIN_PASSWORD;
        const systemAdminName = process.env.SYSTEM_ADMIN_NAME || "System Administrator";

        if (systemAdminEmail && systemAdminPassword) {
            const hashedPassword = await bcrypt.hash(systemAdminPassword, 12);

            await db.user.upsert({
                where: { email: systemAdminEmail },
                update: {
                    password: hashedPassword,
                    fullName: systemAdminName,
                    role: "system_admin"
                },
                create: {
                    email: systemAdminEmail,
                    password: hashedPassword,
                    fullName: systemAdminName,
                    role: "system_admin"
                }
            });
            results.push(`System Admin (${systemAdminEmail}): Ready`);
        } else {
            results.push("System Admin: Skipped (missing env vars)");
        }

        // Default Admin credentials from environment
        const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
        const defaultAdminName = process.env.DEFAULT_ADMIN_NAME || "CivNet Administrator";

        if (defaultAdminEmail && defaultAdminPassword) {
            const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);

            await db.user.upsert({
                where: { email: defaultAdminEmail },
                update: {
                    password: hashedPassword,
                    fullName: defaultAdminName,
                    role: "admin"
                },
                create: {
                    email: defaultAdminEmail,
                    password: hashedPassword,
                    fullName: defaultAdminName,
                    role: "admin"
                }
            });
            results.push(`Default Admin (${defaultAdminEmail}): Ready`);
        } else {
            results.push("Default Admin: Skipped (missing env vars)");
        }

        // Get current admin count
        const adminCount = await db.user.count({
            where: { role: { in: ["admin", "system_admin"] } }
        });

        return NextResponse.json({
            success: true,
            message: "Admin initialization completed",
            results,
            totalAdmins: adminCount
        });

    } catch (error) {
        console.error("Admin initialization error:", error);
        return NextResponse.json({
            success: false,
            message: "Admin initialization failed",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
