'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Ruler, MessageCircle, Globe, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { CONTACT_DETAILS } from '../lib/contactDetails';

interface SizeRow {
  uk: string;
  us: string;
  turkey: string;
  intl: string;
  bustIn: string;
  waistIn: string;
  hipsIn: string;
  bustCm: string;
  waistCm: string;
  hipsCm: string;
}

const SIZE_CHART: SizeRow[] = [
  { uk: 'UK 6', us: 'US 2', turkey: '34', intl: 'XS', bustIn: '31 - 32', waistIn: '24 - 25', hipsIn: '33 - 34', bustCm: '79 - 82', waistCm: '60 - 63', hipsCm: '84 - 87' },
  { uk: 'UK 8', us: 'US 4', turkey: '36', intl: 'S', bustIn: '32 - 34', waistIn: '25 - 27', hipsIn: '35 - 37', bustCm: '82 - 86', waistCm: '64 - 68', hipsCm: '88 - 93' },
  { uk: 'UK 10', us: 'US 6', turkey: '38', intl: 'M', bustIn: '34 - 36', waistIn: '27 - 29', hipsIn: '37 - 39', bustCm: '86 - 91', waistCm: '69 - 73', hipsCm: '94 - 98' },
  { uk: 'UK 12', us: 'US 8', turkey: '40', intl: 'M / L', bustIn: '36 - 38', waistIn: '29 - 31', hipsIn: '39 - 41', bustCm: '91 - 96', waistCm: '74 - 79', hipsCm: '99 - 104' },
  { uk: 'UK 14', us: 'US 10', turkey: '42', intl: 'L', bustIn: '38 - 40', waistIn: '31 - 33', hipsIn: '41 - 43', bustCm: '97 - 102', waistCm: '80 - 85', hipsCm: '105 - 110' },
  { uk: 'UK 16', us: 'US 12', turkey: '44', intl: 'XL', bustIn: '41 - 43', waistIn: '34 - 36', hipsIn: '44 - 46', bustCm: '103 - 109', waistCm: '86 - 92', hipsCm: '111 - 117' },
  { uk: 'UK 18', us: 'US 14', turkey: '46', intl: 'XXL', bustIn: '44 - 46', waistIn: '37 - 39', hipsIn: '47 - 49', bustCm: '110 - 117', waistCm: '93 - 100', hipsCm: '118 - 125' },
  { uk: 'UK 20', us: 'US 16', turkey: '48 / 50', intl: '3XL', bustIn: '47 - 49', waistIn: '40 - 42', hipsIn: '50 - 52', bustCm: '118 - 125', waistCm: '101 - 108', hipsCm: '126 - 133' },
  { uk: 'UK 22', us: 'US 18', turkey: '52', intl: '4XL', bustIn: '50 - 52', waistIn: '43 - 45', hipsIn: '53 - 55', bustCm: '126 - 132', waistCm: '109 - 115', hipsCm: '134 - 140' },
];

