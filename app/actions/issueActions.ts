"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createIssue(formData: FormData) {
  const session = await auth();

  // 1. Basic Auth Check
  if (!session?.user?.id) {
    throw new Error("You must be logged in to report an issue.");
  }

  // 2. Extract and Validate Data
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  if (!title || !description || !category) {
    throw new Error("Missing required fields. Please fill out all parts of the form.");
  }

  // Safe parsing of the citizen ID
  const citizenId = parseInt(session.user.id);
  if (isNaN(citizenId)) {
    throw new Error("Invalid session data: Could not determine user ID.");
  }

  // 3. Database Operation
  try {
    await db.issue.create({
      data: {
        title,
        description,
        category,
        citizenId: citizenId
      }
    });

    // 4. Invalidate cache for the dashboard
    revalidatePath("/dashboard/citizens");
  } catch (error) {
    console.error("Critical Database Error in createIssue:", error);
    throw new Error("We encountered a problem saving your report. Please try again later.");
  }

  // 5. Final Redirect (Must be outside try/catch)
  redirect("/dashboard/citizens");
}