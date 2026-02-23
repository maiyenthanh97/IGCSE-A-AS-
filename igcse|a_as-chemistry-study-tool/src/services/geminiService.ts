import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export async function generateMoreQuestions(count: number = 5): Promise<GeneratedQuestion[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} multiple choice questions for IGCSE|A/AS Chemistry.
      Topics include:
      CHAPTER 1: Atomic Structure (Subatomic particles, Atomic number, Mass number, Isotopes, Relative atomic mass, Ion formation, Ionisation Energy, Electronic configuration, Trends).
      CHAPTER 2: Atoms, Molecules & Stoichiometry (Mole concept, Avogadro constant, n=m/Mr, Gas volume at r.t.p (24dm3), Concentration c=n/V, Limiting reagents, Percentage yield, Atom economy, Empirical/Molecular formulas, Titration calculations, Back titration, Hydrated salts).
      CHAPTER 3: Chemical Bonding (Ionic, Covalent, Dative, Metallic bonding, Electronegativity, Bond polarity, Intermolecular forces, Hydrogen bonding, VSEPR shapes, Bond angles, Bond enthalpy calculations).
      CHAPTER 4: States of Matter (Solid, liquid, gas properties, IMF, Boiling/Melting points, Vapor pressure, Gas laws: Boyle, Charles, Avogadro, Ideal gas equation PV=nRT, Maxwell-Boltzmann distribution, Activation energy, Ideal gas deviations).
      CHAPTER 5: Periodicity (Atomic/Ionic radius, Ionisation energy, Electronegativity, Shielding, Nuclear charge, Trends across periods and down groups, Group 2 and Group 7 properties, Displacement reactions, Oxide nature).
      
      Provide explanations in English.
      Ensure the questions are challenging and suitable for AS Level.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Exactly 4 options"
              },
              correctAnswer: { 
                type: Type.INTEGER,
                description: "Index of the correct option (0-3)"
              },
              explanation: { type: Type.STRING },
              topic: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation", "topic"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}
