import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "en" | "ar";

// Translation keys. Keep flat for simplicity.
export interface Strings {
  // Header
  eyebrow: string;
  title: string;
  subtitle: string;

  // Modes
  chooseTrial: string;
  modeHvh: string;
  modeHvhSub: string;
  modeHva: string;
  modeHvaSub: string;
  modeAva: string;
  modeAvaSub: string;
  versus: string;

  // Difficulty
  aiWisdom: string;
  ankhAi: string;
  eyeAi: string;
  diffApprentice: string;
  diffApprenticeSub: string;
  diffScribe: string;
  diffScribeSub: string;
  diffPharaoh: string;
  diffPharaohSub: string;
  pharaohWarning: string;

  // Scoreboard
  ledger: string;
  ankh: string;
  eye: string;
  draws: string;
  toMove: string;

  // Controls
  sanctum: string;
  newTrial: string;
  reset: string;
  pause: string;
  resume: string;
  step: string;
  speed: string;
  muteOn: string;
  muteOff: string;
  skipToGame: string;

  // Verdict
  gloryToAnkh: string;
  gloryToEye: string;
  sandsAreEven: string;

  // Thinking panel
  thinkingTitle: string;
  thinkingSub: string;
  thinkingIdle: string;
  thinkingWaiting: string;
  candidateMoves: string;
  candidateExplain: string;
  chosen: string;
  pruned: string;
  nodes: string;
  outcomeWin: string;
  outcomeDraw: string;
  outcomeLose: string;
  ifPlaysHere: string;
  outcomeLabel: string;

  // Cell labels
  cellNW: string; cellN: string; cellNE: string;
  cellW: string; cellC: string; cellE: string;
  cellSW: string; cellS: string; cellSE: string;

  // Algorithm explainer
  scrollTitle: string;
  scrollSubtitle: string;
  sectionMinimaxTitle: string;
  sectionMinimaxBody: string;
  sectionWhyTitle: string;
  sectionWhyBody: string;
  sectionPruneTitle: string;
  sectionPruneBody: string;
  sectionFasterTitle: string;
  sectionFasterBody: string;
  sectionTiersTitle: string;
  tierApprenticeLine: string;
  tierScribeLine: string;
  tierPharaohLine: string;
  pseudocodeTitle: string;

  // Footer
  footer: string;

  // Language toggle
  langToggle: string; // shows the *other* lang's label
}

const EN: Strings = {
  eyebrow: "A Trial of the Mind",
  title: "Pharaoh's Gambit",
  subtitle:
    "Three in a row was once etched in temple sand. Today, the same game teaches a machine to think. Stand before the board — and watch the Pharaoh reason.",

  chooseTrial: "Choose the Trial",
  modeHvh: "Mortal vs Mortal",
  modeHvhSub: "Two players, one board",
  modeHva: "Mortal vs Pharaoh",
  modeHvaSub: "You play the Ankh",
  modeAva: "Trial of the Gods",
  modeAvaSub: "Watch the AI face itself",
  versus: "vs",

  aiWisdom: "Wisdom of the AI",
  ankhAi: "Ankh AI",
  eyeAi: "Eye of Horus AI",
  diffApprentice: "Apprentice",
  diffApprenticeSub: "random scribe",
  diffScribe: "Scribe",
  diffScribeSub: "shallow foresight",
  diffPharaoh: "Pharaoh",
  diffPharaohSub: "unbeatable",
  pharaohWarning:
    "Two Pharaohs always draw — pair Pharaoh with Apprentice or Scribe to see real combat.",

  ledger: "Scribe's Ledger",
  ankh: "Ankh",
  eye: "Eye of Horus",
  draws: "Draws",
  toMove: "to move",

  sanctum: "Sanctum",
  newTrial: "New Trial",
  reset: "Reset",
  pause: "Pause",
  resume: "Resume",
  step: "Step",
  speed: "Speed",
  muteOn: "Unmute sound",
  muteOff: "Mute sound",
  skipToGame: "Skip to game",

  gloryToAnkh: "Glory to the Ankh",
  gloryToEye: "Glory to the Eye of Horus",
  sandsAreEven: "The Sands Are Even",

  thinkingTitle: "The Pharaoh Contemplates",
  thinkingSub: "Every move evaluated. Every reply foreseen.",
  thinkingIdle:
    "When the AI takes a turn, its decision tree will appear here — every considered move and its rated future.",
  thinkingWaiting: "Reading the future…",
  candidateMoves: "Candidate Moves",
  candidateExplain:
    "Each move the AI considered, with the guaranteed final outcome it leads to.",
  chosen: "chosen",
  pruned: "pruned",
  nodes: "nodes",
  outcomeWin: "win in {n}",
  outcomeDraw: "draw",
  outcomeLose: "lose in {n}",
  ifPlaysHere: "if played here",
  outcomeLabel: "Outcome",

  cellNW: "NW", cellN: "N", cellNE: "NE",
  cellW: "W",  cellC: "C", cellE: "E",
  cellSW: "SW", cellS: "S", cellSE: "SE",

  scrollTitle: "The Scroll of the Algorithm",
  scrollSubtitle: "How the Pharaoh Thinks",
  sectionMinimaxTitle: "The Minimax Algorithm",
  sectionMinimaxBody:
    "The Pharaoh thinks not by intuition but by exhausting every possible future. It descends to the end of every story and rates the ending — +10 for victory, −10 for defeat, 0 for a draw — then walks back, alternately choosing the best score on its own turn and assuming the opponent will choose the worst on theirs.",
  sectionWhyTitle: "Why Tic-Tac-Toe?",
  sectionWhyBody:
    "With only 255,168 possible games, the entire tree fits in memory. Two perfect players always draw. That makes this ancient game the canonical training ground for the algorithm.",
  sectionPruneTitle: "Alpha-Beta Pruning",
  sectionPruneBody:
    "As it searches, the Pharaoh remembers alpha — the best score already guaranteed — and beta — the best the opponent will permit. When a branch becomes worse than what is already on the table, it stops: that branch cannot change the answer.",
  sectionFasterTitle: "Winning Faster, Losing Slower",
  sectionFasterBody:
    "A naive minimax thinks all wins are equal. The Pharaoh disagrees: a leaf is worth (10 − depth) for a win and (−10 + depth) for a loss. When victory is certain, it chooses the shortest path. When defeat is inevitable, it delays — hoping the mortal will err.",
  sectionTiersTitle: "The Three Tiers",
  tierApprenticeLine:
    "Apprentice — no search at all. Picks at random. A first opponent for the student.",
  tierScribeLine:
    "Scribe — minimax limited to 2 plies. Sees danger but not the trap behind the trap.",
  tierPharaohLine:
    "Pharaoh — full minimax with alpha-beta and the faster-wins tiebreak. Never loses.",
  pseudocodeTitle: "Pseudocode",

  footer: "Built with Next.js, Tailwind CSS, and a touch of papyrus dust.",
  langToggle: "العربية",
};

