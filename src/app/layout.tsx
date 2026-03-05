import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thomastp.ch'),
  title: 'Thomas P. | Portfolio',
  description:
    'Portfolio of Thomas P. - Future Computer Scientist at Geneva IT. Exploring Web Development, Cybersecurity, and IoT.',
  authors: [{ name: 'Thomas P.' }],
  keywords: [
    'Thomas P.',
    'Portfolio',
    'Geneva IT',
    'Web Development',
    'Cybersecurity',
    'IoT',
    'React',
    'TypeScript',
    'Ethical Hacking',
    'Software Engineer',
  ],
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
      { url: '/icons/favicon-light.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/favicon.svg',
  },
  other: {
    'og:logo': 'https://thomastp.ch/icons/favicon.svg',
  },
  openGraph: {
    type: 'website',
    url: 'https://thomastp.ch',
    siteName: 'Thomas P. | Portfolio',
    title: 'Thomas P. | Portfolio',
    description:
      'Portfolio of Thomas P. - Future Computer Scientist at Geneva IT. Exploring Web Development, Cybersecurity, and IoT.',
    images: [{
      url: 'https://thomastp.ch/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Thomas P. Portfolio',
    }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ThomasTP_dev',
    creator: '@ThomasTP_dev',
    title: 'Thomas P. | Portfolio',
    description:
      'Portfolio of Thomas P. - Future Computer Scientist at Geneva IT. Exploring Web Development, Cybersecurity, and IoT.',
    images: ['https://thomastp.ch/images/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply theme class before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try{
    var s=localStorage.getItem('vite-ui-theme');
    var t=s==='dark'||s==='light'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    document.documentElement.classList.add(t);
  }catch(e){}
})();
            `,
          }}
        />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'Thomas P.',
                url: 'https://thomastp.ch',
                jobTitle: 'Future Computer Scientist',
                description:
                  'Information Technology student at Geneva IT School specializing in Web Development, Cybersecurity, and IoT solutions.',
                image: 'https://thomastp.ch/images/og-image.png',
                sameAs: [
                  'https://github.com/Thomas-TP',
                  'https://www.linkedin.com/in/thomas-tp/',
                ],
                worksFor: {
                  '@type': 'Organization',
                  name: 'Geneva IT School',
                },
                knowsAbout: [
                  'Web Development',
                  'Cybersecurity',
                  'Internet of Things (IoT)',
                  'React',
                  'TypeScript',
                  '.NET',
                  'Cisco Packet Tracer',
                  'Ethical Hacking',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                itemListElement: [
                  {
                    '@type': 'SoftwareSourceCode',
                    name: 'X-clone',
                    description:
                      'A responsive clone of the X (formerly Twitter) platform built with HTML/CSS/JS and AI integration.',
                    url: 'https://x-clone-teal-phi.vercel.app/',
                    codeRepository: 'https://github.com/Thomas-TP/X-clone',
                    programmingLanguage: ['HTML', 'CSS', 'JavaScript'],
                  },
                  {
                    '@type': 'SoftwareApplication',
                    name: 'Tank.io',
                    description:
                      'A multiplayer tank battle game using React, Canvas API, and WebSocket technology.',
                    url: 'https://tank-io-wr49.onrender.com/',
                    codeRepository: 'https://github.com/Thomas-TP/Tank.io',
                    applicationCategory: 'Game',
                    operatingSystem: 'Web Browser',
                  },
                  {
                    '@type': 'SoftwareSourceCode',
                    name: 'PowerShell Empire Automation',
                    description:
                      'Cybersecurity automation scripts utilizing the PowerShell Empire framework for pen-testing simulations.',
                    url: 'https://github.com/Thomas-TP/Powershell-Empire-test',
                    codeRepository:
                      'https://github.com/Thomas-TP/Powershell-Empire-test',
                    programmingLanguage: 'PowerShell',
                  },
                  {
                    '@type': 'SoftwareApplication',
                    name: 'Meals Planner',
                    description:
                      'A mobile app that generates 5 balanced weekly meals, designed for grab-and-go lunches you can reheat at work. Built with Flutter.',
                    codeRepository: 'https://github.com/Thomas-TP/meals-app',
                    applicationCategory: 'Lifestyle',
                    operatingSystem: 'Android, iOS',
                    programmingLanguage: ['Dart', 'C++', 'Swift'],
                  },
                ],
              },
            ]),
          }}
        />
      </head>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
