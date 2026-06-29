import type { ReactNode } from "react";
import { AppleIcon, FacebookIcon, GoogleIcon } from "./BrandIcons";

function SocialButton({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-bold text-[#202020] transition hover:bg-neutral-50"
    >
      {icon}
      {children}
    </button>
  );
}

/** Google / Facebook / Apple auth buttons shared by signup and login. */
export function SocialAuthButtons() {
  return (
    <div className="space-y-2.5">
      <SocialButton icon={<GoogleIcon />}>Continue with Google</SocialButton>
      <SocialButton icon={<FacebookIcon />}>
        Continue with Facebook
      </SocialButton>
      <SocialButton icon={<AppleIcon />}>Continue with Apple</SocialButton>
    </div>
  );
}
