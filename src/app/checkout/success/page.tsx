"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="pt-24 pb-20 min-h-[70vh] flex items-center">
      <div className="container-main text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-[var(--accent3)]/10 border border-[var(--accent3)]/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[var(--accent3)]" />
        </div>

        <h1 className="font-display font-extrabold text-3xl mb-3">
          Payment Successful!
        </h1>
        <p className="text-[var(--muted)] text-lg mb-2">
          Your purchase is being confirmed.
        </p>
        <p className="text-[var(--muted)] text-sm">
          Redirecting to your dashboard in{" "}
          <span className="text-[var(--accent)] font-mono font-bold">
            {countdown}
          </span>{" "}
          seconds...
        </p>

        <div className="mt-8">
          <div className="w-48 h-1 bg-[var(--surface)] rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-[var(--accent3)] rounded-full transition-all duration-1000"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
