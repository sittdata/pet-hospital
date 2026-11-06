import { useState, useEffect } from 'react';

export interface TypewriterTextProps {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDelay?: number;
  className?: string;
}

export function TypewriterText({
  words = ['ปรึกษาอาการสัตว์เลี้ยงตลอด 24 ชม.'],
  typingSpeed = 65,
  deletingSpeed = 30,
  pauseDelay = 3500,
  className,
}: TypewriterTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullWord = words[wordIndex % words.length];

    if (!isDeleting && currentText === fullWord) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      return;
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
  }, [currentText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDelay]);

  return (
    <span className={className}>
      <span>{currentText}</span>
    </span>
  );
}
