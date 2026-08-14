"use client";

import { useState } from "react";
import { Music, Mic2, Volume2, BookOpen, Sparkles } from "lucide-react";
import { speakText } from "@/lib/tts";

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

function LyricInputPanel({ onAnalyzed }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "분석에 실패했습니다.");
      onAnalyzed(data);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-dashed border-violet-300 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Sparkles size={16} className="text-violet-500" />
        내 가사 직접 분석하기
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="가사를 한 줄씩 붙여넣으세요"
        rows={4}
        className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-violet-400 resize-none"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className="w-full py-2 rounded-xl bg-violet-600 text-white text-sm font-medium disabled:opacity-40 transition-opacity"
      >
        {loading ? "분석 중..." : "AI로 분석하기"}
      </button>
    </div>
  );
}

function LearnModeTab({ songs }) {
  const [customSongs, setCustomSongs] = useState([]);
  const allSongs = [...customSongs, ...songs];
  const [selectedSong, setSelectedSong] = useState(allSongs[0] ?? null);

  const handleAnalyzed = (data) => {
    const newSong = {
      id: `custom-${crypto.randomUUID()}`,
      title: "내가 입력한 가사",
      artist: "",
      language: data.language,
      lines: data.lines.map((line, i) => ({
        id: `custom-line-${i}`,
        original_text: line.original,
        romanized_text: line.romanized,
        meaning_text: line.meaning,
      })),
    };
    setCustomSongs((prev) => [newSong, ...prev]);
    setSelectedSong(newSong);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">노래로 배우기</h2>
        <p className="text-sm text-slate-500">좋아하는 노래 가사로 발음과 뜻을 바로 확인해보세요.</p>
      </div>

      <LyricInputPanel onAnalyzed={handleAnalyzed} />

      {allSongs.length === 0 ? (
        <div className="text-sm text-slate-400">등록된 노래가 아직 없어요.</div>
      ) : (
        <>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {allSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => setSelectedSong(song)}
                className={`flex-shrink-0 text-left px-4 py-3 rounded-2xl border transition-all min-w-[160px]
                  ${selectedSong?.id === song.id
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

          {selectedSong && (
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
              <button
                onClick={() =>
                  speakText(
                    selectedSong.lines.map((l) => l.original_text).join(". "),
                    selectedSong.language
                  )
                }
                className="flex items-center gap-2 text-sm text-violet-600 font-medium mt-2"
              >
                <Volume2 size={16} /> 발음 들어보기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function VocalDictionTab({ dictionSong }) {
  const [customSongs, setCustomSongs] = useState([]);
  const baseSongs = dictionSong ? [dictionSong] : [];
  const allSongs = [...customSongs, ...baseSongs];
  const [selectedSong, setSelectedSong] = useState(allSongs[0] ?? null);

  const handleAnalyzed = (data) => {
    const newSong = {
      id: `custom-${crypto.randomUUID()}`,
      title: "내가 입력한 가사",
      language: data.language,
      lines: data.lines.map((line, i) => ({
        id: `custom-line-${i}`,
        original_text: line.original,
        ipa_text: line.ipa,
        note_text: line.note,
      })),
    };
    setCustomSongs((prev) => [newSong, ...prev]);
    setSelectedSong(newSong);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">성악 전문 모드</h2>
        <p className="text-sm text-slate-500">IPA 기반 정밀 딕션 분석 — 기존 도구 기능을 그대로 유지합니다.</p>
      </div>

      <LyricInputPanel onAnalyzed={handleAnalyzed} />

      {allSongs.length === 0 ? (
        <div className="text-sm text-slate-400">등록된 딕션 곡이 아직 없어요.</div>
      ) : (
        <>
          {allSongs.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {allSongs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => setSelectedSong(song)}
                  className={`flex-shrink-0 text-left px-4 py-3 rounded-2xl border transition-all min-w-[160px]
                    ${selectedSong?.id === song.id
                      ? "border-slate-400 bg-slate-50"
                      : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <div className="text-sm font-medium text-slate-800">{song.title}</div>
                  <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {song.language}
                  </span>
                </button>
              ))}
            </div>
          )}

          {selectedSong && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Mic2 size={18} className="text-slate-500" />
                {selectedSong.title}
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {selectedSong.language}
                </span>
              </div>
              {selectedSong.lines.map((line) => (
                <div key={line.id} className="border-l-2 border-slate-200 pl-4 py-1">
                  <p className="text-slate-800 font-medium">{line.original_text}</p>
                  <p className="text-sm text-slate-500 font-mono mt-0.5">[{line.ipa_text}]</p>
                  <p className="text-sm text-slate-400 mt-1 flex items-start gap-1">
                    <BookOpen size={14} className="mt-0.5 flex-shrink-0" /> {line.note_text}
                  </p>
                </div>
              ))}
              <button
                onClick={() =>
                  speakText(
                    selectedSong.lines.map((l) => l.original_text).join(". "),
                    selectedSong.language
                  )
                }
                className="flex items-center gap-2 text-sm text-slate-600 font-medium mt-2"
              >
                <Volume2 size={16} /> 발음 들어보기
              </button>
            </div>
          )}
        </>
      )}
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
