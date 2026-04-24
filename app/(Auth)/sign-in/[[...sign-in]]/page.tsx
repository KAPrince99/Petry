import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 px-2 pt-2 text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-700">
          Welcome back
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          Sign in to Petry
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Access your dashboard, pet records, and daily workflow in one place.
        </p>
      </div>

      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
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