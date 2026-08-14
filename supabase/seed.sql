-- Seed data mirroring the current in-app sample content

insert into languages (code, name) values
  ('ja', '일본어'),
  ('en', '영어'),
  ('it', '이탈리아어')
on conflict (code) do nothing;

insert into songs (id, title, artist, language_code, mode) values
  ('00000000-0000-0000-0000-000000000001', 'Lemon', '米津玄師 (요네즈 켄시)', 'ja', 'pop'),
  ('00000000-0000-0000-0000-000000000002', 'Let It Go', 'Frozen OST', 'en', 'pop'),
  ('00000000-0000-0000-0000-000000000003', 'Caro nome (리골레토 중)', 'Giuseppe Verdi', 'it', 'diction')
on conflict (id) do nothing;

insert into lyric_lines (song_id, line_order, original_text, romanized_text, meaning_text) values
  ('00000000-0000-0000-0000-000000000001', 1, '夢ならばどれほど良かったでしょう', 'Yume naraba dore hodo yokatta deshou', '꿈이라면 얼마나 좋았을까요'),
  ('00000000-0000-0000-0000-000000000001', 2, '未だにあなたのことを夢にみる', 'Imada ni anata no koto o yume ni miru', '아직도 당신을 꿈에서 봐요'),
  ('00000000-0000-0000-0000-000000000002', 1, 'The snow glows white on the mountain tonight', null, '오늘 밤 산 위에 눈이 하얗게 빛나네'),
  ('00000000-0000-0000-0000-000000000002', 2, 'Not a footprint to be seen', null, '발자국 하나 보이지 않아')
on conflict (song_id, line_order) do nothing;

insert into lyric_lines (song_id, line_order, original_text, ipa_text, note_text) values
  ('00000000-0000-0000-0000-000000000003', 1, 'Caro nome che il mio cor', 'ˈka.ro ˈnɔ.me ke il mio kɔr', '''nome''의 이중자음 처리, 개모음 [ɔ] 유의'),
  ('00000000-0000-0000-0000-000000000003', 2, 'festi primo palpitar', 'ˈfɛs.ti ˈpri.mo pal.pi.ˈtar', '''palpitar'' 어말 r 굴림, 강세 위치 확인')
on conflict (song_id, line_order) do nothing;
