'use client'

import { withAuth } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

function SubscriptionManagerHomePage() {
  redirect('/dashboard')
  return null
}

export default withAuth(SubscriptionManagerHomePage, ['subscription-manager'])