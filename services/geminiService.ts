import { GoogleGenAI, Modality } from "@google/genai";
import { FigureOptions } from "../components/TransformOptions";
import { SoccerUniformOptions } from "../components/SoccerUniformOptions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// --- Figure Fusion Service ---

const getArtStyleDescription = (style: FigureOptions['artStyle']): string => {
    switch (style) {
        case 'Anime': return "The figure must have a Japanese anime/manga art style, characterized by large expressive eyes, defined linework, and cel-shading.";
        case 'Realistic': return "The figure must be hyper-realistic, with detailed skin textures, accurate anatomy, and natural shading to look like a real person/animal.";
        case 'Chibi/SD': return "The figure must have 'chibi' or 'super-deformed' (SD) proportions: a very large, expressive head and a small, cute, simplified body.";
        case 'Stylized': return "The figure should have a unique, stylized look, like something from a modern western cartoon or fantasy art, with exaggerated features and dynamic shapes.";
        default: return "An anime art style.";
    }
}

const getTextureDescription = (texture: FigureOptions['texture']): string => {
    switch (texture) {
        case 'Matte': return "The figure's surface finish must be matte, with a smooth, non-reflective surface that diffuses light.";
        case 'Glossy': return "The figure must have a glossy, high-shine finish that reflects light, making it look polished and sleek.";
        case 'Metallic': return "Incorporate metallic paint effects, especially on armor, weapons, or accessories, to give them a realistic metal sheen.";
        case 'Weathered': return "Apply a weathered effect to the figure, with details like scratches, dust, or rust to make it look aged or battle-worn.";
        default: return "A smooth, matte finish.";
    }
}

const getBaseDescription = (base: FigureOptions['base']): string => {
    switch (base) {
        case 'None': return 'The figure should have no display base and be able to stand on its own.';
        case 'Simple Disc': return 'The figure must be placed on a simple, elegant circular or square disc-like display base (black, white, or clear).';
        case 'Themed Diorama': return 'The figure must be part of a themed diorama base that complements its origin (e.g., a rocky battlefield, a forest floor, a sci-fi platform).';
        case 'Floating': return 'The figure should be mounted on a discreet stand to give it a dynamic, floating or flying appearance.';
        default: return 'A simple display base.';
    }
};

const getPoseDescription = (pose: FigureOptions['pose']): string => {
    switch (pose) {
        // FIX: Use unique key 'Figure: Standing' to avoid conflict.
        case 'Figure: Standing': return "A museum-style standing pose, either neutral or with a slight, characterful stance. It should be stable and grounded.";
        case 'Dynamic/Action': return "A dynamic action pose, as if captured mid-movement (e.g., jumping, attacking, running). The pose should be energetic and expressive.";
        // FIX: Use unique key 'Figure: Sitting' to avoid conflict.
        case 'Figure: Sitting': return "A relaxed sitting or kneeling pose, interacting with the base or an accessory naturally.";
        default: return "A standard standing pose.";
    }
}

const getColorSchemeDescription = (scheme: FigureOptions['colorScheme']): string => {
    switch (scheme) {
        case 'Original Colors': return "Use the colors from the original uploaded image as the primary reference for the figure's paint scheme.";
        case 'Monochrome': return "Render the entire figure in a monochrome color scheme, like a grayscale prototype or a stylish single-color variant (e.g., all-black).";
        case 'Vibrant': return "Use a vibrant, high-saturation color palette that enhances the original colors, making the figure pop visually.";
        default: return "Use the original colors.";
    }
}

const getDetailingDescription = (detailing: FigureOptions['detailing']): string => {
    switch (detailing) {
        case 'Standard': return "A standard level of detail suitable for the scale.";
        case 'High': return "A high level of detail, with fine textures on clothing, intricate facial expressions, and carefully sculpted hair.";
        case 'Ultra': return "An ultra-fine level of detail, capturing microscopic details like fabric weaves, subtle skin pores, and complex accessory patterns.";
        default: return "A standard level of detail.";
    }
}

