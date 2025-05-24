import "./globals.css";

export const metadata = {
  title: "RTC Simulation",
  description: "Haksham-Spartan6 Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
