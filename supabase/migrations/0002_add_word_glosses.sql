-- Add per-line word-by-word glosses for 성악 전문 모드 (diction mode)
alter table lyric_lines
  add column word_glosses jsonb;

comment on column lyric_lines.word_glosses is
  'Array of {word, meaning} objects for word-by-word translation, used by diction mode.';
