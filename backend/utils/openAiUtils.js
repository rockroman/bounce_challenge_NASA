/**
 * Calculate token usage and costs for OpenAI API calls
 * @param {Object} usage - The usage object from OpenAI response
 * @returns {Object} Token usage and cost details
 */
// utils/openAiUtils.js

export function calculateTokenUsage(usage = {}) {
    const promptTokens = usage.prompt_tokens || 0;
    const completionTokens = usage.completion_tokens || 0;
    const totalTokens = usage.total_tokens || 0;

    // GPT-4o-mini pricing
    const promptCostPer1K = 0.00015;
    const completionCostPer1K = 0.0006;

    const promptCost = (promptTokens / 1000) * promptCostPer1K;
    const completionCost = (completionTokens / 1000) * completionCostPer1K;
    const totalCostUSD = promptCost + completionCost;

    const usdToEurRate = 0.92;
    const totalCostEUR = totalCostUSD * usdToEurRate;

    return {
        promptTokens,
        completionTokens,
        totalTokens,
        costUSD: totalCostUSD.toFixed(6),
        costEUR: totalCostEUR.toFixed(6)
    };
}
