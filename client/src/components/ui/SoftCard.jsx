export default function SoftCard({ children, className = '', color = 'bg-blush' }) {
  return (
    <div className={`${color} rounded-2xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
