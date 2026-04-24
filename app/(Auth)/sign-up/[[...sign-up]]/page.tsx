import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 px-2 pt-2 text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-700">
          Create your workspace
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          Start using Petry
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Set up your account and get straight into managing schedules, notes, and pet care tasks.
        </p>
      </div>

      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "w-full",
            card: "w-full border-0 bg-transparent shadow-none p-0",
          },
        }}
      />
    </div>
  );
}