import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - SparkVideo',
  description: 'Login or create an account to access SparkVideo features',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-12 items-center justify-center">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to SparkVideo</h1>
            <p className="text-lg mb-8 text-indigo-100">
              Your all-in-one platform for video downloading, conversion, and audio transcription.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-indigo-200 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold">Download from 50+ Platforms</h3>
                  <p className="text-sm text-indigo-100">YouTube, TikTok, Instagram, and more</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-indigo-200 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold">Professional Tools</h3>
                  <p className="text-sm text-indigo-100">Convert, compress, and edit videos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-indigo-200 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold">AI-Powered Features</h3>
                  <p className="text-sm text-indigo-100">Audio transcription and translation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}