import { useState, useEffect } from 'react';

export interface TypewriterTextProps {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDelay?: number;
  className?: string;
  loop?: boolean;
}

export function TypewriterText({
  words = ['ปรึกษาอาการสัตว์เลี้ยงตลอด 24 ชม.'],
  typingSpeed = 65,
  deletingSpeed = 30,
  pauseDelay = 3500,
  className,
  loop = true,
}: TypewriterTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const fullWord = words[wordIndex % words.length];

    if (!isDeleting && currentText === fullWord) {
      if (!loop && words.length <= 1) return;
      const timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentText === '') {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }

    const nextSpeed = isDeleting ? deletingSpeed : typingSpeed;
    const timeout = setTimeout(() => {
      setCurrentText((prev) =>
        isDeleting
          ? fullWord.substring(0, prev.length - 1)
          : fullWord.substring(0, prev.length + 1)
      );
    }, nextSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDelay, loop]);

  return (
    <span className={className}>
      <span>{currentText}</span>
    </span>
  );
}
