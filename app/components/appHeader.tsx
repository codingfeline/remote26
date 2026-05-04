'use client'

import { Container } from '@radix-ui/themes'
import classnames from 'classnames'
// import { useSession } from 'next-auth/react'
import { default as Link, default as NextLink } from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AiOutlineHome as Home } from 'react-icons/ai'
import { Server } from '.'
import Reveal from './Reveal'

const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      // We close the menu whenever the window is resized.
      // This ensures that if they flip from mobile to desktop,
      // the "open" state doesn't persist in the background.
      setIsOpen(false)
    }

    // Listen for window resize and orientation changes
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return (
    <nav className="borber bg-violet-200 justify-between h-full relative z-50 border-black">
      <div className="relative z-50">
        <Reveal direction="left">
          <Container>
            <div className="flex justify-between">
              <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto">
                {/* Mobile: home link + menu toggle */}
                <div className="flex items-center justify-between w-full px-2 sm:hidden">
                  <NextLink href="/">
                    <div className="p-2 cursor-pointer hover:text-violet-700">
                      <Home size="24px" />
                    </div>
                  </NextLink>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 cursor-pointer hover:text-violet-700"
                  >
                    <Server size="24px" />
                  </button>
                </div>
                {/* Desktop: server icon as home link */}
                <NextLink href="/" className="hidden sm:block">
                  <div className="p-2 cursor-pointer hover:text-violet-700">
                    <Server size="24px" />
                  </div>
                </NextLink>
                <NavLinks isOpen={isOpen} setIsOpen={setIsOpen} />
              </div>
              {/* <AuthStatus /> */}
            </div>
          </Container>
        </Reveal>
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
        />
      )}
    </nav>
  )
}

interface OpenProp {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

const NavLinks = ({ isOpen, setIsOpen }: OpenProp) => {
  const currentPath = usePathname()

  const colourLink = (link: string) =>
    classnames({
      'text-violet-900 bg-violet-300 ': link === currentPath,
      'text-zinc-500 ': link !== currentPath,
      'hover:text-zinc-900 transition-colors  p-2 w-full flex justify-center  md:w-max bg-violet-200 hover:bg-violet-500 border-black': true,
    })

  const links = [
    // { label: 'home', url: '/' },
    { label: 'Logs', url: '/logs' },
    // { label: 'Contact', url: '/contact' },
  ]

  return (
    <div
      className={`${isOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-center absolute sm:static top-10 left-0 w-full sm:w-auto bg-violet-200 z-50 shadow-lg sm:shadow-none`}
    >
      {links.map(link => (
        <Link
          className={colourLink(link.url)}
          href={link.url}
          key={link.url}
          onClick={() => setIsOpen(false)}
        >
          {link.label}
        </Link>
      ))}
      {/* {status === 'authenticated' && session.user!.email! === 'post@nazs.net' && (
        <Link href="/Enquiries" className={colourLink('/Enquiries')}>
          Enquiries
        </Link>
      )} */}
    </div>
  )
}

// const AuthStatus = () => {
//   const { status, data: session } = useSession()

//   if (status === 'loading') return null

//   if (status === 'unauthenticated') return null
//   // return (
//   //   <Link className="" href="/api/auth/signin">
//   //     SignIn
//   //   </Link>
//   // )

//   return (
//     <Box>
//       <DropdownMenu.Root>
//         <DropdownMenu.Trigger>
//           <Avatar
//             src={session!.user!.image!}
//             fallback="?"
//             size="2"
//             radius="full"
//             className="cursor-pointer"
//           />
//           {/* <p>test</p> */}
//         </DropdownMenu.Trigger>
//         <DropdownMenu.Content>
//           <DropdownMenu.Label>
//             <Text size="2">{session!.user!.email!}</Text>
//             {/* <p>fdff</p> */}
//           </DropdownMenu.Label>
//           <DropdownMenu.Item>
//             <Link href="/api/auth/signout">Sign Out</Link>
//           </DropdownMenu.Item>
//         </DropdownMenu.Content>
//       </DropdownMenu.Root>
//     </Box>
//   )
// }

export default AppHeader
