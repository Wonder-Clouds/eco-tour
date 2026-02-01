// components/LoadingIcon.tsx

interface LoadingIconProps {
  size?: number
  className?: string
}

export function LoadingIcon({ size = 32, className = '' }: LoadingIconProps) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {/* Icono base en gris claro */}
      <img
        src="/icon.png"
        alt="Loading"
        className="absolute inset-0 w-full h-full"
        style={{
          filter: 'brightness(1.8) saturate(0)',
          opacity: 0.3,
        }}
      />

      {/* Icono con color que se va revelando */}
      <img
        src="/icon.png"
        alt="Loading"
        className="absolute inset-0 w-full h-full animate-reveal-color"
        style={{
          clipPath: 'inset(0 100% 0 0)',
        }}
      />
    </div>
  )
}