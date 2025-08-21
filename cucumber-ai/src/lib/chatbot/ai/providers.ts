import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import {gateway} from '@ai-sdk/gateway';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

const availableModels = gateway.getAvailableModels();
export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': xai('grok-2-vision-1212'),
        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': xai('grok-2-1212'),
        // 'gpt-4.1': openai('gpt-4.1'),
        // 'gpt-3.5-turbo': openai('gpt-3.5-turbo'),
        'gpt-4.1': gateway('openai/gpt-4.1'),
        'gpt-3.5-turbo': gateway('openai/gpt-3.5-turbo'),
      },
      imageModels: {
        'small-model': xai.imageModel('grok-2-image'),
      },
    });
