import { supabase } from "./supabase";

export async function getSongsByMode(mode) {
  const { data, error } = await supabase
    .from("songs")
    .select(
      "id, title, artist, mode, language:languages(name), lyric_lines(id, line_order, original_text, romanized_text, meaning_text, ipa_text, note_text)"
    )
    .eq("mode", mode)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data.map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    language: song.language?.name ?? "",
    lines: [...song.lyric_lines].sort((a, b) => a.line_order - b.line_order),
  }));
}
