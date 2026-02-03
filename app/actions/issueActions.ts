"use server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createIssue(formData: FormData) {
  const session = await auth();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  if (!session?.user) {
    throw new Error("You must be logged in to report an issue.");
  }

  await db.issue.create({
    data: {
      title,
      description,
      category,
      citizenId: parseInt((session.user as any).id)
    }
  });

  revalidatePath("/dashboard/citizens");
  redirect("/dashboard/citizens");
}