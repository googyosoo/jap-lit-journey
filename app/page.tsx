import { chapters } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, MapPin, Map as MapIcon, Book, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Header */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl h-auto min-h-[calc(100vh-100px)] md:h-auto md:min-h-0 md:aspect-[21/9] bg-stone-900 group flex flex-col justify-end">
        {/* Placeholder for Hero Image - in real app would use next/image */}
        <div className="absolute inset-0 bg-[url('/images/tokyo_cherry_blossom.png')] bg-cover bg-center opacity-60 transition-opacity duration-700 group-hover:opacity-70 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <div className="relative z-10 p-6 pt-20 md:p-12 text-white max-w-2xl w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sakura-500/80 backdrop-blur-md text-xs font-bold mb-4">
            <span className="animate-pulse">●</span> START YOUR JOURNEY
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4 leading-tight">
            책으로 떠나는 <br />
            <span className="text-sakura-300">일본 문학 여행</span>
          </h1>
          <p className="text-stone-300 text-lg md:text-xl font-light mb-8 max-w-lg">
            나츠메 소세키의 도쿄부터 미시마 유키오의 교토까지.
            언어와 문학이 안내하는 15일간의 여정.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href="/chapter/1"
              className="inline-flex justify-center items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-full font-bold hover:bg-sakura-100 transition-colors w-full sm:w-auto"
            >
              여행 시작하기 <ArrowRight size={18} />
            </Link>
            <Link
              href="/passport"
              className="inline-flex justify-center items-center gap-2 bg-stone-900/60 backdrop-blur-sm border border-stone-500 text-white px-6 py-3 rounded-full font-bold hover:bg-stone-800/80 transition-colors w-full sm:w-auto"
            >
              <MapIcon size={18} className="text-sakura-300" /> 내 여권
            </Link>
            <Link
              href="/wordbook"
              className="inline-flex justify-center items-center gap-2 bg-indigo-900/80 backdrop-blur-sm border border-indigo-500 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-800/80 transition-colors w-full sm:w-auto"
            >
              <Book size={18} className="text-indigo-300" /> 단어장
            </Link>
            <Link
              href="/quiz"
              className="inline-flex justify-center items-center gap-2 bg-emerald-900/80 backdrop-blur-sm border border-emerald-500 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-800/80 transition-colors w-full sm:w-auto"
            >
              <Trophy size={18} className="text-emerald-300" /> 퀴즈
            </Link>
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-serif text-indigo-900 flex items-center gap-2">
            <span className="text-sakura-500 text-3xl">✿</span> 여행 코스 (1~15과)
          </h2>
          <span className="text-sm text-stone-500">{chapters.length}개의 목적지</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/chapter/${chapter.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100 hover:-translate-y-1 block h-full flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                {/* Fallback pattern if no image */}
                <div className="absolute inset-0 bg-stone-100 flex items-center justify-center text-stone-300">
                  <MapPin size={48} />
                </div>
                {/* Display chapter image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${chapter.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-900 shadow-sm">
                  Day {chapter.id}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-sakura-700 tracking-wider uppercase">{chapter.location}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-sakura-700 transition-colors line-clamp-1">
                  {chapter.title}
                </h3>
                <p className="text-stone-500 text-sm line-clamp-2 mb-4 flex-1">
                  {chapter.description}
                </p>
                <div className="flex items-center text-xs text-indigo-900 font-medium group-hover:translate-x-1 transition-transform">
                  여행하기 <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
