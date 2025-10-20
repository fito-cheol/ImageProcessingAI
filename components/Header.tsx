import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useLanguage } from "../contexts/LanguageContext";
import { TranslationKey } from "../contexts/LanguageContext";

// GSAP 플러그인 등록
gsap.registerPlugin(SplitText);

interface HeaderProps {
  titleKey?: TranslationKey;
  subtitleKey?: TranslationKey;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { t } = useLanguage();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // FIX: Use nullish coalescing operator to provide default values without causing type widening issues with TypeScript.
  const titleKey = props.titleKey ?? "headerTitle";
  const subtitleKey = props.subtitleKey ?? "headerSubtitle";

  useEffect(() => {
    if (titleRef.current && subtitleRef.current) {
      // 제목 텍스트 분할 및 애니메이션
      const titleSplit = new SplitText(titleRef.current, {
        type: "chars,words",
        charsClass: "char",
        wordsClass: "word",
      });

      // 부제목 텍스트 분할
      const subtitleSplit = new SplitText(subtitleRef.current, {
        type: "chars,words",
        charsClass: "char",
        wordsClass: "word",
      });

      // 초기 상태 설정 (투명하게)
      gsap.set([titleSplit.chars, subtitleSplit.chars], {
        opacity: 0,
        y: 50,
        rotationX: -90,
      });

      // 애니메이션 시퀀스
      const tl = gsap.timeline();

      // 제목 애니메이션
      tl.to(titleSplit.chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.7)",
      })
        // 부제목 애니메이션 (제목 완료 후)
        .to(
          subtitleSplit.chars,
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // 컴포넌트 언마운트 시 정리
      return () => {
        titleSplit.revert();
        subtitleSplit.revert();
      };
    }
  }, [t, titleKey, subtitleKey]);

  return (
    <header className="text-center mb-10">
      <h1
        ref={titleRef}
        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 mb-2"
      >
        {t(titleKey)}
      </h1>
      <p
        ref={subtitleRef}
        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
      >
        {t(subtitleKey)}
      </p>
    </header>
  );
};
