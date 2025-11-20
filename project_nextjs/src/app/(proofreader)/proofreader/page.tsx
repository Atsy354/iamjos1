'use client'

import { withAuth } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

function ProofreaderHomePage() {
  redirect('/editor/submissions?filter=production')
  return null
}

export default withAuth(ProofreaderHomePage, ['proofreader'])