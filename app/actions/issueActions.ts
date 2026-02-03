"use server";
// Removed recursive import
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createIssue(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  await db.issue.create({
    data: { title, description, category: category as any }
  });

  revalidatePath("/dashboard/citizens");
  redirect("/dashboard/citizens");
}