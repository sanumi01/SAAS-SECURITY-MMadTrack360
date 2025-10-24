import * as Icons from 'lucide-react'
import React from 'react'

export type IconName = keyof typeof Icons

interface IconProps {
  name: IconName
  className?: string
}

export const Icon: React.FC<IconProps> = ({ name, className }) => {
  const LucideIcon = Icons[name]
  if (!LucideIcon) return null
  return <LucideIcon className={className} />
}
