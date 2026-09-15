import type { PresetMap } from '../types';

// Training content lives here, separate from component code, so presets can
// be edited or extended without touching the UI. See METHODOLOGY.md for the
// reasoning behind the progression these presets encode.
export const DEFAULT_PRESETS: PresetMap = {
  beginner: {
    name: 'Beginner',
    description: 'Full warm-up with Q-tip training',
    exercises: [
      { name: 'Behind the Teeth Hold', duration: 30, instruction: 'Place tongue behind upper front teeth. Push gently to feel a stretch.' },
      { name: 'RELAX - Slug Exercise', duration: 30, instruction: 'Move tongue VERY slowly in and out. Like a slug. Make it soft and relaxed.' },
      { name: 'Brushing Movement', duration: 60, instruction: 'Brush upper front teeth with tongue. Back and forth, left and right. Open mouth wider to increase stretch.' },
      { name: 'RELAX - Slug Exercise', duration: 30, instruction: 'Super slow, relaxed tongue movements. Calm your tongue down completely.' },
      { name: "Lip Trill 'Brrrr'", duration: 30, instruction: 'Relax lips, blow air through. Let them vibrate on their own. Feel passive vibration!' },
      { name: 'Q-tip Exercise', duration: 120, instruction: "Q-tip on middle/bottom of tongue. Say 'D-D-D-D' quickly. Vibrate Q-tip in one spot. Listen for Rolling R!" },
      { name: "Double Taps 'tta-tta-tta'", duration: 60, instruction: "American 'butter' style. As fast as you can. Try to recreate the Q-tip vibration feeling." },
      { name: 'Trill Attempts', duration: 30, instruction: 'WITHOUT Q-tip. Try to make the trilled R on its own. Remember the feeling!' },
      { name: 'Perro', duration: 60, instruction: "Practice saying 'perro' (dog). Focus on the double RR in the middle." },
      { name: 'Carro', duration: 60, instruction: "Practice saying 'carro' (car). Focus on the double RR." },
      { name: 'Rápido', duration: 30, instruction: "Practice saying 'rápido' (fast). R at the beginning." },
      { name: 'Rosa', duration: 30, instruction: "Practice saying 'rosa' (rose). Keep trying the trill!" },
      { name: 'RELAX - Cool Down', duration: 30, instruction: "Final slug exercise. Slow, relaxed movements. Gentle jaw stretches. You're done!" },
    ],
  },
  intermediate: {
    name: 'Intermediate',
    description: 'More practice time, less warm-up',
    exercises: [
      { name: 'Behind the Teeth Hold', duration: 30, instruction: 'Place tongue behind upper front teeth. Push gently to feel a stretch.' },
      { name: 'RELAX - Slug Exercise', duration: 30, instruction: 'Move tongue VERY slowly in and out. Like a slug. Make it soft and relaxed.' },
      { name: 'Brushing Movement', duration: 60, instruction: 'Brush upper front teeth with tongue. Back and forth, left and right. Open mouth wider to increase stretch.' },
      { name: 'RELAX - Slug Exercise', duration: 30, instruction: 'Super slow, relaxed tongue movements. Calm your tongue down completely.' },
      { name: 'Q-tip Exercise', duration: 90, instruction: "Q-tip on middle/bottom of tongue. Say 'D-D-D-D' quickly. Vibrate Q-tip in one spot. Listen for Rolling R!" },
      { name: "Double Taps 'tta-tta-tta'", duration: 90, instruction: "American 'butter' style. As fast as you can. Push for longer - you're building muscle memory!" },
      { name: 'Trill + Vowels', duration: 90, instruction: "Practice: rrrra, rrrre, rrrri, rrrro, rrrru. Start with trill, THEN flow into vowel. Don't stop between!" },
      { name: 'Perro', duration: 60, instruction: "Practice saying 'perro' (dog). Focus on the double RR in the middle." },
      { name: 'Carro', duration: 60, instruction: "Practice saying 'carro' (car). Focus on the double RR." },
      { name: 'Rápido', duration: 30, instruction: "Practice saying 'rápido' (fast). R at the beginning." },
      { name: 'Rosa', duration: 30, instruction: "Practice saying 'rosa' (rose). Keep trying the trill!" },
    ],
  },
  intermediate_short: {
    name: 'Intermediate Short',
    description: 'Quick 5-minute focused practice',
    exercises: [
      { name: 'RELAX - Slug Exercise', duration: 30, instruction: 'Move tongue VERY slowly in and out. Quick warm-up only.' },
      { name: 'Q-tip Exercise', duration: 60, instruction: 'Q-tip on middle/bottom of tongue. Quick reset - feel the vibration!' },
      { name: "Double Taps 'tta-tta-tta'", duration: 60, instruction: "American 'butter' style. As fast as you can!" },
      { name: 'Trill + Vowels', duration: 60, instruction: 'Practice: rrrra, rrrre, rrrri, rrrro, rrrru. Flow from trill to vowel!' },
      { name: 'Perro', duration: 45, instruction: "Practice saying 'perro' (dog). Focus on the double RR." },
      { name: 'Carro', duration: 45, instruction: "Practice saying 'carro' (car). Focus on the double RR." },
    ],
  },
  focused_9min: {
    name: 'Focused 9min',
    description: 'Vowel→trill initiation + consonant launches',
    exercises: [
      { name: 'RELAX - Slug Exercise', duration: 30, instruction: "Move tongue VERY slowly. Just loosening up — you don't need much warm-up anymore." },
      { name: 'Trill Check + Vowels', duration: 60, instruction: "Get the trill running freely, then flow it into vowels: rrrra · rrrre · rrrro. Don't force it — just confirm it's on and bouncing before the hard work." },
      { name: 'Vowel → Trill', duration: 150, instruction: 'a-rrr · e-rrr · i-rrr · o-rrr · u-rrr. Start the vowel, then launch the trill out of it. This is the frontier — the exact motion perro needs. Vary the vowel you launch from.' },
      { name: 'Vowel → Trill → Vowel', duration: 90, instruction: "a-rrrra · e-rrrre · o-rrrro. Launch plus a controlled ending. Let the final vowel crash in to end the trill — don't stop it yourself." },
      { name: 'Consonant → Trill (phrases)', duration: 90, instruction: "R starting a word, launched out of the previous consonant — airflow straight through, don't stop between words. Easy first: el río · un ratón. Then s-launches: más rápido · es raro · Israel." },
      { name: 'VTV words (rotate)', duration: 90, instruction: "Trill between vowels, varied launches. Cycle them, don't drill one to death: perro · carro · burro · tierra · torre · churro. Steady airflow; let the final vowel end the trill." },
      { name: 'RELAX - Cool Down', duration: 30, instruction: "Slow slug movements. Relax the jaw. You're done!" },
    ],
  },
  focused_4min: {
    name: 'Focused 4min',
    description: 'Quick 4-minute version for busy days',
    exercises: [
      { name: 'RELAX - Slug Exercise', duration: 30, instruction: 'Move tongue VERY slowly in and out. Quick loosen-up only.' },
      { name: 'Vowel → Trill', duration: 90, instruction: 'Start from a vowel, then launch the trill: a→rrr, e→rrr, i→rrr, o→rrr, u→rrr. Focus on initiating the trill straight out of the vowel.' },
      { name: 'Perro', duration: 60, instruction: "Practice 'perro' (dog). The e→rr is exactly your vowel→trill motion. Keep the burst short and controlled." },
      { name: 'Carro', duration: 60, instruction: "Practice 'carro' (car). Same a→rr launch. Aim for a short, controlled burst — don't let it run long." },
    ],
  },
};
