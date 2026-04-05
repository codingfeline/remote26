'use client'

import Link from 'next/link'

interface Prop {
  url: string
  label: string
}

const MyButton = ({ url, label }: Prop) => {
  return (
    <button className="cursor-pointer bg-violet-200 p-1 hover:bg-violet-300 px-2 rounded-sm  ">
      <Link href={`${url}`}>{label}</Link>
    </button>
  )
}

export default MyButton
