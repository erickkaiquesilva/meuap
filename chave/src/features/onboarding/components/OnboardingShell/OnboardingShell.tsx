import type { ReactNode } from 'react'
import { AuthSplitLayout } from '@/features/auth/components/AuthSplitLayout/AuthSplitLayout'

interface OnboardingShellProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function OnboardingShell({ title, subtitle, children }: OnboardingShellProps) {
  return (
    <AuthSplitLayout
      title={title}
      subtitle={subtitle}
      footer="Pré-onboarding · Maringá e Sarandi"
    >
      {children}
    </AuthSplitLayout>
  )
}
