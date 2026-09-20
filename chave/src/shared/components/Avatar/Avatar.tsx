interface AvatarProps {
  name: string
  src?: string
  size?: number
  className?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  const first = parts[0]![0] ?? ''
  const last = parts[parts.length - 1]![0] ?? ''
  return `${first}${last}`.toUpperCase()
}

export function Avatar({ name, src, size = 44, className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={['avatar', className].filter(Boolean).join(' ')}
        style={{ objectFit: 'cover' }}
      />
    )
  }

  return (
    <div
      className={['avatar', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      aria-label={name}
      role="img"
    >
      {getInitials(name)}
    </div>
  )
}
