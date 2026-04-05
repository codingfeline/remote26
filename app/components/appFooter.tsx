import { Container } from '@radix-ui/themes'
import Link from 'next/link'
// import ManageCookiesButton from './ManageCookiesButton'
import CookieConsentManager from './CookieConsentManager'

const AppFooter = () => {
  const year = new Date().getFullYear().toString()
  return (
    <footer className=" bg-violet-200 footer">
      <Container>
        <div className="flex justify-between p-3 items-center">
          {/* <div> */}
          <Link href="/"> {year} Remote Access CMS </Link>
          {/* </div> */}
          {/* <div>Terms and conditions</div> */}
          {/* <ManageCookiesButton /> */}
          <CookieConsentManager />
        </div>
      </Container>
    </footer>
  )
}

export default AppFooter
