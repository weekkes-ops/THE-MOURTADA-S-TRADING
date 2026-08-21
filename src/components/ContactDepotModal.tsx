import React from 'react';
import { Phone, MapPin, Mail, Clock, ShieldCheck, X, MessageSquare, ExternalLink } from 'lucide-react';

interface ContactDepotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDepotModal: React.FC<ContactDepotModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden space-y-5 p-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-[#2563EB] font-mono text-lg shadow-xs">
              MT
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111827] uppercase tracking-tight">
                THE MOURTADA'S TRADING
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#2563EB] font-semibold uppercase">
                <span>PRODUCE DEALER</span>
                <span className="text-[#6B7280]">• "Farmers Friend"</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#111827] p-1 text-lg font-bold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
          <span className="text-xs font-medium italic text-[#2563EB]">
            "Honesty is our Concern" — Certified Scales & Same-Day Cash
          </span>
        </div>

        {/* Contact info list matching Business Card */}
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase block font-sans">Physical Depot Location</span>
              <span className="text-sm font-bold text-[#111827] block">23 Prince Williams Street, Bo City</span>
              <span className="text-[#6B7280] text-[11px] font-sans">Southern Province, Sierra Leone (Central Bo District)</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-start gap-3">
            <Phone className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-[10px] text-[#6B7280] uppercase block font-sans">Direct Telephone & WhatsApp</span>
              <div className="flex items-center gap-3 mt-0.5">
                <a
                  href="tel:072803080"
                  className="text-sm font-bold text-[#2563EB] hover:underline"
                >
                  072803080
                </a>
                <span className="text-[#9CA3AF]">/</span>
                <a
                  href="tel:077803080"
                  className="text-sm font-bold text-[#2563EB] hover:underline"
                >
                  077803080
                </a>
              </div>
              <span className="text-[#6B7280] text-[10px] font-sans">Call for live spot rate locks or large truck arrival notice</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase block font-sans">Official Inquiries & Export Contracts</span>
              <a
                href="mailto:mourtadatrading@gmail.com"
                className="text-xs font-semibold text-[#2563EB] hover:underline block"
              >
                mourtadatrading@gmail.com
              </a>
            </div>
          </div>

          <div className="p-3.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase block font-sans">Depot Buying & Weighing Hours</span>
              <span className="text-xs font-semibold text-[#111827] block">Monday &ndash; Saturday: 07:00 AM &ndash; 07:00 PM</span>
              <span className="text-[10px] text-[#6B7280] font-sans">Sunday: By special cooperative appointment</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3">
          <a
            href="tel:072803080"
            className="flex-1 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call 072803080</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
