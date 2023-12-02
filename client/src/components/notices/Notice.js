import React, { useState } from 'react'

const Notice = ({ idx, notice, notFor }) => {
  return (
    notFor !== notice.noticeFor && (
      <div className='flex h-10 px-2 py-2 transition-all duration-200 rounded-lg shadow-md cursor-pointer bg-slate-50 hover:bg-black hover:text-white'>
        ⚫
        <h1 className='pr-5 ml-3 overflow-hidden font-bold text-ellipsis'>
          {notice.topic}
        </h1>
        <p className='text-ellipsis w-[25rem] overflow-hidden'>
          {notice.content}
        </p>
      </div>
    )
  )
}

export default Notice
