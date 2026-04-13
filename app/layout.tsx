import { CookieConsentProvider } from '@/providers/CookieConsentProvider'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import AppFooter from './components/appFooter'
import AppHeader from './components/appHeader'
import BottomLogo from './components/bottomLogo'
import ClientProviders from './components/ClientProviders'
import ToastProvider from './components/ToastProvider'
import './globals.css'
import MyFancyLogComp from './hooks/MyFancyLogComp'
import QueryClientProvider from './QueryClientProvider'
import './theme-config.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Remote CMS',
  description: 'Web-based content management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon-32x32.png" sizes="any" />
      <body className={geistSans.className}>
        <QueryClientProvider>
          <ClientProviders>
            <CookieConsentProvider>
              <Theme accentColor="blue" className="mb-auto flex flex-col ">
                <AppHeader />
                <ToastProvider />
                {children}
                {/* <AnalyticsConsent /> */}
                <BottomLogo />
                <MyFancyLogComp
                  txt="Remote-CMS by N Sharid"
                  back="#134d7c"
                  colour="#e0ca69"
                />
                <AppFooter />
              </Theme>
            </CookieConsentProvider>
          </ClientProviders>
        </QueryClientProvider>
      </body>
    </html>
  )
}
