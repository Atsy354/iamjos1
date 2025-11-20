'use client'

import { withAuth } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

function CopyeditorHomePage() {
  redirect('/editor/submissions?filter=copyediting')
  return null
}

export default withAuth(CopyeditorHomePage, ['copyeditor'])