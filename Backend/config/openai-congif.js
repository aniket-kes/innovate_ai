import { Configuration } from 'openai';

export const ConfigureOpenAi = () => {
    const config = new Configuration({
        apiKey: process.env.OPEN_AI_SECRET_KEY,
    })
    return config;
};