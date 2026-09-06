const phrases = [
  { lines: ['Your mission.'], label: '01 / YOUR AMBITION', copy: 'It starts with the problem you want to solve.' },
  { lines: ['Our engineers.'], label: '02 / YOUR ENGINEERING PARTNERS', copy: 'Embedded with your team. Invested in your outcome.' },
  { lines: ['Closer to', 'the problem.'], label: '03 / UNDERSTAND THE WORK', copy: 'Your people, your systems, your real-world context.' },
  { lines: ['Faster to the', 'deployed solution.'], label: '04 / BUILD WHAT MATTERS', copy: 'From the first conversation to a product your team can use.' },
];

export default function HeroPunchline() {
  return <div className="story-chapters hero-punchline">
    <h1 className="sr-only">Your mission. Our engineers. Closer to the problem. Faster to the deployed solution.</h1>
    {phrases.map(({ lines, label, copy }, index) => <div key={label} className={`story-chapter punchline-chapter punchline-${index}`} aria-hidden="true">
      <span className="chapter-label">{label}</span>
      <div className="hero-phrase">{lines.map((line, lineIndex) => <span className={`hero-line ${lineIndex === lines.length - 1 && index > 0 ? 'hero-accent' : ''}`} key={line}>
        {line.split(' ').map((word, wordIndex) => <span className="hero-word" key={wordIndex}>{[...word].map((char, charIndex) => <span className="hero-char" key={charIndex}>{char}</span>)}{wordIndex < line.split(' ').length - 1 && ' '}</span>)}{lineIndex < lines.length - 1 && ' '}
      </span>)}</div>
      <p className="hero-support">{copy}</p>
    </div>)}
  </div>;
}
