// import { GoogleGenAI } from '@google/genai'; // CORRECTED CLASS NAME
// import Investment from '../models/investment.js';

// const analyzePortfolio = async (req, res) => {
//   try {
//     // CORRECTED CLASS NAME
//     const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

//     const investments = await Investment.find({ user: req.user.id });

//     if (investments.length === 0) {
//       return res
//         .status(200)
//         .json({ analysis: { summary: 'No investments to analyze.' } });
//     }

//     const portfolioSummary = investments
//       .map((inv) => `- ${inv.assetType}: ${inv.assetName} ($${inv.amount})`)
//       .join('\n');

//     const prompt = `
//       As a financial advisor for a beginner, analyze the following portfolio.
//       Provide the output as a valid JSON object with this exact structure:
//       {
//         "riskLevel": "Low", "Medium", or "High",
//         "summary": "A one-paragraph, encouraging summary of the portfolio.",
//         "suggestions": ["A bullet point suggestion.", "Another bullet point suggestion.", "A third bullet point suggestion."]
//       }

//       Portfolio Data:
//       ${portfolioSummary}
//     `;

//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-flash-latest',
//       generationConfig: {
//         responseMimeType: 'application/json',
//       },
//     });

//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const analysisObject = JSON.parse(response.text());

//     res.status(200).json({ analysis: analysisObject });
//   } catch (error) {
//     console.error('AI analysis failed:', error);
//     res.status(500).json({ message: 'Failed to get AI analysis' });
//   }
// };

// export { analyzePortfolio };

// controllers/ai.js
// controllers/ai.js
// import { GoogleGenAI } from '@google/genai';
// import Investment from '../models/investment.js';

// const analyzePortfolio = async (req, res) => {
//   try {
//     const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//     const investments = await Investment.find({ user: req.user.id });

//     if (investments.length === 0) {
//       return res.status(200).json({
//         analysis: {
//           summary: 'No investments to analyze.',
//           riskLevel: 'Low',
//           suggestions: [],
//         },
//       });
//     }

//     const portfolioSummary = investments
//       .map((inv) => `- ${inv.assetType}: ${inv.assetName} ($${inv.amount})`)
//       .join('\n');

//     const prompt = `
// You are a skilled and profesional  financial advisor in india.

// Analyze this portfolio and respond ONLY with a valid JSON object like:
// {
//   "riskLevel": "Low" | "Medium" | "High",

//   "summary": "1-paragraph analysis of the portfolio",
//   "InvestmentTip" "as a financial advisor give a tip that investing a little to this much amount on this stock impact on portfolio(eg investing 100 ruppes on reliance  can cause this impact on your portfolio)"
//   "suggestions": [
//     "First tip",
//     "Second tip",
//     "Third tip"
//   ]
// }

// Portfolio:
// ${portfolioSummary}
//     `;

//     // ❗Use correct call for most versions
//     const result = await genAI.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: [{ role: 'user', parts: [{ text: prompt }] }],
//       config: {
//         responseMimeType: 'application/json',
//       },
//     });

//     const response = result.text; // No need for await here
//     const parsed = JSON.parse(response || '{}');

//     res.status(200).json({ analysis: parsed });
//   } catch (error) {
//     console.error('AI analysis failed:', error);
//     res.status(500).json({ message: 'Failed to get AI analysis' });
//   }
// };

// export { analyzePortfolio };
import { GoogleGenAI } from '@google/genai';
import Investment from '../models/investment.js';

// =====================
// Route 1: Get AI Portfolio Analysis
// =====================
const analyzePortfolio = async (req, res) => {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const investments = await Investment.find({ user: req.user.id });

    if (investments.length === 0) {
      return res.status(200).json({
        analysis: {
          summary: 'No investments to analyze.',
          riskLevel: 'Low',
          suggestions: [],
        },
      });
    }

    const portfolioSummary = investments
      .map((inv) => `- ${inv.assetType}: ${inv.assetName} ($${inv.amount})`)
      .join('\n');

    const prompt = `
You are a skilled and professional financial advisor in India.

Analyze this portfolio and respond ONLY with a valid JSON object like:
{
  "riskLevel": "Low" | "Medium" | "High",
  "summary": "1-paragraph analysis of the portfolio",
  "InvestmentTip": "As a financial advisor, give a tip that explains how investing ₹100 in a specific stock would impact the portfolio",
  "suggestions": [
    "First tip",
    "Second tip",
    "Third tip"
  ]
}

Portfolio:
${portfolioSummary}
    `;

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const response = result.text;
    const parsed = JSON.parse(response || '{}');

    res.status(200).json({ analysis: parsed });
  } catch (error) {
    console.error('AI analysis failed:', error);
    res.status(500).json({ message: 'Failed to get AI analysis' });
  }
};

// =====================
// Route 2: Ask AI (portfolio or general)
// =====================
const askAi = async (req, res) => {
  try {
    const { type, question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ message: 'Question is required' });
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let prompt = '';

    if (type === 'portfolio') {
      const investments = await Investment.find({ user: req.user.id });

      const portfolioSummary = investments.length > 0
        ? investments.map((inv) => `- ${inv.assetType}: ${inv.assetName} ($${inv.amount})`).join('\n')
        : 'No investments.';

      prompt = `
You are a financial advisor helping analyze Indian portfolios.
This is the user's portfolio:
${portfolioSummary}

Now answer this question:
${question}
      `.trim();
    } else {
      // General financial question
      prompt = question;
    }

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const aiText = result?.response?.text || result.text;

    if (!aiText) {
      return res.status(200).json({ answer: 'AI responded, but no readable answer was returned.' });
    }

    res.status(200).json({ answer: aiText });
  } catch (error) {
    console.error('Ask AI failed:', error);
    res.status(500).json({ message: 'AI failed to answer the question' });
  }
};

export { analyzePortfolio, askAi };
