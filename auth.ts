import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";

export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db) as Adapter,
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials;

                console.log("🔐 Auth attempt for:", email);

                if (!email || !password) {
                    console.log("❌ Missing email or password");
                    return null;
                }

                const user = await db.user.findUnique({
                    where: { email: email as string },
                });

                console.log("👤 User found:", user ? `Yes (${user.email}, role: ${user.role})` : "No");

                if (!user || !user.password) {
                    console.log("❌ User not found or no password set");
                    return null;
                }

                const passwordsMatch = await bcrypt.compare(password as string, user.password);
                console.log("🔑 Password match:", passwordsMatch);

                if (passwordsMatch) {
                    console.log("✅ Login successful for:", user.email);
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.fullName,
                        role: user.role,
                    };
                }

                console.log("❌ Password mismatch");
                return null;
            },
        }),
    ],
});
