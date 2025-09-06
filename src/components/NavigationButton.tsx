'use client'

import { useRouter } from 'next/navigation'

interface NavigationButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
}

export default function NavigationButton({ 
  variant, 
  children, 
  onClick, 
  href, 
  className = '' 
}: NavigationButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    }
  }

  const baseClasses = "px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white", 
    danger: "bg-red-600 hover:bg-red-700 text-white"
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
