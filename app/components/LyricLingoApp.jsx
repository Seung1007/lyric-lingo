"use client";

import { useState } from "react";
import { Music, Mic2, Volume2, BookOpen, Sparkles } from "lucide-react";

// ---------------------------------------------
// Lyric Lingo
// 탭 1: 노래로 배우기 (대중 타겟)
// 탭 2: 성악 전문 모드 (기존 딕션 기능)
// ---------------------------------------------

const SAMPLE_SONGS = [
  {
    id: 1,
    title: "Lemon",
    artist: "米津玄師 (요네즈 켄시)",
    language: "일본어",
    lines: [
      { original: "夢ならばどれほど良かったでしょう", romanized: "Yume naraba dore hodo yokatta deshou", meaning: "꿈이라면 얼마나 좋았을까요" },
      { original: "未だにあなたのことを夢にみる", romanized: "Imada ni anata no koto o yume ni miru", meaning: "아직도 당신을 꿈에서 봐요" },
    ],
  },
  {
    id: 2,
    title: "Let It Go",
    artist: "Frozen OST",
    language: "영어",
    lines: [
      { original: "The snow glows white on the mountain tonight", romanized: "", meaning: "오늘 밤 산 위에 눈이 하얗게 빛나네" },
      { original: "Not a footprint to be seen", romanized: "", meaning: "발자국 하나 보이지 않아" },
    ],
  },
];

const DICTION_SAMPLE = {
  title: "Caro nome (리골레토 중)",
  language: "이탈리아어",
  lines: [
    { original: "Caro nome che il mio cor", ipa: "ˈka.ro ˈnɔ.me ke il mio kɔr", note: "'nome'의 이중자음 처리, 개모음 [ɔ] 유의" },
    { original: "festi primo palpitar", ipa: "ˈfɛs.ti ˈpri.mo pal.pi.ˈtar", note: "'palpitar' 어말 r 굴림, 강세 위치 확인" },
  ],
};

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all
        ${active
          ? "bg-violet-600 text-white shadow-md shadow-violet-200"
          : "bg-white text-slate-500 hover:text-slate-800 border border-slate-200"}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function LearnModeTab() {
  const [selectedSong, setSelectedSong] = useState(SAMPLE_SONGS[0]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">노래로 배우기</h2>
        <p className="text-sm text-slate-500">좋아하는 노래 가사로 발음과 뜻을 바로 확인해보세요.</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {SAMPLE_SONGS.map((song) => (
          <button
            key={song.id}
            onClick={() => setSelectedSong(song)}
            className={`flex-shrink-0 text-left px-4 py-3 rounded-2xl border transition-all min-w-[160px]
              ${selectedSong.id === song.id
                ? "border-violet-400 bg-violet-50"
                : "border-slate-200 bg-white hover:border-slate-300"}`}
          >
            <div className="text-sm font-medium text-slate-800">{song.title}</div>
            <div className="text-xs text-slate-400">{song.artist}</div>
            <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {song.language}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-medium">
          <Music size={18} className="text-violet-500" />
          {selectedSong.title}
        </div>
        {selectedSong.lines.map((line, i) => (
          <div key={i} className="border-l-2 border-violet-200 pl-4 py-1">
            <p className="text-slate-800 font-medium">{line.original}</p>
            {line.romanized && (
              <p className="text-sm text-slate-400 italic mt-0.5">{line.romanized}</p>
            )}
            <p className="text-sm text-violet-600 mt-1">{line.meaning}</p>
          </div>
        ))}
        <button className="flex items-center gap-2 text-sm text-violet-600 font-medium mt-2">
          <Volume2 size={16} /> 발음 들어보기
        </button>
      </div>
    </div>
  );
}

function VocalDictionTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">성악 전문 모드</h2>
        <p className="text-sm text-slate-500">IPA 기반 정밀 딕션 분석 — 기존 도구 기능을 그대로 유지합니다.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-medium">
          <Mic2 size={18} className="text-slate-500" />
          {DICTION_SAMPLE.title}
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            {DICTION_SAMPLE.language}
          </span>
        </div>
        {DICTION_SAMPLE.lines.map((line, i) => (
          <div key={i} className="border-l-2 border-slate-200 pl-4 py-1">
            <p className="text-slate-800 font-medium">{line.original}</p>
            <p className="text-sm text-slate-500 font-mono mt-0.5">[{line.ipa}]</p>
            <p className="text-sm text-slate-400 mt-1 flex items-start gap-1">
              <BookOpen size={14} className="mt-0.5 flex-shrink-0" /> {line.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LyricLingoApp() {
  const [tab, setTab] = useState("learn");

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-violet-500" />
          <h1 className="text-2xl font-bold text-slate-900">Lyric Lingo</h1>
        </div>

        <div className="flex gap-2 mb-6">
          <TabButton active={tab === "learn"} onClick={() => setTab("learn")} icon={Music} label="노래로 배우기" />
          <TabButton active={tab === "diction"} onClick={() => setTab("diction")} icon={Mic2} label="성악 전문 모드" />
        </div>

        {tab === "learn" ? <LearnModeTab /> : <VocalDictionTab />}
      </div>
    </div>
  );
}
