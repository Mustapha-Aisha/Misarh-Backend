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
            responseMimeType: "application/json",
        };

        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash-8b",
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

                    - **Name**: The name of the custom perfume (e.g., "Serene Confidence").
                    - **Notes**: A brief description of the fragrance (e.g., "A sophisticated blend of warm woody and fresh floral notes").
                    - **Mix Details**: A list of perfume oils required for the blend with their corresponding percentage.
                    - **Resulting Scent Profile**: The overall scent profile of the final blend (e.g., "Woody Floral", "Oriental Spicy").
                    - **Scent Notes**: A breakdown of the key fragrance notes, classified as **Top**, **Middle**, or **Base**. 
                    - Do not include specific perfume names in this section—just general scent characteristics (e.g., floral, woody, amber, citrus, etc.).                    - **Other Combinations**: 
                        - **designer-custom**: Suggest alternative fragrance combinations using both Naseem oils and designer perfumes e.g., "Naseem Dahlia" + "Naseem Azhar" + dior sauvage)  that could also work based on the customer description. 
                        - **plain custom**: Suggest combinations using only **Naseem oils available in Nigeria e.g., "Naseem Dahlia" or "Naseem Azhar") **. These should be practical and match the desired scent profile.
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
