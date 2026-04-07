import SafeBanner from './SafeBanner'
import Navbar from './Navbar'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-softwhite flex flex-col">
      <SafeBanner />
      <main className="flex-1 w-full max-w-md mx-auto px-4 pb-24 pt-4">
        {children}
      </main>
      <Navbar />
    </div>
  )
}
