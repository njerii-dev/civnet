import { initializeAdmins } from "@/lib/initAdmins";
import { NextResponse } from "next/server";

/**
 * API route to initialize admin users.
 * This can be called during deployment or manually triggered.
 */
export async function GET() {
    try {
        const result = await initializeAdmins();

        if (result.success) {
            return NextResponse.json({
                message: "Admin initialization completed successfully",
                success: true
            });
        } else {
            return NextResponse.json({
                message: "Admin initialization failed",
                success: false,
                error: result.error
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            message: "Internal server error",
            success: false
        }, { status: 500 });
    }
}
