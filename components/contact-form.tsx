"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const services = [
  "Identifying AI Automation use cases",
  "Providing best practices",
  "Designing & building AI Agents",
  "Building external system connections",
  "Troubleshooting AI Agents",
  "Optimizing token consumption",
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("idle")
    setErrorMessage("")

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      contactPref: formData.get("contactPref") as string,
    }

    // Validation
    if (!data.name || !data.email || !data.company || !data.contactPref) {
      setStatus("error")
      setErrorMessage("Please fill in all required fields before submitting.")
      setIsSubmitting(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      setStatus("error")
      setErrorMessage("Please enter a valid email address.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to send message")
      }

      setStatus("success")
      form.reset()
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[640px] overflow-hidden rounded-[18px] border border-border bg-card shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,198,255,0.06)] animate-in fade-in slide-in-from-bottom-6 duration-600">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-[#0d1b2e] to-[#131f35] px-6 py-8 sm:px-10">
        {/* Decorative gradient circle */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(0,198,255,0.12)_0%,transparent_70%)]" />

        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          8x8 Professional Services
        </div>

        <h1 className="mb-3 font-serif text-[22px] font-normal leading-tight text-foreground sm:text-[26px]">
          {"We're excited to get you started with "}
          <em className="bg-gradient-to-r from-primary to-accent bg-clip-text italic text-transparent">
            AI Studio
          </em>
        </h1>

        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          Our team is here to support you across the full AI automation journey, including:
        </p>

        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service}
              className="flex items-start gap-2 text-[13px] leading-snug text-[#b0c0d8]"
            >
              <span className="mt-0.5 shrink-0 text-xs text-primary">→</span>
              {service}
            </div>
          ))}
        </div>

        <p className="border-t border-border pt-4 text-[13.5px] italic leading-relaxed text-muted-foreground">
          Complete the short form below and one of our Professional Services Engagement Managers will be in touch shortly.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-8 sm:px-10">
        {/* Toast Messages */}
        {status === "success" && (
          <div className="flex items-center gap-2.5 rounded-[10px] border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            <span className="text-lg">✓</span>
            {"Your request has been submitted! We'll be in touch soon."}
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2.5 rounded-[10px] border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span className="text-lg">✕</span>
            {errorMessage}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Jane Smith"
            autoComplete="name"
            className="w-full rounded-[10px] border border-border bg-secondary px-4 py-3 text-[15px] text-foreground placeholder:text-[#4a5a74] outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,198,255,0.08)]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="jane@company.com"
            autoComplete="email"
            className="w-full rounded-[10px] border border-border bg-secondary px-4 py-3 text-[15px] text-foreground placeholder:text-[#4a5a74] outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,198,255,0.08)]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            className="w-full rounded-[10px] border border-border bg-secondary px-4 py-3 text-[15px] text-foreground placeholder:text-[#4a5a74] outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,198,255,0.08)]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="Acme Corporation"
            autoComplete="organization"
            className="w-full rounded-[10px] border border-border bg-secondary px-4 py-3 text-[15px] text-foreground placeholder:text-[#4a5a74] outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,198,255,0.08)]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contactPref" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact Preference
          </label>
          <div className="relative">
            <select
              id="contactPref"
              name="contactPref"
              defaultValue=""
              className="w-full appearance-none rounded-[10px] border border-border bg-secondary px-4 py-3 text-[15px] text-foreground outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,198,255,0.08)]"
            >
              <option value="" disabled className="bg-secondary text-muted-foreground">
                Select a preference...
              </option>
              <option value="Phone" className="bg-secondary text-foreground">Phone</option>
              <option value="Email" className="bg-secondary text-foreground">Email</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ▾
            </span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-gradient-to-r from-primary to-accent py-6 text-[15px] font-semibold tracking-wide text-white shadow-[0_4px_20px_rgba(0,198,255,0.25)] transition-all hover:opacity-90 hover:shadow-[0_8px_28px_rgba(0,198,255,0.3)] hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="h-4 w-4" />
              Submitting...
            </span>
          ) : (
            "Submit Request"
          )}
        </Button>

        <p className="text-center text-xs text-[#4a5a74]">
          Your information is used solely to fulfill this consulting request.
        </p>
      </form>
    </div>
  )
}
