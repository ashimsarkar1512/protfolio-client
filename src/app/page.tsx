import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-svh w-full max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
      <div className="space-y-4 text-center lg:text-left">
        <p className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          Portfolio CMS
        </p>
        <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Modern admin workspace for your portfolio
        </h1>
        <p className="max-w-xl text-sm text-slate-600 sm:text-base">
          Access your control panel to update projects, publish blogs, manage skills, and answer messages with a clean professional interface.
        </p>
      </div>
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  )
}