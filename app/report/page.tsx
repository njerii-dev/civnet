import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3rem', color: '#0070f3' }}>CivNet: Nakuru</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        Help us build a better community. Report potholes, water leaks, or power outages.
      </p>
      
      <Link href="/report">
        <button style={{ 
          padding: '15px 30px', 
          fontSize: '1rem', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer' 
        }}>
          Report an Issue Now
        </button>
      </Link>
    </main>
  );
}