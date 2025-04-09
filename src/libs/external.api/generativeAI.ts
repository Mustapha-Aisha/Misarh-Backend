import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable } from "@nestjs/common";
import axios from 'axios';

@Injectable()
export class AIAgent {

    model: any;
    generationConfig: any;
    genAI: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        this.generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        this.model = this.genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });
    }

    async generateScentProfile(scentDescription: string) {
        try {

            const scentPrompt = `
            Generate a custom perfume recommendation based on the following customer description: "${scentDescription}".
            The recommendation should include a balanced blend of perfume oils that match the customer's desired scent profile. The perfume oils should primarily come from the following sources:
            - Existing designer perfume oils(e.g., Dior, Tom Ford, Yves Saint Laurent).
            - Existing Concentrated perfume oils from Naseem in Nigeria (e.g.,Dahlia, Azhar etc.).

            Please make sure that:
            - If specific oils (e.g., "Naseem Dahlia" or "Naseem Azhar") are unavailable or the customer has not provided an exact name, suggest the most fitting available oils.
            - The final recommendation should be returned in **JSON format** and should include the following:
             \`\`\`json
                      
            {
            "name": "A uniquely crafted perfume name inspired by its scent profile, mood, and key ingredients",
            "notes": "A poetic yet precise description of the fragrance, emphasizing its unique character",
            "scentStory": "A rich, immersive story that evokes emotion and transports the customer into an experience tied to the scent",
            "mixDetails": [
                {
                "oil": "Oil name (Must be Naseem or a locally available designer-inspired blend)",
                "percentage": "XX%"
                }
            ],
            "resultingScentProfile": "Overall scent category (e.g., Warm Amber, Citrus Woody)",
            "scentNotes": {
                "top": ["note1", "note2"],
                "middle": ["note3", "note4"],
                "base": ["note5", "note6"]
            },
            "otherCombinations": {
                "designer-custom": ["Only designer-inspired oils that can be sourced locally"],
                "plain-custom": ["Only locally available pure perfume oils"]
            },
            "longevity": "Realistic estimated duration of scent (e.g., 6-8 hours, 10-12 hours)",
            "projection": "Scent reach (e.g., Moderate, Strong, Soft)",
            "idealOccasions": ["Best occasions for this scent (e.g., Date Night, Work, Summer Vacation)"],
            "personalityMatch": "Personality type this scent suits (e.g., Bold, Playful, Sophisticated)",
            "moodEnhancement": "How this fragrance influences mood (e.g., Relaxing, Energizing, Seductive)",
            "layeringSuggestions": ["Other perfumes or oils that complement this scent"],
            "genderSuitability": "Who can wear it (e.g., Masculine, Feminine, Unisex)",
            "bestSeason": "Seasonal suitability (e.g., Summer, Winter, Year-round)",
            "alternativeScentProfiles": ["Other scent families the customer may like"],
            "customizationTips": "Realistic suggestions for modifying the blend (e.g., Add more vanilla for a sweeter scent, Increase oud for a deeper richness)"
            }
            \`\`\`
            `;
    // const scentPrompt = `
    // Generate a custom perfume recommendation based on the following customer description: "${scentDescription}".
    // The recommendation should include a balanced blend of perfume oils that match the customer's desired scent profile. The perfume oils should primarily come from the following sources:
    // - Existing designer perfumes (e.g., Dior, Tom Ford, Yves Saint Laurent).
    // - Concentrated oils from Naseem in Nigeria (e.g., Oud, Sandalwood, Rose, Musk).
    
    // Please make sure that:
    // - If specific oils (e.g., "Naseem Oud" or "Naseem Rose") are unavailable or the customer has not provided an exact name, suggest the most fitting available oils.
    // - The final recommendation should be returned in **JSON format** and should include the following:
    
    // 1. **Name**: The name of the custom perfume.
    // 2. **Notes**: A brief description of the fragrance (e.g., "A sophisticated blend of warm woody and fresh floral notes").
    // 3. **Mix Details**: A list of perfume oils required for the blend with their corresponding percentage.
    // 4. **Resulting Scent Profile**: The overall scent profile of the final blend (e.g., "Woody Floral", "Oriental Spicy").
    // 5. **Scent Notes**: A breakdown of the key fragrance notes, classified as **Top**, **Middle**, or **Base**. 
    //    - Do not include specific perfume names in this section—just general scent characteristics (e.g., floral, woody, amber, citrus, etc.).
    // 6. **Other Combinations**: 
    //     - **Naseem & Designer**: Suggest alternative fragrance combinations using both **Naseem oils** and **designer perfumes**. 
    //     - The combination should have:
    //       - **Mix**: A list of oils used in the combination with their corresponding percentages.
    //       - **Scent Profile**: A description of the overall scent profile.
    //     - **Naseem Only**: Suggest fragrance combinations using only **Naseem oils** available in Nigeria. 
    //     - The combination should have:
    //       - **Mix**: A list of oils used in the combination with their corresponding percentages.
    //       - **Scent Profile**: A description of the overall scent profile.
          
    // The output should return the **JSON** format containing the actual **Mix Details** and **Scent Profile** for both **Naseem & Designer** and **Naseem Only** combinations.
    
    // Ensure the **Mix Details** are well structured with the oil names and percentages, and the **Scent Profile** clearly describes the overall scent.
    // `;
    
    
            // const scentPrompt = `
            // Generate a structured JSON response for a **truly unique, custom** perfume recommendation based on the following customer request:  
            // "${scentDescription}"  

            // ### **Key Guidelines:**  
            // - The fragrance must be a **harmonious blend of premium perfume oils**, primarily sourced from:  
            // - **Naseem perfume oils**  
            // - **luxury designer-inspired oils** (No niche or hard-to-find blends)  
            // - **Concentrated perfume oils from Nigerian suppliers **  

            // - The response **must be in JSON format** with the following structure:  
           
            // Make sure all the data is **realistic, well-balanced, and accurately describes the perfume blend, you can use naseem products**.
            // All suggested perfume oils must be sourced from suppliers available in Nigeria.

            // Prefer oils from Naseem, local Kano suppliers, and concentrated perfume oils commonly found in Nigerian markets.
            // If a designer-inspired fragrance is suggested, ensure it is a readily available alternative.
            // Do not include niche or hard-to-find ingredients unless there’s a known local supplier.
            // Clearly specify alternative options if any ingredient is not locally available.
            // `;

            // Prepare request data
            const data = JSON.stringify({
                "contents": [
                    {
                        "parts": [
                            {
                                "text": `${scentPrompt}`
                            }
                        ]
                    }
                ]
            });

            // Request configuration
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB2ttXh1hH6M6pCIibVD5egw6RPp5vSVxw',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            const response = await axios.request(config);
            const responseCode = response.data?.candidates[0]?.content?.parts[0];
            const innerJsonString = responseCode.text.substring(
                responseCode.text.indexOf('```jsonb\n') + 9,
                responseCode.text.lastIndexOf('```\n')
            );

            const parsedJson = JSON.parse(innerJsonString);
            return parsedJson;



        } catch (error) {
            // console.log('Error:', error);
            return { error: "An error occurred while generating the recommendation." };
        }
    }
}
