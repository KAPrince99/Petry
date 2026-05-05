import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 px-2 pt-2 text-center sm:text-left">
        <h2 className="text-4xl font-semibold tracking-tight text-white">
          Create account
        </h2>
        <p className="text-base text-zinc-400">Start using Petry.</p>
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
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800",
            formButtonPrimary:
              "rounded-lg bg-white hover:bg-zinc-200 text-zinc-900 shadow-none",
            formFieldInput:
              "rounded-lg border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-zinc-500 focus:ring-zinc-500",
            formFieldLabel: "text-zinc-300",
            dividerLine: "bg-zinc-700",
            dividerText: "text-zinc-500",
            footerActionLink: "text-zinc-200 hover:text-zinc-50",
          },
        }}
      />
    </div>
  );
}