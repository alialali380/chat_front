import './globals.css';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'تطبيق المحادثة',
//   description: 'محادثة فورية بين المستخدمين',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}