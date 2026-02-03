"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * Initializes the admin users in the database if they don't exist.
 * This function should be called during app initialization.
 * 
 * Role Hierarchy:
 * - system_admin: Full control, can manage admins and view system stats
 * - admin: Can manage citizen issues
 * - citizen: Regular users who report issues
 */
export async function initializeAdmins() {
    try {
        // Check and create System Admin
        const systemAdminEmail = process.env.SYSTEM_ADMIN_EMAIL;
        const systemAdminPassword = process.env.SYSTEM_ADMIN_PASSWORD;
        const systemAdminName = process.env.SYSTEM_ADMIN_NAME;

        if (systemAdminEmail && systemAdminPassword) {
            const existingSystemAdmin = await db.user.findUnique({
                where: { email: systemAdminEmail },
            });

            if (!existingSystemAdmin) {
                const hashedPassword = await bcrypt.hash(systemAdminPassword, 12);
                await db.user.create({
                    data: {
                        email: systemAdminEmail,
                        password: hashedPassword,
                        fullName: systemAdminName || "System Administrator",
                        role: "system_admin",
                    },
                });
                console.log("✅ System Admin created successfully");
            } else {
                console.log("ℹ️ System Admin already exists");
            }
        }

        // Check and create Default Admin
        const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
        const defaultAdminName = process.env.DEFAULT_ADMIN_NAME;

        if (defaultAdminEmail && defaultAdminPassword) {
            const existingAdmin = await db.user.findUnique({
                where: { email: defaultAdminEmail },
            });

            if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);
                await db.user.create({
                    data: {
                        email: defaultAdminEmail,
                        password: hashedPassword,
                        fullName: defaultAdminName || "CivNet Administrator",
                        role: "admin",
                    },
                });
                console.log("✅ Default Admin created successfully");
            } else {
                console.log("ℹ️ Default Admin already exists");
            }
        }

        return { success: true };
    } catch (error) {
        console.error("❌ Error initializing admins:", error);
        return { success: false, error };
    }
}

/**
 * Gets all admins (for system admin view only)
 */
export async function getAllAdmins() {
    try {
        return await db.user.findMany({
            where: {
                role: {
                    in: ["admin", "system_admin"],
                },
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        issues: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } catch (error) {
        console.error("Error fetching admins:", error);
        return [];
    }
}

/**
 * Create a new admin user (system admin only)
 */
export async function createAdmin(data: {
    email: string;
    password: string;
    fullName: string;
    role?: "admin" | "system_admin";
}) {
    try {
        const existingUser = await db.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return { success: false, error: "User with this email already exists" };
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await db.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                fullName: data.fullName,
                role: data.role || "admin",
            },
        });

        return { success: true, user };
    } catch (error) {
        console.error("Error creating admin:", error);
        return { success: false, error: "Failed to create admin" };
    }
}

/**
 * Update admin role or status
 */
export async function updateAdminRole(userId: number, newRole: "admin" | "citizen") {
    try {
        await db.user.update({
            where: { id: userId },
            data: { role: newRole },
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating admin role:", error);
        return { success: false, error: "Failed to update admin role" };
    }
}

/**
 * Delete an admin (demote to citizen or remove)
 */
export async function deleteAdmin(userId: number) {
    try {
        // First check if this is the system admin - cannot delete
        const user = await db.user.findUnique({
            where: { id: userId },
        });

        if (user?.role === "system_admin") {
            return { success: false, error: "Cannot delete system administrator" };
        }

        // Demote to citizen instead of deleting
        await db.user.update({
            where: { id: userId },
            data: { role: "citizen" },
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting admin:", error);
        return { success: false, error: "Failed to delete admin" };
    }
}
