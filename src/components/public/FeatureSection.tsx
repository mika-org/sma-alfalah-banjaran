import { Trophy, Heart, School, BookOpen, Star, Award } from "lucide-react";
import { FeatureItem } from "@/data/mock-site";

interface FeatureSectionProps {
  features: FeatureItem[];
}

export default function FeatureSection({ features }: FeatureSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="w-7 h-7 text-[#0D4A38]" />;
      case "heart":
        return <Heart className="w-7 h-7 text-[#0D4A38]" />;
      case "building":
        return <School className="w-7 h-7 text-[#0D4A38]" />;
      case "book":
        return <BookOpen className="w-7 h-7 text-[#0D4A38]" />;
      case "star":
        return <Star className="w-7 h-7 text-[#0D4A38]" />;
      default:
        return <Award className="w-7 h-7 text-[#0D4A38]" />;
    }
  };

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D4A38] tracking-tight">
            Mengapa Memilih Kami
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            SMA Al Falah Banjaran adalah sekolah islami unggul, berkarakter
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover-lift flex flex-col items-start transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center justify-center mb-4 flex-shrink-0">
                {getIcon(item.icon)}
              </div>
              <h3 className="text-base font-bold text-[#0B2238] mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
