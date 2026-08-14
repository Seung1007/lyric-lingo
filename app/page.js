import LyricLingoApp from "./components/LyricLingoApp";
import { getSongsByMode } from "@/lib/queries";

export default async function Home() {
  const [popSongs, dictionSongs] = await Promise.all([
    getSongsByMode("pop"),
    getSongsByMode("diction"),
  ]);

  return <LyricLingoApp songs={popSongs} dictionSong={dictionSongs[0] ?? null} />;
}
