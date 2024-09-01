import Link from 'next/link'

export default function ManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Staff Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/page1">
          <div className="bg-pastel-orange text-white p-6 rounded-lg text-center cursor-pointer hover:bg-blue-600">
            Term Register
          </div>
        </Link>
        <Link href="/page2">
          <div className="bg-pastel-orange text-white p-6 rounded-lg text-center cursor-pointer hover:bg-blue-600">
            Golden Rules
          </div>
        </Link>
        <Link href="/page3">
          <div className="bg-pastel-orange text-white p-6 rounded-lg text-center cursor-pointer hover:bg-blue-600">
            Calendar
          </div>
        </Link>
        <Link href="/page4">
          <div className="bg-pastel-orange text-white p-6 rounded-lg text-center cursor-pointer hover:bg-blue-600">
            Mentor Assignments
          </div>
        </Link>
        <Link href="/page5">
          <div className="bg-pastel-orange text-white p-6 rounded-lg text-center cursor-pointer hover:bg-blue-600">
            Incident Report
          </div>
        </Link>
        
      </div>
    </div>
  )
}