'use server'

import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const databaseUrl = process.env.DATABASE_URL!;
  const sql = neon(databaseUrl);
  
  let targetPath = '';

  try {
    // We add 'as any[]' here to stop the TypeScript "red dot" error
    const results = await sql`SELECT role FROM users WHERE email = ${email} LIMIT 1` as any[];

    if (results.length === 0) {
      return { error: "User not found" };
    }

    const role = results[0].role;
    targetPath = role === 'admin' ? '/admin' : '/dashboard';

  } catch (error) {
    return { error: "Database error" };
  }

  // Redirect only works outside the try/catch
  if (targetPath) {
    redirect(targetPath);
  }
}