import React from 'react'
import Sidebar from '@/components/Sidebar'
import CommunityChat from '@/components/community/CommunityChat'

function Community() {
  return (
    <div className='fixed inset-0 bg-neutral-50 dark:bg-black flex flex-col overflow-hidden'>
      <Sidebar />

      {/* Main content — firmly constrained to fill remaining viewport exactly */}
      <main className='flex-1 flex flex-col w-full h-full pt-14 pb-[4.5rem] lg:pb-10 px- overflow-hidden'>
        <div className='w-full h-full max-w-xl mx-auto flex flex-col relative'>
          <CommunityChat />
        </div>
      </main>
    </div>
  )
}

export default Community