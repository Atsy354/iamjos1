'use client'

import { withAuth } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

function ManagerHomePage() {
  redirect('/editor')
  return null
}

export default withAuth(ManagerHomePage, ['manager'])