import Image from "next/image";
import { TestimonialItem } from "@/data/mock-site";

interface TestimonialSectionProps {
  testimonials: TestimonialItem[];
}

export default function TestimonialSection({
  testimonials,
}: TestimonialSectionProps) {
  return (
    <section className="py-12 bg-white">
      <div className="section-container">
        {/* Forest Green Rounded Container */}
        <div className="bg-[#0D4A38] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cerita dari Orang Tua
            </h2>
            <p className="mt-2 text-emerald-100 text-xs sm:text-sm">
              Pengalaman dan apresiasi dari para orang tua murid SMA Al Falah Banjaran
            </p>
          </div>

          {/* 3 Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white text-slate-800 rounded-xl p-5 shadow-sm border border-emerald-900/10 flex flex-col justify-between hover-lift transition-all"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                      <Image
                        src={item.photoUrl || "/images/avatar-1.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0B2238] leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {item.relation}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom message */}
          <div className="mt-8 pt-6 border-t border-emerald-700/50 text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              Cerita dan pengalaman orang tua menjadi bagian berharga dalam perjalanan kami mendampingi tumbuh kembang setiap anak.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
