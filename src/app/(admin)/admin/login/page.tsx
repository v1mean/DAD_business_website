"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid staff credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during login.";
      setErrorMsg(message);
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@dadelectronics.com",
          password: "AdminPassword123!",
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
        return;
      }
    } catch {
      // ignore
    }
    // Fallback direct access in dev
    document.cookie =
      "dad_staff_session=authenticated; path=/; max-age=86400; SameSite=Lax";
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-[#f5f5f7]">
      <div className="w-full max-w-[420px] rounded-[18px] border border-[#e0e0e0] bg-[#ffffff] p-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#0066cc] text-white mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight">
            DAD Electronics Admin
          </h1>
          <p className="mt-1 text-[14px] text-[#7a7a7a]">
            Staff credentials required to manage product catalog
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-2.5 rounded-[10px] bg-[#ffebee] border border-[#ffcdd2] p-3 text-[13px] text-[#c62828]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Staff Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@dadelectronics.com"
              className="h-[44px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[15px] text-[#1d1d1f] focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="h-[44px] w-full rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 text-[15px] text-[#1d1d1f] focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-[15px] font-medium text-white transition-all active-press disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Demo Staff Access Option (strictly development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 pt-6 border-t border-[#f0f0f0] text-center">
            <span className="inline-block rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-[11px] font-medium text-[#7a7a7a] mb-2.5">
              Local Development Only
            </span>
            <button
              onClick={handleDemoSignIn}
              type="button"
              className="w-full rounded-full border border-[#e0e0e0] bg-[#fafafc] hover:bg-[#f5f5f7] py-2.5 text-[13px] font-medium text-[#1d1d1f] active-press transition-colors"
            >
              Access Dashboard (Dev Mode)
            </button>
          </div>
        )}

        {/* Return to Public Catalog */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#7a7a7a] hover:text-[#0066cc] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Customer Showroom</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
