import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';

export default function RegisterPage() {
  async function handleSignUp(formData: FormData) {
    'use server' // This makes the code run on the server
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    
    // Connect directly to Neon
    const sql = neon(process.env.DATABASE_URL!);
    await sql`INSERT INTO users (email, full_name, role) VALUES (${email}, ${name}, 'citizen')`;
    
    redirect('/dashboard');
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>Register for Civnet</h1>
      <form action={handleSignUp}>
        <input name="name" placeholder="Name" required style={{ display: 'block', margin: '10px 0' }} />
        <input name="email" placeholder="Email" required style={{ display: 'block', margin: '10px 0' }} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}