const getBackgroundDescription = (background: FigureOptions['background']): string => {
    switch (background) {
        case 'Studio': return "Both the figure and the box must be presented against a clean, neutral, and seamless studio background (e.g., a simple white or gray gradient). The lighting should be professional and highlight both objects clearly.";
        case 'Bookshelf': return "The scene should be a realistic bookshelf, with the figure and box placed amongst books. Use a shallow depth of field (bokeh effect) to make the scene look like a real photograph taken with a DSLR camera.";
        case 'Desktop': return "The scene should be a modern, clean desktop environment, with items like a keyboard, monitor, or plant nearby. The lighting should be natural, as if from a window.";
        case 'Showcase': return "The scene should be inside a glass display showcase, possibly with other collectibles faintly visible in the background. The lighting should be dramatic, like from integrated LED strips.";
        default: return "A clean, studio background.";
    }
};

const createFigurePrompt = (options: FigureOptions, dimensions: { width: number; height: number }): string => `
You are an expert AI digital artist specializing in creating photorealistic images of collectible figures.
Your task is to take the user's uploaded image and transform the main subject into a high-quality, ${options.scale} scale collectible figure, presented as a professional photograph that includes both the figure and its packaging.

**Overall Goal:** The final image must look like a single, real photograph of physical objects. It must NOT look like a digital render, illustration, or a collage.

---

**INPUT IMAGE CONTEXT (FOR YOUR INFORMATION ONLY):**
*   The user uploaded an image with dimensions ${dimensions.width}px (width) by ${dimensions.height}px (height).
*   **Crucial Instruction:** You MUST completely IGNORE the original aspect ratio. Your goal is to create a new scene, not to replicate the original's composition.

---

**CORE FIGURE SPECIFICATIONS:**

*   **1. Art Style:** ${getArtStyleDescription(options.artStyle)}
*   **2. Material & Texture:** The figure must look like it's made of high-grade ${options.material}. The surface finish is critical: ${getTextureDescription(options.texture)}
*   **3. Pose:** The figure's pose should be a static, non-articulated ${getPoseDescription(options.pose)}. It should be inspired by the original image but optimized for a display piece.
*   **4. Color & Detailing:**
    *   **Color Scheme:** ${getColorSchemeDescription(options.colorScheme)}
    *   **Detailing Level:** The sculpt must have a ${options.detailing} level of detail.
*   **5. Base:** ${getBaseDescription(options.base)}

---

**FINAL IMAGE COMPOSITION:**

*   **Resolution & Aspect Ratio:** The final output image MUST be a high-resolution landscape photograph with an exact resolution of 1920x1080 pixels (a 16:9 aspect ratio). This is a strict, non-negotiable requirement.
*   **Composition:** The arrangement of the figure and box must be HORIZONTAL to fill the wide 1920x1080 frame. DO NOT stack them vertically. The final image should be a cinematic, wide shot.
*   **Scene:** Create a single, cohesive professional product photograph.
*   **Arrangement:** On one side, display the collectible figure standing on its base. On the other side, display its corresponding retail packaging (box) standing upright.
*   **Box Art:** Use the original uploaded image itself as the primary artwork on the packaging. The art should be vibrant and well-integrated into the box design.
*   **Box Design:** The packaging must feature a large, clear plastic window so the figure inside is clearly visible.
*   **Box Contents:** The figure visible inside the box through the window MUST be the IDENTICAL TWIN of the figure displayed outside the box. Same model, same pose, same colors. It is crucial that they are not different in any way.
*   **Environment:** ${getBackgroundDescription(options.background)}

**CRITICAL RULE:** Avoid an "action figure" look with visible joints or articulation. The result must be a premium, static, display-focused art piece, presented as a single, unified product shot.
`;

