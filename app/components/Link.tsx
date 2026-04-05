import { Link as RadixLink } from '@radix-ui/themes'
import NextLink from 'next/link'

interface Props {
  href: string
  children: string
}

const MyLink = ({ href, children }: Props) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <RadixLink>{children}</RadixLink>
    </NextLink>
  )
}

export default MyLink

// * this component allows the use of Radix Link while maintaining client side navigation using Next Link
