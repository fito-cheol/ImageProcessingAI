import React, { createContext, useState, useContext, ReactNode } from 'react';

const translations = {
  en: {
    ui: {
      // Service Selector
      selectServiceTitle: "Choose a Service",
      figureFusionTitle: "Figure Fusion AI",
      figureFusionDescription: "Turn photos into collectible figures.",
      tryOnTitle: "Virtual Try-On AI",
      tryOnDescription: "Style a person with clothes from images.",
      backButtonLabel: "Go Back",
      soccerUniformTitle: "Soccer Uniform AI",
      soccerUniformDescription: "Design a custom soccer uniform with detailed options.",

      // Header
      headerTitle: "Figure Fusion AI",
      headerSubtitle: "Upload a photo and our AI will magically transform it into a stunning, collectible-style figure.",
      
      // Try-On Header
      tryOnHeaderTitle: "Virtual Try-On AI",
      tryOnHeaderSubtitle: "Upload a person and clothes to see them styled.",

      // Soccer Header
      soccerHeaderTitle: "Soccer Uniform Designer",
      soccerHeaderSubtitle: "Create your unique team kit. Specify colors, patterns, logos, and more to generate a professional soccer uniform.",

      // ImageUploader
      uploaderTitle: "Drag & drop an image or click to upload",
      uploaderSubtitle: "PNG, JPG, or WEBP. High resolution recommended.",
      uploadPersonTitle: "Upload a photo of a person",
      uploadPersonSubtitle: "A clear, full or half-body shot works best.",
      uploadItemText: "Add item",

      // ResultDisplay
      originalImageTitle: "Original Image",
      generatedImageTitle: "Figure & Package Shot",
      generatedUniformTitle: "Generated Uniform",
      placeholderText: "AI generation will appear here",

      // Try-On Display
      personImageTitle: "Person",
      clothingItemsTitle: "Clothing & Accessories (1-4 items)",
      generatedResultTitle: "Styled Result",

      // Buttons
      transformButton: "Transform to Figure",
      generateButton: "Generate Style",
      regenerateButton: "Re-generate",
      startOverButton: "Start Over",
      installAppTitle: "Install App",
      installAppButton: "Install",
      iosInstallPromptTitle: "Install App",
      iosInstallPromptBody: "To add this app to your home screen, find the 'Add to Home Screen' or 'Install' option in your browser's menu.",
      iosInstallPromptClose: "Close",

      // Loader messages
      loaderMsg1: "Warming up the AI's creative circuits...",
      loaderMsg2: "Applying digital paint and polish...",
      loaderMsg3: "Crafting your miniature masterpiece...",
      loaderMsg4: "Shrinking pixels to figure size...",
      loaderMsg5: "This can take a moment, great art needs time.",

      // Errors
      errorTitle: "Error",
      errorUpload: "Please upload an image first.",
      errorPerson: "Please upload a photo of a person.",
      errorItems: "Please upload at least one clothing item.",
      errorGenerate: "The AI could not generate an image. Please try a different image or adjust the options.",
      errorTransform: "An error occurred while transforming the image. Please try again.",
      
      // Pose Options
      poseSectionTitle: "Choose a Pose",
      'Original Pose': "Original Pose",
      // FIX: Use unique key 'Try On: Standing' to avoid conflict.
      'Try On: Standing': "Standing",
      'Fashion Model': "Fashion Model",
      'Walking': "Walking",
      // FIX: Use unique key 'Try On: Sitting' to avoid conflict.
      'Try On: Sitting': "Sitting",
      
      // Background Options
      backgroundSectionTitle: "Choose a Background",
      'Original Background': "Original",
      'Urban': "Urban",
      'Nature': "Nature",
      'Cafe': "Café",

      // TransformOptions
      customizeTitle: "Customize Your Figure",
      coreConceptSection: "Core Concept",
      physicalPropertiesSection: "Physical Properties",
      stagingPoseSection: "Staging & Pose",
      aestheticsSection: "Aesthetics",
      artStyleLabel: "Art Style",
      scaleLabel: "Scale",
      materialLabel: "Material",
      textureLabel: "Surface Texture",
      poseLabel: "Pose",
      baseLabel: "Base",
      backgroundLabel: "Background Scene",
      colorSchemeLabel: "Color Scheme",
      detailingLabel: "Detailing Level",
      // Option values
      '1/12': '1/12 Scale', '1/8': '1/8 Scale', '1/7': '1/7 Scale', '1/6': '1/6 Scale', '1/4': '1/4 Scale',
      'Anime': 'Anime', 'Realistic': 'Realistic', 'Chibi/SD': 'Chibi/SD', 'Stylized': 'Stylized',
      'Matte': 'Matte', 'Glossy': 'Glossy', 'Metallic': 'Metallic', 'Weathered': 'Weathered',
      'None': 'None', 'Simple Disc': 'Simple Disc', 'Themed Diorama': 'Themed Diorama', 'Floating': 'Floating',
      'PVC/ABS': 'PVC/ABS', 'Resin': 'Resin', 'Polystone': 'Polystone', 'Metal': 'Metal',
      // FIX: Use unique key 'Figure: Standing' to avoid conflict.
      'Figure: Standing': 'Standing', 'Dynamic/Action': 'Dynamic/Action', 'Figure: Sitting': 'Sitting',
      'Original Colors': 'Original Colors', 'Monochrome': 'Monochrome', 'Vibrant': 'Vibrant',
      'Standard': 'Standard', 'High': 'High', 'Ultra': 'Ultra',
      'Studio': 'Studio', 'Bookshelf': 'Bookshelf', 'Desktop': 'Desktop', 'Showcase': 'Showcase',

      // Soccer Uniform Options
      jerseyOptions: "Jersey Options (Top)",
      shortsOptions: "Shorts Options (Bottom)",
      renderOptions: "Rendering Options",
      mainColor: "Main Color",
      accentColor: "Accent Color",
      pattern: "Pattern",
      logoTeam: "Team Logo",
      logoSponsor: "Sponsor Logo",
      playerNumber: "Player Number",
      playerName: "Player Name",
      fontStyle: "Font Style",
      neckline: "Neckline",
      fit: "Fit",
      material: "Material",
      view: "View",
      style: "Style",
      generationModel: "Generation Model",
      'Stripes': 'Stripes', 'Checkered': 'Checkered', 'Gradient': 'Gradient',
      'Bold': 'Bold', 'Italic': 'Italic', 'Futuristic': 'Futuristic',
      'V-Neck': 'V-Neck', 'Round Neck': 'Round Neck', 'Collar': 'Collar',
      'Slim Fit': 'Slim Fit', 'Athletic Cut': 'Athletic Cut', 'Regular': 'Regular',
      'Breathable Polyester': 'Breathable Polyester', 'Moisture-Wicking': 'Moisture-Wicking',
      'Side Stripes': 'Side Stripes',
      'Front View': 'Front View', '3/4 View': '3/4 View', 'Full Body View': 'Full Body View',
      'Photorealistic': 'Photorealistic', '3D Style': '3D Style',
      'Model: Standard': 'Standard Quality',
      'Model: High Quality': 'High Quality',
    },
    descriptions: {
      'Anime': "Japanese anime/manga style with large eyes and defined lines.",
      'Realistic': "Hyper-realistic style with detailed textures and natural shading.",
      'Chibi/SD': "Super-deformed style with a large head and small body.",
      'Stylized': "A unique, modern cartoon or fantasy art style.",
      'Matte': "A smooth, non-reflective surface finish.",
      'Glossy': "A high-shine, reflective finish.",
      'Metallic': "Realistic metal sheen on specific parts like armor or weapons.",
      'Weathered': "An aged or battle-worn look with scratches and dust.",
      'Simple Disc': "A simple circular or square display base.",
      'Themed Diorama': "A base that complements the character's origin, like a battlefield or forest.",
      'Floating': "A discreet stand that gives a flying or floating appearance.",
      'Dynamic/Action': "An energetic pose as if captured mid-movement.",
      'Monochrome': "A single-color scheme, like grayscale or all-black.",
      'Vibrant': "High-saturation colors that make the figure pop.",
      'High': "High detail with fine textures and intricate expressions.",
      'Ultra': "Ultra-fine detail, capturing microscopic elements like fabric weaves.",
      'Studio': "A clean, neutral studio background with professional lighting.",
      'Bookshelf': "A realistic bookshelf with a shallow depth of field (bokeh effect).",
      'Desktop': "A modern desktop environment with natural lighting.",
      'Showcase': "Inside a glass display case with dramatic lighting.",
      'Original Pose': "Preserves the exact pose from the original image.",
      'Try On: Standing': "A natural, neutral standing pose.",
      'Fashion Model': "A confident, stylish pose suitable for a catalogue.",
      'Walking': "A 'freeze-frame' walking pose, as if captured mid-stride.",
      'Try On: Sitting': "A relaxed and natural sitting pose.",
      'Original Background': "Uses the exact background from the person's image.",
      'Urban': "A stylish urban background like a city street or graffiti wall.",
      'Nature': "A serene natural background like a park or beach.",
      'Cafe': "A cozy and modern café interior.",
      'Model: Standard': "A fast, cost-effective model. Free tier usage is limited. Rate limits are much higher with a billed account.",
      'Model: High Quality': "A premium model for the highest image quality. A billed Google Cloud account is required to use this option.",
    }
  },
  ko: {
    ui: {
      selectServiceTitle: "서비스 선택",
      figureFusionTitle: "피규어 퓨전 AI",
      figureFusionDescription: "사진을 멋진 피규어로 변신시켜 보세요.",
      tryOnTitle: "가상 피팅 AI",
      tryOnDescription: "이미지 속 옷을 사람에게 입혀보세요.",
      backButtonLabel: "뒤로 가기",
      soccerUniformTitle: "축구 유니폼 AI",
      soccerUniformDescription: "상세한 옵션으로 커스텀 축구 유니폼을 디자인하세요.",

      headerTitle: "피규어 퓨전 AI",
      headerSubtitle: "사진을 업로드하면 AI가 마법처럼 멋진 수집용 피규어 스타일로 변환해줍니다.",
      
      tryOnHeaderTitle: "가상 피팅 AI",
      tryOnHeaderSubtitle: "사람 사진과 옷 사진을 업로드하여 스타일을 확인하세요.",
      
      soccerHeaderTitle: "축구 유니폼 디자이너",
      soccerHeaderSubtitle: "팀의 고유한 유니폼을 만드세요. 색상, 패턴, 로고 등을 지정하여 전문적인 축구 유니폼을 생성합니다.",

      uploaderTitle: "이미지를 드래그 앤 드롭하거나 클릭하여 업로드하세요",
      uploaderSubtitle: "PNG, JPG, 또는 WEBP. 고해상도를 권장합니다.",
      uploadPersonTitle: "사람 사진 업로드",
      uploadPersonSubtitle: "선명한 전신 또는 반신 사진이 가장 좋습니다.",
      uploadItemText: "의류 추가",

      originalImageTitle: "원본 이미지",
      generatedImageTitle: "피규어 & 패키지",
      generatedUniformTitle: "생성된 유니폼",
      placeholderText: "AI 생성 결과가 여기에 표시됩니다",

      personImageTitle: "사람",
      clothingItemsTitle: "의류 & 액세서리 (1-4개)",
      generatedResultTitle: "스타일링 결과",

      transformButton: "피규어로 변환",
      generateButton: "스타일 생성",
      regenerateButton: "재생성",
      startOverButton: "처음부터 다시 시작",
      installAppTitle: "앱 설치",
      installAppButton: "설치",
      iosInstallPromptTitle: "앱 설치하기",
      iosInstallPromptBody: "이 웹 앱을 홈 화면에 추가하려면, 브라우저 메뉴에서 '홈 화면에 추가' 또는 '설치' 옵션을 찾아 선택하세요.",
      iosInstallPromptClose: "닫기",

      loaderMsg1: "AI의 창의 회로를 예열 중입니다...",
      loaderMsg2: "디지털 페인트를 칠하고 광택을 내는 중...",
      loaderMsg3: "당신의 작은 걸작을 만드는 중...",
      loaderMsg4: "픽셀을 피규어 크기로 줄이는 중...",
      loaderMsg5: "잠시만 기다려주세요, 멋진 예술에는 시간이 필요합니다.",

      errorTitle: "오류",
      errorUpload: "먼저 이미지를 업로드해주세요.",
      errorPerson: "사람 사진을 업로드해주세요.",
      errorItems: "최소 하나 이상의 의류 아이템을 업로드해주세요.",
      errorGenerate: "AI가 이미지를 생성하지 못했습니다. 다른 이미지를 시도하거나 옵션을 조정해주세요.",
      errorTransform: "이미지를 변환하는 중 오류가 발생했습니다. 다시 시도해주세요.",
      
      poseSectionTitle: "포즈 선택",
      'Original Pose': "원본 포즈",
      'Try On: Standing': "서 있는 포즈",
      'Fashion Model': "패션 모델 포즈",
      'Walking': "걷는 포즈",
      'Try On: Sitting': "앉아있는 포즈",
      
      backgroundSectionTitle: "배경 선택",
      'Original Background': "원본 배경",
      'Urban': "도시",
      'Nature': "자연",
      'Cafe': "카페",

      customizeTitle: "피규어 커스터마이즈",
      coreConceptSection: "핵심 컨셉",
      physicalPropertiesSection: "물리적 속성",
      stagingPoseSection: "연출 및 포즈",
      aestheticsSection: "미학",
      artStyleLabel: "아트 스타일",
      scaleLabel: "스케일",
      materialLabel: "재질",
      textureLabel: "표면 질감",
      poseLabel: "포즈",
      baseLabel: "베이스",
      backgroundLabel: "배경",
      colorSchemeLabel: "색상 구성",
      detailingLabel: "디테일 수준",
      '1/12': '1/12 스케일', '1/8': '1/8 스케일', '1/7': '1/7 스케일', '1/6': '1/6 스케일', '1/4': '1/4 스케일',
      'Anime': '애니메이션', 'Realistic': '사실적', 'Chibi/SD': '치비/SD', 'Stylized': '스타일화',
      'Matte': '무광', 'Glossy': '유광', 'Metallic': '메탈릭', 'Weathered': '웨더링',
      'None': '없음', 'Simple Disc': '단순 디스크', 'Themed Diorama': '테마 디오라마', 'Floating': '플로팅',
      'PVC/ABS': 'PVC/ABS', 'Resin': '레진', 'Polystone': '폴리스톤', 'Metal': '메탈',
      'Figure: Standing': '서 있는 포즈', 'Dynamic/Action': '역동적/액션', 'Figure: Sitting': '앉아있는 포즈',
      'Original Colors': '원본 색상', 'Monochrome': '단색', 'Vibrant': '선명하게',
      'Standard': '표준', 'High': '높음', 'Ultra': '최상',
      'Studio': '스튜디오', 'Bookshelf': '책장', 'Desktop': '데스크탑', 'Showcase': '쇼케이스',

      // Soccer Uniform Options
      jerseyOptions: "상의 옵션 (저지)",
      shortsOptions: "하의 옵션 (쇼츠)",
      renderOptions: "렌더링 옵션",
      mainColor: "메인 색상",
      accentColor: "보조 색상",
      pattern: "패턴",
      logoTeam: "팀 로고",
      logoSponsor: "스폰서 로고",
      playerNumber: "선수 번호",
      playerName: "선수 이름",
      fontStyle: "폰트 스타일",
      neckline: "목 부분",
      fit: "핏",
      material: "재질",
      view: "시점",
      style: "스타일",
      generationModel: "생성 모델",
      'Stripes': '줄무늬', 'Checkered': '체크', 'Gradient': '그라데이션',
      'Bold': '굵게', 'Italic': '이탤릭', 'Futuristic': '미래적',
      'V-Neck': 'V넥', 'Round Neck': '라운드넥', 'Collar': '카라',
      'Slim Fit': '슬림핏', 'Athletic Cut': '애슬레틱 컷', 'Regular': '레귤러',
      'Breathable Polyester': '통기성 폴리에스터', 'Moisture-Wicking': '흡습성',
      'Side Stripes': '측면 줄무늬',
      'Front View': '정면', '3/4 View': '3/4 뷰', 'Full Body View': '전신 뷰',
      'Photorealistic': '사실적', '3D Style': '3D 스타일',
      'Model: Standard': '표준 품질',
      'Model: High Quality': '고품질',
    },
    descriptions: {
      'Anime': "큰 눈과 뚜렷한 선이 특징인 일본 애니메이션/만화 스타일입니다.",
      'Realistic': "상세한 질감과 자연스러운 음영이 특징인 초사실적 스타일입니다.",
      'Chibi/SD': "큰 머리와 작은 몸을 가진 슈퍼 데포르메 스타일입니다.",
      'Stylized': "독특하고 현대적인 카툰 또는 판타지 아트 스타일입니다.",
      'Matte': "빛을 반사하지 않는 부드러운 무광 표면 마감입니다.",
      'Glossy': "빛을 반사하는 고광택 마감입니다.",
      'Metallic': "갑옷이나 무기 같은 특정 부위에 사실적인 금속 광택을 줍니다.",
      'Weathered': "긁힘이나 먼지 등으로 낡거나 닳은 듯한 느낌을 줍니다.",
      'Simple Disc': "단순한 원형 또는 사각형의 디스플레이 베이스입니다.",
      'Themed Diorama': "전장이나 숲처럼 캐릭터의 배경과 어울리는 테마 베이스입니다.",
      'Floating': "날거나 떠 있는 듯한 모습을 연출하는 투명한 스탠드입니다.",
      'Dynamic/Action': "움직이는 중간에 포착된 듯한 역동적인 포즈입니다.",
      'Monochrome': "그레이스케일이나 올블랙 같은 단색 구성입니다.",
      'Vibrant': "채도가 높은 색상으로 피규어를 돋보이게 합니다.",
      'High': "미세한 질감과 복잡한 표정이 살아있는 높은 디테일입니다.",
      'Ultra': "직물의 짜임새까지 포착하는 초미세 디테일입니다.",
      'Studio': "전문적인 조명을 갖춘 깨끗하고 중립적인 스튜디오 배경입니다.",
      'Bookshelf': "얕은 피사계 심도(보케 효과)가 있는 사실적인 책장 배경입니다.",
      'Desktop': "자연광이 들어오는 현대적인 데스크탑 환경입니다.",
      'Showcase': "드라마틱한 조명이 있는 유리 진열장 내부입니다.",
      'Original Pose': "원본 이미지의 포즈를 정확하게 유지합니다.",
      'Try On: Standing': "자연스럽고 중립적인 서 있는 포즈입니다.",
      'Fashion Model': "카탈로그에 어울리는 자신감 있고 스타일리시한 포즈입니다.",
      'Walking': "걷는 도중에 포착된 듯한 '정지 화면' 포즈입니다.",
      'Try On: Sitting': "편안하고 자연스러운 앉은 자세입니다.",
      'Original Background': "사람 이미지의 원본 배경을 그대로 사용합니다.",
      'Urban': "도시 거리나 그래피티 벽 같은 세련된 도시 배경입니다.",
      'Nature': "공원이나 해변 같은 평온한 자연 배경입니다.",
      'Cafe': "아늑하고 현대적인 카페 실내 배경입니다.",
      'Model: Standard': "빠르고 비용 효율적인 모델입니다. 무료 등급은 사용량이 제한되며, 결제 계정을 사용하면 한도가 크게 증가합니다.",
      'Model: High Quality': "최고의 이미지 품질을 위한 프리미엄 모델입니다. 이 옵션을 사용하려면 결제 정보가 등록된 Google Cloud 계정이 필요합니다.",
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations.en.ui);
export type DescriptionKey = keyof (typeof translations.en.descriptions);

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  td: (key: DescriptionKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language]?.ui[key] || translations.en.ui[key];
  };

  const td = (key: DescriptionKey): string => {
    return translations[language]?.descriptions[key] || translations.en.descriptions[key] || '';
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, td }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};