export const transformImageToFigure = async (
    base64Data: string, 
    mimeType: string, 
    options: FigureOptions,
    dimensions: { width: number; height: number }
): Promise<{imageUrl: string | null; text: string | null}> => {
  try {
    const prompt = createFigurePrompt(options, dimensions);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64ImageBytes = part.inlineData.data;
              const imageMimeType = part.inlineData.mimeType;
              imageUrl = `data:${imageMimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
              text = part.text;
            }
        }
    }

    return { imageUrl, text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while transforming the image with the Gemini API.");
  }
};


// --- Virtual Try-On Service ---

// FIX: Disambiguate pose types to avoid key collisions in translation files.
export type TryOnPose = 'Original Pose' | 'Try On: Standing' | 'Fashion Model' | 'Walking' | 'Try On: Sitting';
export type TryOnBackground = 'Original Background' | 'Studio' | 'Urban' | 'Nature' | 'Cafe';

const getTryOnPoseInstruction = (pose: TryOnPose): string => {
    switch (pose) {
        case 'Original Pose':
            return "It is absolutely critical to preserve the exact pose from the original person's image. Do not alter their stance, posture, or limb positions. The clothing must be fitted to this original pose.";
        // FIX: Use unique key 'Try On: Standing' to avoid conflict.
        case 'Try On: Standing':
            return "The person must be generated in a natural, neutral standing pose. They should be facing forward or slightly angled.";
        case 'Fashion Model':
            return "The person must be generated in a confident, stylish fashion model pose. This could include a hand on the hip, a slight contrapposto stance, or another dynamic yet static pose suitable for a catalogue.";
        case 'Walking':
            return "The person must be generated in a 'freeze-frame' walking pose, as if captured mid-stride. This should look natural and showcase the clothing in motion.";
        // FIX: Use unique key 'Try On: Sitting' to avoid conflict.
        case 'Try On: Sitting':
            return "The person must be generated in a relaxed and natural sitting pose, for example on a simple stool or block (not visible or very minimalist).";
        default:
            return "It is absolutely critical to preserve the exact pose from the original person's image.";
    }
}

const getTryOnBackgroundInstruction = (background: TryOnBackground): string => {
    const originalBackgroundInstruction = "The final image must feature the newly styled person seamlessly placed within the EXACT original background from the 'person' image. The original person must NOT be visible in the final image; they are completely replaced by the newly styled version. The background itself must remain identical to the original. Ensure there is no duplication or ghosting of people. The final output must look like a single, cohesive photograph of the new person in the old environment.";

    switch (background) {
        case 'Original Background':
            return originalBackgroundInstruction;
        case 'Studio':
            return "The background of the final image must be a clean, simple, neutral studio setting (e.g., light gray, white) to focus on the person and the outfit.";
        case 'Urban':
            return "Generate a photorealistic and stylish urban background, such as a modern city street, an architectural feature, or against a graffiti wall. The lighting on the person must match the environment seamlessly.";
        case 'Nature':
            return "Generate a photorealistic and serene natural background, such as a beautiful park, a forest path, or a beach scene. The lighting on the person must be natural and match the outdoor environment.";
        case 'Cafe':
            return "Generate a photorealistic background of a cozy and modern café interior. The person should be believably integrated into the scene. Pay attention to realistic lighting and depth of field.";
        default:
            return originalBackgroundInstruction;
    }
}

const createTryOnPrompt = (pose: TryOnPose, background: TryOnBackground): string => `
You are an expert AI fashion stylist. Your task is to dress the person from the first image with the clothing and accessories from the subsequent images.

**CRITICAL INSTRUCTIONS:**
1.  **Identify the Person and Clothing:** The **very first image is the person** whose face, identity, and body you must use. All **subsequent images are for clothing reference ONLY**. If these subsequent images contain people, you MUST IGNORE those people and only use the clothes they are wearing.
2.  **Preserve Identity:** It is absolutely essential that you maintain the exact face, facial features, hair, and physical identity of the person from the **first image**. Do NOT change their face or replace it with someone else's.
3.  **Synthesize Full Body (if needed):** If the first image is not a full-body shot (e.g., only shows the upper body), you must realistically generate a full-body view of them, preserving their original characteristics.
4.  **Apply Clothing:** Digitally and seamlessly dress the person from the first image with ALL the provided clothing items. The clothes must fit naturally on their body according to the specified pose.
5.  **Pose Instruction:** ${getTryOnPoseInstruction(pose)}
6.  **Background Instruction:** ${getTryOnBackgroundInstruction(background)}
7.  **Final Output:** The final output must be a single, cohesive, photorealistic image of the original person wearing the new outfit. It must look like a real photograph. Realism is the top priority.
`;

export const virtualTryOn = async (
    person: { base64Data: string; mimeType: string }, 
    items: Array<{ base64Data: string; mimeType: string }>,
    pose: TryOnPose,
    background: TryOnBackground
): Promise<{imageUrl: string | null; text: string | null}> => {
  try {
    const prompt = createTryOnPrompt(pose, background);
    
    const parts = [
      { inlineData: { data: person.base64Data, mimeType: person.mimeType } },
      ...items.map(item => ({ inlineData: { data: item.base64Data, mimeType: item.mimeType } })),
      { text: prompt }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64ImageBytes = part.inlineData.data;
              const imageMimeType = part.inlineData.mimeType;
              imageUrl = `data:${imageMimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
              text = part.text;
            }
        }
    }

    return { imageUrl, text };
  } catch (error) {
    console.error("Error calling Gemini API for Virtual Try-On:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during the virtual try-on process.");
  }
};

