import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generatePatentClaims(algoContext: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `
      As a Senior Patent Attorney, analyze the following DSG™ Canonical Algorithm state and generate 
      a set of formal US Utility Patent Claims (1 Independent, 3 Dependent).
      
      Context:
      ${algoContext}
      
      Requirements:
      - Use formal patent language ("A method comprising...", "Wherein the step of...")
      - Focus on the Gate Function decision logic and Drift/Oscillation arithmetic.
      - Ensure 'enablement' and 'non-obviousness' are addressed.
      
      Return the output in Markdown format.
    `,
  });

  return response.text;
}

export async function analyzeAlgorithmSafety(history: any[]) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          Analyze this DSG Algorithm execution history for safety violations or instability.
          History: ${JSON.stringify(history)}
          
          Provide a brief summary of the system stability and any recommendations for parameter tuning.
        `
    });
    return response.text;
}

export async function generateReadme(algoContext: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `
          Generate a professional, high-conversion GitHub README for the DSG™ Canonical Algorithm.
          Context: ${algoContext}
          
          Include sections:
          - Title & Tagline
          - Why it matters (The Problem: AI Instability)
          - Core Features (Deterministic Gate, Drift Stabilization, etc.)
          - Architecture (Description for a diagram)
          - Quick Start (pip install dsg-gate)
          - Formal Definitions (Math snippets)
          - Benchmarks (Mock data showing 3us latency)
          - Use Cases (LLM Guard, Autonomous Systems)
          - Citation
          
          Use clean Markdown with professional formatting.
        `,
    });
    return response.text;
}

export async function generateSocialPosts(platform: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `
          Create a high-engagement post for ${platform} about the DSG™ Canonical Algorithm.
          Platform specific requirements:
          - Reddit: Catchy title + detailed explanation for r/MachineLearning.
          - Hacker News: "Show HN" style, focusing on technical novelty.
          - Twitter/X: A thread (5-7 tweets) with hooks and emojis.
          
          Focus on: Deterministic AI Safety, Formal Verification, and Patent-Readiness.
        `,
    });
    return response.text;
}
