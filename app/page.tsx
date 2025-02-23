export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4 text-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Jecta" className="h-16 w-16" />
          <div className="ml-4">
            <h1 className="text-4xl font-bold">JECTA</h1>
            <span className="text-sm text-emerald-400">v0.0.2</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h2 className="text-5xl leading-loose font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Coming Soon
          </h2>
          <p className="text-xl text-zinc-400">
            We're working hard to bring you something amazing. Stay tuned!
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="p-6 rounded-lg bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
            <div className="text-emerald-400 text-2xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-zinc-400">Advanced AI technology for smarter interactions</p>
          </div>
          <div className="p-6 rounded-lg bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
            <div className="text-emerald-400 text-2xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-zinc-400">Built with security and privacy in mind</p>
          </div>
          <div className="p-6 rounded-lg bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
            <div className="text-emerald-400 text-2xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-zinc-400">Optimized for speed and performance</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-zinc-500 text-sm">
          <p>© 2024 Jecta. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
