import { OpenAI } from 'openai';

export const ConfigureOpenAi = () => {
    const config = new OpenAI({apiKey: ""});
        //organization:process.env.OPENAI_ORGANIZATION_ID
    return config;
};