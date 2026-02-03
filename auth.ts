import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";

export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials;

                if (!email || !password) return null;

                const user = await db.user.findUnique({
                    where: { email: email as string },
                });

                if (!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(password as string, user.password);

                if (passwordsMatch) {
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.fullName,
                        role: user.role,
                    };
                }

                return null;
            },
        }),
    ],
});
