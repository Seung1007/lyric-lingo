const LANGUAGE_TO_BCP47 = {
  일본어: "ja-JP",
  영어: "en-US",
  이탈리아어: "it-IT",
  독일어: "de-DE",
  프랑스어: "fr-FR",
  스페인어: "es-ES",
  중국어: "zh-CN",
  한국어: "ko-KR",
};

export function speakText(text, languageLabel) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGE_TO_BCP47[languageLabel] ?? "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
