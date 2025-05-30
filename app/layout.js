import '../styles/globals.css';

export const metadata = {
    title: 'My Movie Search App',
    description: 'Search movies with TMDB API',
  }
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    )
  }
  