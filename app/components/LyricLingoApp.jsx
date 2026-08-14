"use client";

import { useState } from "react";
import { Music, Mic2, Volume2, BookOpen, Sparkles } from "lucide-react";

// ---------------------------------------------
// Lyric Lingo
// 탭 1: 노래로 배우기 (대중 타겟)
// 탭 2: 성악 전문 모드 (기존 딕션 기능)
// ---------------------------------------------

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

function LearnModeTab({ songs }) {
  const [selectedSong, setSelectedSong] = useState(songs[0] ?? null);

  if (!selectedSong) {
    return (
      <div className="text-sm text-slate-400">등록된 노래가 아직 없어요.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">노래로 배우기</h2>
        <p className="text-sm text-slate-500">좋아하는 노래 가사로 발음과 뜻을 바로 확인해보세요.</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {songs.map((song) => (
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
        {selectedSong.lines.map((line) => (
          <div key={line.id} className="border-l-2 border-violet-200 pl-4 py-1">
            <p className="text-slate-800 font-medium">{line.original_text}</p>
            {line.romanized_text && (
              <p className="text-sm text-slate-400 italic mt-0.5">{line.romanized_text}</p>
            )}
            <p className="text-sm text-violet-600 mt-1">{line.meaning_text}</p>
          </div>
        ))}
        <button className="flex items-center gap-2 text-sm text-violet-600 font-medium mt-2">
          <Volume2 size={16} /> 발음 들어보기
        </button>
      </div>
    </div>
  );
}

function VocalDictionTab({ dictionSong }) {
  if (!dictionSong) {
    return (
      <div className="text-sm text-slate-400">등록된 딕션 곡이 아직 없어요.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">성악 전문 모드</h2>
        <p className="text-sm text-slate-500">IPA 기반 정밀 딕션 분석 — 기존 도구 기능을 그대로 유지합니다.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-medium">
          <Mic2 size={18} className="text-slate-500" />
          {dictionSong.title}
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            {dictionSong.language}
          </span>
        </div>
        {dictionSong.lines.map((line) => (
          <div key={line.id} className="border-l-2 border-slate-200 pl-4 py-1">
            <p className="text-slate-800 font-medium">{line.original_text}</p>
            <p className="text-sm text-slate-500 font-mono mt-0.5">[{line.ipa_text}]</p>
            <p className="text-sm text-slate-400 mt-1 flex items-start gap-1">
              <BookOpen size={14} className="mt-0.5 flex-shrink-0" /> {line.note_text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LyricLingoApp({ songs, dictionSong }) {
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

        {tab === "learn" ? (
          <LearnModeTab songs={songs} />
        ) : (
          <VocalDictionTab dictionSong={dictionSong} />
        )}
      </div>
    </div>
  );
}
