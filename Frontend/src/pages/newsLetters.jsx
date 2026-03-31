import React from 'react'
import Sidebar from '@/components/Sidebar'
import Sample from "@/components/newsletters/sample"

function NewsLetters() {
  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-black'>
        <Sidebar/>
        <main className="min-h-screen pt-14 lg:pt-15 pb-20 px-4 sm:px-0">
            <div className="w-full max-w-xl mx-auto flex flex-col lg:gap-6">
                 <Sample/>
            </div>
        </main>
    </div>
  )
}

export default NewsLetters