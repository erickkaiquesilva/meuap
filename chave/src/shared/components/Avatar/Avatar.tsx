interface AvatarProps {
  name: string
  src?: string
  size?: number
  className?: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
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
