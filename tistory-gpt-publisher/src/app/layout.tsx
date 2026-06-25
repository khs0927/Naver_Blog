import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'Tistory GPT Publisher',
  description: 'Custom GPT controlled Tistory publishing queue'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
