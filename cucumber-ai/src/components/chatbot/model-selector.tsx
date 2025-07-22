'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';
import { saveChatModelAsCookie } from '@/app/dashboard/ai-assistant/actions';
import { Button } from '@/components/chatbot/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/chatbot/ui/dropdown-menu';
import { chatModels } from '@/lib/chatbot/ai/models';
import { cn } from '@/lib/chatbot/utils';

import { CheckCircleFillIcon, ChevronDownIcon } from './icons';
import { entitlementsByUserType } from '@/lib/chatbot/ai/entitlements';
// import type { Session } from 'next-auth';
import type { Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client';
import { UserType } from '@/lib/chatbot/types';

import { useEffect } from 'react';

export function ModelSelector({
  sessionId,
  selectedModelId,
  className,
}: {
  sessionId: string;
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);
  const [userType, setUserType] = useState<UserType>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const supabase = await createClient();
      const userId = sessionId || '';
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        setUserType('guest');
      } else {
        setUserType(profile.type as UserType || 'guest');
      }
      setLoading(false);
    }
    fetchProfile();
  }, [sessionId]);

  const { availableChatModelIds } = entitlementsByUserType[userType];

  const availableChatModels = chatModels.filter((chatModel) =>
    availableChatModelIds.includes(chatModel.id),
  );
  console.log('Available chat models:', availableChatModels, 'optimisticModelId:', optimisticModelId);
  const selectedChatModel = useMemo(
    () =>
      availableChatModels.find(
        (chatModel) => chatModel.id === optimisticModelId,
      ),
    [optimisticModelId, availableChatModels],
  );

  if (loading) {
    return <Button disabled>Loading...</Button>;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          data-testid="model-selector"
          variant="outline"
          className="md:px-2 md:h-[34px]"
        >
          {selectedChatModel?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {availableChatModels.map((chatModel) => {
          const { id } = chatModel;

          return (
            <DropdownMenuItem
              data-testid={`model-selector-item-${id}`}
              key={id}
              onSelect={() => {
                setOpen(false);

                startTransition(() => {
                  setOptimisticModelId(id);
                  saveChatModelAsCookie(id);
                });
              }}
              data-active={id === optimisticModelId}
              asChild
            >
              <button
                type="button"
                className="gap-4 group/item flex flex-row justify-between items-center w-full"
              >
                <div className="flex flex-col gap-1 items-start">
                  <div>{chatModel.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {chatModel.description}
                  </div>
                </div>

                <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                  <CheckCircleFillIcon />
                </div>
              </button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
