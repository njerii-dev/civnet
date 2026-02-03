"use server";

import { db } from "@/lib/db";
import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard/citizens",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    // Redirect back with error
                    redirect("/auth/login?error=CredentialsSignin");
                default:
                    redirect("/auth/login?error=SomethingWentWrong");
            }
        }
        throw error;
    }
}

export async function signup(formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !fullName) {
        redirect("/auth/signup?error=MissingFields");
    }

    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        redirect("/auth/signup?error=UserExists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
            role: "citizen",
        },
    });

    redirect("/auth/login");
}
