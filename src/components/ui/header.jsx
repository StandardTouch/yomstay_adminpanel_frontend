// Header component for the admin panel
// Usage:
// import { Header } from '@/components/ui/header'
// <Header fixed>
//   <div className="flex-1 text-2xl font-bold">Admin Panel</div>
//   <UserButton />
// </Header>

import React from 'react'
import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

/**
 * Header component for the admin panel.
 * @param {object} props
 * @param {boolean} props.fixed - If true, header is fixed to the top and shows shadow on scroll.
 * @param {string} props.className - Additional class names for styling.
 * @param {React.ReactNode} props.children - Content to render inside the header (e.g., title, user button).
 */
export const Header = ({
  className,
  fixed,
  children,
  ...props
}) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'bg-background flex h-16 items-center gap-3 p-4 sm:gap-4',
          fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
          offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
          className
        )}
        {...props}
      >
        {/* SidebarTrigger toggles the sidebar (from shadcn/ui sidebar system) */}
        <SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />
        <Separator orientation='vertical' className='h-6' />
        {/* Children can be title, user button, etc. */}
        {children}
      </header>
      {fixed && <div className="h-16 w-full shrink-0" aria-hidden="true" />}
    </>
  )
}

Header.displayName = 'Header'

Header.propTypes = {
  className: PropTypes.string,
  fixed: PropTypes.bool,
  children: PropTypes.node,
} 