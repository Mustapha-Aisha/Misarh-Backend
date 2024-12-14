"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAgent = void 0;
const generative_ai_1 = require("@google/generative-ai");
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let AIAgent = class AIAgent {
    constructor() {
        this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
    async generateScentProfile(scentDescription) {
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
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB2ttXh1hH6M6pCIibVD5egw6RPp5vSVxw',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            const response = await axios_1.default.request(config);
            const responseCode = response.data?.candidates[0]?.content?.parts[0];
            const innerJsonString = responseCode.text.substring(responseCode.text.indexOf('```jsonb\n') + 9, responseCode.text.lastIndexOf('```\n'));
            const parsedJson = JSON.parse(innerJsonString);
            console.log(parsedJson);
            return parsedJson;
        }
        catch (error) {
            return { error: "An error occurred while generating the recommendation." };
        }
    }
};
exports.AIAgent = AIAgent;
exports.AIAgent = AIAgent = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AIAgent);
//# sourceMappingURL=misarh.js.map