export default function SizeGuideContent() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const whatsappInquiryUrl = `https://wa.me/${CONTACT_DETAILS.whatsappNumber}?text=${encodeURIComponent(
    'Hello T&D Boutique! I would like assistance with sizing and custom fitting for my order. My measurements are: '
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900 font-medium">Size & Fit Guideline</span>
      </nav>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ borderColor: 'rgba(212, 175, 55, 0.35)', color: '#a18143', background: 'rgba(212, 175, 55, 0.06)' }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
          T&D Luxury Fit Assurance
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4">
          Women&apos;s Size &amp; Fit Guide
        </h1>
        <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
          At T&amp;D Ladies Fashion Boutique Abuja, every piece is curated for timeless elegance. Use our international conversion charts below to select your ideal fit, whether you order across Nigeria or with our worldwide express shipping.
        </p>
      </div>

      {/* Special Highlight: Free Size — Any Size of Your Choice */}
      <div
        className="mb-14 rounded-2xl p-6 md:p-8 border shadow-sm relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fdfbf7 0%, #ffffff 100%)',
          borderColor: 'rgba(212, 175, 55, 0.4)',
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xs"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }}
              >
                ✨
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-zinc-900">
                Free Size — Any Size of Your Choice
              </h2>
            </div>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed mb-4">
              Garments marked as <strong>&ldquo;Free Size&rdquo;</strong> are designed with adaptable, forgiving silhouettes—such as wrap-around waistbands, stretch fabric blends, kaftan draping, and flowing kimono cuts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/80 border border-zinc-200/80 rounded-xl p-3.5 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-zinc-600">
                  <strong className="text-zinc-900 block font-semibold">Universal Span</strong>
                  Comfortably fits UK 8 through UK 18 (US 4–14 / S–XXL).
                </div>
              </div>
              <div className="bg-white/80 border border-zinc-200/80 rounded-xl p-3.5 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-zinc-600">
                  <strong className="text-zinc-900 block font-semibold">Versatile Styling</strong>
                  Wear it relaxed and fluid, or cinch with a belt for a fitted waist.
                </div>
              </div>
              <div className="bg-white/80 border border-zinc-200/80 rounded-xl p-3.5 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-zinc-600">
                  <strong className="text-zinc-900 block font-semibold">Stress-Free Ordering</strong>
                  No need for strict size worries—it gracefully flatters your shape.
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 self-stretch md:self-auto flex md:flex-col justify-end">
            <Link
              href="/categories/clothes"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md hover:scale-102 cursor-pointer w-full md:w-auto text-center"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }}
            >
              Shop Free Size Looks
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Conversion Table Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6 md:p-8 mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-100">
          <div>
            <h3 className="text-xl md:text-2xl font-serif text-zinc-900 mb-1">
              International Size Conversion Chart
            </h3>
            <p className="text-xs md:text-sm text-zinc-500">
              Cross-reference UK, US, Turkey, and EU sizes against your body measurements.
            </p>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200 self-start sm:self-auto">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                unit === 'in'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                unit === 'cm'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold bg-zinc-50/70">
                <th className="py-3.5 px-4 font-semibold text-zinc-900">UK Size</th>
                <th className="py-3.5 px-4">US Size</th>
                <th className="py-3.5 px-4">Turkey / EU</th>
                <th className="py-3.5 px-4">Standard</th>
                <th className="py-3.5 px-4">Bust ({unit})</th>
                <th className="py-3.5 px-4">Waist ({unit})</th>
                <th className="py-3.5 px-4">Hips ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {SIZE_CHART.map((row) => (
                <tr key={row.uk} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-900 whitespace-nowrap">
                    {row.uk}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 whitespace-nowrap">{row.us}</td>
                  <td className="py-3.5 px-4 text-zinc-700 whitespace-nowrap">{row.turkey}</td>
                  <td className="py-3.5 px-4 text-zinc-700 whitespace-nowrap font-medium">{row.intl}</td>
                  <td className="py-3.5 px-4 text-zinc-600 whitespace-nowrap font-mono text-xs">
                    {unit === 'in' ? row.bustIn : row.bustCm}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 whitespace-nowrap font-mono text-xs">
                    {unit === 'in' ? row.waistIn : row.waistCm}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 whitespace-nowrap font-mono text-xs">
                    {unit === 'in' ? row.hipsIn : row.hipsCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How to Measure & Worldwide Delivery Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {/* How to measure */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-serif text-zinc-900">How to Measure</h3>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 mb-6">
            For the most accurate measurements, use a flexible tape and measure wearing undergarments similar to what you will wear with your outfit.
          </p>
          <div className="space-y-4 text-xs md:text-sm">
            <div className="border-l-2 border-[#D4AF37] pl-3.5">
              <strong className="text-zinc-900 block font-semibold mb-0.5">1. Bust</strong>
              <span className="text-zinc-600">
                Measure around the fullest part of your chest, keeping the tape straight across your shoulder blades.
              </span>
            </div>
            <div className="border-l-2 border-[#D4AF37] pl-3.5">
              <strong className="text-zinc-900 block font-semibold mb-0.5">2. Natural Waist</strong>
              <span className="text-zinc-600">
                Measure around the narrowest part of your waistline (typically 1–2 inches above your belly button).
              </span>
            </div>
            <div className="border-l-2 border-[#D4AF37] pl-3.5">
              <strong className="text-zinc-900 block font-semibold mb-0.5">3. Hips</strong>
              <span className="text-zinc-600">
                Stand with feet together and measure around the widest part of your hips and buttocks.
              </span>
            </div>
            <div className="border-l-2 border-[#D4AF37] pl-3.5">
              <strong className="text-zinc-900 block font-semibold mb-0.5">4. Gown &amp; Dress Length</strong>
              <span className="text-zinc-600">
                Measure from the highest point of your shoulder down over the bust point to the hemline or floor, accounting for heel height.
              </span>
            </div>
          </div>
        </div>

        {/* Worldwide Delivery & Custom Sizing Assistance */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-serif text-zinc-900">Worldwide Express Delivery</h3>
            </div>
            <p className="text-xs md:text-sm text-zinc-600 leading-relaxed mb-5">
              We ship internationally from Abuja, Nigeria to customers worldwide, including the <strong>United Kingdom, United States, Canada, Europe, UAE, and across Africa</strong> via DHL Express and trusted couriers.
            </p>

            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Need Custom Fitting or Size Advice?
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Unsure whether to choose UK 12 or UK 14? Send us your bust, waist, and hip measurements directly on WhatsApp. Our master tailors in Abuja will confirm the best fit or custom-tailor the piece before dispatch.
              </p>
            </div>
          </div>

          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold tracking-wider uppercase transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Abuja Styling Team on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