// --- Soccer Uniform Service ---

const createSoccerUniformPrompt = (options: SoccerUniformOptions): string => {
    const j = options.jersey;
    const s = options.shorts;
    const r = options.render;

    const jerseyParts: string[] = [];
    if (j.mainColor) jerseyParts.push(`${j.mainColor} jersey`);
    if (j.accentColor) jerseyParts.push(`with ${j.accentColor} accents`);
    if (j.pattern !== 'None') jerseyParts.push(`${j.pattern.toLowerCase()} pattern`);
    if (j.neckline) jerseyParts.push(`${j.neckline.toLowerCase()} collar`);
    if (j.sleeves) jerseyParts.push(`${j.sleeves.toLowerCase()} sleeves`);
    if (j.fit) jerseyParts.push(`${j.fit.toLowerCase()}`);
    if (j.material) jerseyParts.push(`${j.material.toLowerCase()} material`);
    if (j.teamLogo) jerseyParts.push(`team logo '${j.teamLogo}' on chest`);
    if (j.sponsorLogo) jerseyParts.push(`sponsor logo '${j.sponsorLogo}' on front`);
    if (j.playerNumber) {
        let numberStr = `number ${j.playerNumber} on back`;
        if (j.fontStyle) numberStr += ` in ${j.fontStyle.toLowerCase()} font`;
        jerseyParts.push(numberStr);
    }
    if (j.playerName) jerseyParts.push(`player name '${j.playerName}' above number`);

    const shortsParts: string[] = [];
    if (s.mainColor) shortsParts.push(`matching ${s.mainColor} shorts`);
    if (s.accentColor && s.pattern === 'Side Stripes') shortsParts.push(`with ${s.accentColor} side stripes`);
    if (s.length) shortsParts.push(`${s.length.toLowerCase()} length`);
    if (s.waistband) shortsParts.push(`${s.waistband.toLowerCase()}`);
    if (s.fit) shortsParts.push(`${s.fit.toLowerCase()}`);
    if (s.teamLogo) shortsParts.push(`team logo on thigh`);

    const jerseyPrompt = jerseyParts.join(', ');
    const shortsPrompt = shortsParts.join(', ');
    const renderPrompt = `${r.view.toLowerCase()}, ${r.style.toLowerCase()}, high detail, high resolution, on a mannequin or plain background`;

    return `A complete soccer uniform set: ${jerseyPrompt}; ${shortsPrompt}; ${renderPrompt}.`;
};

export const generateSoccerUniform = async (
    options: SoccerUniformOptions
): Promise<{imageUrl: string | null; text: string | null}> => {
  try {
    const prompt = createSoccerUniformPrompt(options);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;
    
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64ImageBytes = part.inlineData.data;
              const imageMimeType = part.inlineData.mimeType;
              imageUrl = `data:${imageMimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
              text = part.text;
            }
        }
    }

    return { imageUrl, text };

  } catch (error) {
    console.error("Error calling Gemini API for Soccer Uniform:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during the soccer uniform generation.");
  }
};