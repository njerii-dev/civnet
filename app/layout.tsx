export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: '1rem', background: '#0070f3', color: 'white', display: 'flex', gap: '20px' }}>
          <strong>CivNet</strong>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          <a href="/report" style={{ color: 'white', textDecoration: 'none' }}>Report Issue</a>
        </nav>
        {children}
      </body>
    </html>
  );
}