const AR: Strings = {
  eyebrow: "محاكمة العقل",
  title: "تحدّي الفرعون",
  subtitle:
    "ثلاثة في صفٍّ واحد، نقشت يوماً في رمال المعابد. واليوم، تعلّم اللعبة ذاتها آلةً كيف تفكّر. قف أمام الرّقعة، وراقب الفرعون يستدلّ.",

  chooseTrial: "اختر التحدّي",
  modeHvh: "إنسان ضدّ إنسان",
  modeHvhSub: "لاعبان على رقعة واحدة",
  modeHva: "إنسان ضدّ الفرعون",
  modeHvaSub: "تلعب بالعنخ",
  modeAva: "نزال الآلهة",
  modeAvaSub: "شاهد الآلة تواجه نفسها",
  versus: "ضدّ",

  aiWisdom: "حكمة الذكاء",
  ankhAi: "ذكاء العنخ",
  eyeAi: "ذكاء عين حورس",
  diffApprentice: "مُتدرِّب",
  diffApprenticeSub: "كاتب عشوائي",
  diffScribe: "كاتب",
  diffScribeSub: "بصيرة قريبة",
  diffPharaoh: "فرعون",
  diffPharaohSub: "لا يُهزم",
  pharaohWarning:
    "فرعونان لا يلتقيان إلا على تعادل — اقرن الفرعون بالمتدرّب أو الكاتب لترى نزالاً حقيقياً.",

  ledger: "سجلّ الكاتب",
  ankh: "العنخ",
  eye: "عين حورس",
  draws: "تعادل",
  toMove: "دوره",

  sanctum: "الحرم",
  newTrial: "محاكمة جديدة",
  reset: "إعادة",
  pause: "إيقاف",
  resume: "استئناف",
  step: "خطوة",
  speed: "السرعة",
  muteOn: "تشغيل الصوت",
  muteOff: "كتم الصوت",
  skipToGame: "تخطَّ إلى اللعبة",

  gloryToAnkh: "المجد للعنخ",
  gloryToEye: "المجد لعين حورس",
  sandsAreEven: "تساوت الرّمال",

  thinkingTitle: "الفرعون يتأمّل",
  thinkingSub: "كل حركة تُقيَّم، وكل ردّ يُبصَر.",
  thinkingIdle:
    "حين تأخذ الآلة دورها، تظهر هنا شجرة قراراتها — كل حركة تأمّلتها والمصير الذي قدّرته لها.",
  thinkingWaiting: "يقرأ المستقبل…",
  candidateMoves: "الحركات المرشّحة",
  candidateExplain:
    "كل حركة تأمّلت فيها الآلة، مع النتيجة النهائية المضمونة التي تقود إليها.",
  chosen: "المختارة",
  pruned: "محذوفة",
  nodes: "عقدة",
  outcomeWin: "فوز خلال {n}",
  outcomeDraw: "تعادل",
  outcomeLose: "خسارة خلال {n}",
  ifPlaysHere: "إن لُعب هنا",
  outcomeLabel: "المصير",

  cellNW: "شغ", cellN: "ش", cellNE: "شق",
  cellW:  "غ",  cellC: "م", cellE:  "ق",
  cellSW: "جغ", cellS: "ج", cellSE: "جق",

  scrollTitle: "لفيفة الخوارزمية",
  scrollSubtitle: "كيف يفكّر الفرعون",
  sectionMinimaxTitle: "خوارزمية الميني-ماكس",
  sectionMinimaxBody:
    "لا يفكّر الفرعون بالحدس بل باستنفاد كلّ مستقبلٍ ممكن. ينزل إلى نهاية كلّ قصّة ويقيّم خاتمتها: +١٠ للنصر، -١٠ للهزيمة، ٠ للتعادل. ثم يصعد عائداً، فيختار في دوره أعلى نتيجة، ويفترض أن خصمه سيختار في دوره أسوأها له.",
  sectionWhyTitle: "لِمَ إكس-أو؟",
  sectionWhyBody:
    "لا تتجاوز اللعبة 255,168 خاتمة ممكنة، فتسع شجرة قراراتها للذّاكرة كاملةً. وكل لاعبَين كاملَين تنتهي مباراتهما بالتعادل. ولذا تُعدّ هذه اللعبة العتيقة الميدانَ الكلاسيكيّ لتعليم الخوارزمية.",
  sectionPruneTitle: "تشذيب ألفا-بيتا",
  sectionPruneBody:
    "في أثناء البحث، يحفظ الفرعون قيمتين: ألفا — أفضل ما ضمنه لنفسه — وبيتا — أفضل ما يسمح به خصمه. فإذا أصبح فرعٌ أسوأ ممّا في يده، توقّف: ذلك الفرع لن يغيّر الجواب.",
  sectionFasterTitle: "نصرٌ أسرع، خسارة أبطأ",
  sectionFasterBody:
    "تظنّ خوارزمية ميني-ماكس البسيطة أن كل الانتصارات سواء. الفرعون يخالفها: الورقة تساوي (١٠ - العمق) للنصر، و(-١٠ + العمق) للهزيمة. حين النصر مؤكَّد يختار أقصر طريقٍ إليه، وحين الهزيمة محتومة يماطل، عسى أن يخطئ الفاني.",
  sectionTiersTitle: "المراتب الثلاث",
  tierApprenticeLine:
    "المُتدرِّب — لا بحث البتة. يختار عشوائياً. خصم أوّل للمتعلِّم.",
  tierScribeLine:
    "الكاتب — ميني-ماكس بعمقٍ محدود (طيتان). يبصر الخطر، لا الفخّ خلف الفخّ.",
  tierPharaohLine:
    "الفرعون — ميني-ماكس كاملة مع تشذيب ألفا-بيتا وأفضليّة النصر الأسرع. لا يُهزم.",
  pseudocodeTitle: "الشيفرة الرمزيّة",

  footer: "بُنيت بـ Next.js وTailwind CSS وغبار البَردي.",
  langToggle: "English",
};

