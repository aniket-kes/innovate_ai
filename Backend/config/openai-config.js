import { OpenAI } from 'openai';

export const ConfigureOpenAi = () => {
    const config = new OpenAI({apiKey: "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"});
        //organization:process.env.OPENAI_ORGANIZATION_ID
    return config;
};