'use client'

import AuthProvider from '@/app/auth/Provider'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