const STRINGS: Record<Locale, Strings> = { en: EN, ar: AR };

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
      toggle: () => set({ locale: get().locale === "en" ? "ar" : "en" }),
    }),
    { name: "pharaoh-locale" },
  ),
);

/** Hook returning the active string bag. */
export function useStrings(): Strings {
  const locale = useLocaleStore((s) => s.locale);
  return STRINGS[locale];
}

/** For one-off lookups outside React (e.g., zustand actions). */
export function getStrings(locale: Locale): Strings {
  return STRINGS[locale];
}

/** Whether the current locale is right-to-left. */
export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

/**
 * Format an outcome score (e.g. +8) and the moves-until-terminal into a
 * human-readable phrase like "win in 2" / "lose in 4" / "draw".
 *
 * In the minimax convention used here, a positive score with `score = 10 - n`
 * means the AI wins in `n` plies; a negative score with `score = -10 + n` means
 * the AI loses in `n` plies; and 0 is a draw.
 */
export function describeOutcome(strings: Strings, score: number): string {
  if (Number.isNaN(score)) return "—";
  if (score === 0) return strings.outcomeDraw;
  if (score > 0) return strings.outcomeWin.replace("{n}", String(10 - score));
  return strings.outcomeLose.replace("{n}", String(10 + score));
}
