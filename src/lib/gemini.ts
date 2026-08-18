import { GoogleGenAI, Type, Schema } from '@google/genai';
import { CourseItem, ServiceItem, Article } from '../types';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Missing VITE_GEMINI_API_KEY. AI features will fail if used.");
      // Provide a dummy key to prevent constructor crash, but API calls will fail
      aiInstance = new GoogleGenAI({ apiKey: "MISSING_KEY" });
    } else {
      aiInstance = new GoogleGenAI({ apiKey });
    }
  }
  return aiInstance;
};

const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Helper to generate content with a specific JSON schema
 */
async function generateJsonContent<T>(prompt: string, schema: Schema, systemInstruction?: string): Promise<T> {
  const response = await getAI().models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: schema,
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No text returned from Gemini API");
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", text);
    throw new Error("Invalid JSON response from AI");
  }
}

/**
 * Generate a new Course
 */
export async function generateCourseWithAI(prompt: string): Promise<CourseItem> {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      code: { type: Type.STRING, description: "Course code, e.g. KH-01" },
      title: { type: Type.STRING, description: "Course title" },
      subtitle: { type: Type.STRING, description: "Course subtitle/short description" },
      formatOffline: { type: Type.STRING, description: "Offline format details" },
      formatOnline: { type: Type.STRING, description: "Online format details" },
      feeNotice: { type: Type.STRING, description: "Fee or contact notice" },
      duration: { type: Type.STRING, description: "Duration, e.g. 10 buổi" },
      badge: { type: Type.STRING, description: "Badge text, e.g. Chuyên Sâu 1-1" },
      lessons: {
        type: Type.ARRAY,
        description: "List of lessons",
        items: {
          type: Type.OBJECT,
          properties: {
            lessonTitle: { type: Type.STRING },
            points: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["lessonTitle", "points"]
        }
      }
    },
    required: ["code", "title", "subtitle", "formatOffline", "formatOnline", "feeNotice", "duration", "badge", "lessons"]
  };

  const course = await generateJsonContent<Omit<CourseItem, 'id'>>(
    prompt,
    schema,
    "You are an expert course creator. Generate a structured course syllabus in Vietnamese."
  );

  return {
    ...course,
    id: `course-${Date.now()}`
  };
}

/**
 * Generate a new Service
 */
export async function generateServiceWithAI(prompt: string): Promise<ServiceItem> {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      iconName: { type: Type.STRING, description: "Lucide icon name, e.g. Video, Mic, Tv, Award, Headphones, Sparkles" },
      title: { type: Type.STRING, description: "Service title" },
      description: { type: Type.STRING, description: "Detailed service description" },
      tags: { type: Type.STRING, description: "Tags separated by ' · ' (e.g. Tag 1 · Tag 2)" },
      thumbnailUrl: { type: Type.STRING, description: "Optional image URL, leave empty string if none" }
    },
    required: ["iconName", "title", "description", "tags"]
  };

  const service = await generateJsonContent<Omit<ServiceItem, 'id'>>(
    prompt,
    schema,
    "You are an expert service/agency copywriter. Generate structured service offerings in Vietnamese."
  );

  return {
    ...service,
    id: `sv-${Date.now()}`
  };
}

/**
 * Generate a new Article
 */
export async function generateArticleWithAI(prompt: string): Promise<Article> {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      slug: { type: Type.STRING, description: "URL friendly slug in kebab-case" },
      cat: { type: Type.STRING, description: "Category, e.g. livestream, setup, tips" },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of tags"
      },
      vi: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          dek: { type: Type.STRING, description: "Short description/summary" },
          readTime: { type: Type.STRING, description: "e.g. 5 phút đọc" },
          body: {
            type: Type.ARRAY,
            description: "Array of content blocks",
            items: {
              type: Type.OBJECT,
              properties: {
                t: { type: Type.STRING, description: "Type: 'p' (paragraph) or 'h' (heading)" },
                c: { type: Type.STRING, description: "Content text or HTML" },
                sn: { type: Type.STRING, description: "Optional section number for 'h' type, e.g. '01'" }
              },
              required: ["t", "c"]
            }
          }
        },
        required: ["title", "dek", "readTime", "body"]
      }
    },
    required: ["slug", "cat", "tags", "vi"]
  };

  const article = await generateJsonContent<Partial<Article>>(
    prompt,
    schema,
    "You are an expert blog post writer. Generate a comprehensive, engaging article in Vietnamese. Format the body as an array of paragraphs (t: 'p') and headings (t: 'h')."
  );

  return {
    slug: article.slug || `bai-viet-${Date.now()}`,
    cat: article.cat || 'skills' as any,
    date: new Date().toISOString().slice(0, 10),
    author: 'Xuân Hiến',
    initials: 'XH',
    tags: article.tags || [],
    vi: {
      title: article.vi?.title || 'Tiêu Đề Bài Viết',
      dek: article.vi?.dek || 'Tóm tắt bài viết',
      role: 'MC & Specialist Trainer',
      readTime: article.vi?.readTime || '5 phút đọc',
      body: article.vi?.body || [{ t: 'p', c: 'Nội dung bài viết' }]
    },
    en: {
      title: article.vi?.title || 'Article Title',
      dek: article.vi?.dek || 'Summary',
      role: 'MC & Trainer',
      readTime: '5 mins read',
      body: [{ t: 'p', c: 'Content' }]
    }
  };
}

/**
 * Rewrite existing text/HTML content
 */
export async function rewriteContentWithAI(content: string, instructions?: string): Promise<string> {
  const prompt = `
Please rewrite and improve the following text/HTML content.
Keep the existing HTML tags intact if there are any.
Make the tone professional, engaging, and clear.
${instructions ? `Specific instructions: ${instructions}` : ''}

Content to rewrite:
${content}
  `.trim();

  const response = await getAI().models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt
  });

  return response.text || content;
}
