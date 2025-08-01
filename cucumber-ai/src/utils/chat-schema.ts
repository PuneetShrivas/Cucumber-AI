import { UIDataTypes, UIMessage } from 'ai';
import { z } from 'zod/v4';

export const myMessageMetadataSchema = z.object({
  createdAt: z.number(),
});

export type MyMessageMetadata = z.infer<typeof myMessageMetadataSchema>;

export type MyUIMessage = UIMessage<MyMessageMetadata, UIDataTypes>;

export type ChatData = {
  id: string;
  title: string;
  messages: MyUIMessage[];
  createdAt: number;
  activeStreamId: string | null;
};