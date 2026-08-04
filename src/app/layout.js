import './globals.css';

export const metadata = {
  title: 'AI Ingredient Analyser',
  description: 'Analyse ingredient lists and check safety for health conditions',
};

// Note the curly braces around ({ children }) for prop destructuring
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}