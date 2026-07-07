import { useState } from "react";
import { Phone, MessageCircle, X, Mail } from "lucide-react";
import { Link } from "wouter";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded options */}
      {open && (
        <div className="flex flex-col gap-2 items-end animate-in slide-in-from-bottom-4 duration-200">
          <a
            href="sms:7077063137"
            className="flex items-center gap-3 bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Text us · (707) 706-3137
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-3 bg-accent text-accent-foreground px-4 py-2.5 rounded-full shadow-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Mail className="w-4 h-4" />
            Send a message
          </Link>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close contact options" : "Contact us"}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 ${
          open
            ? "bg-foreground text-background rotate-45 scale-95"
            : "bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-110"
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Pulse ring when closed */}
      {!open && (
        <span className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-emerald-400 animate-ping opacity-25 pointer-events-none" />
      )}
    </div>
  );
}
