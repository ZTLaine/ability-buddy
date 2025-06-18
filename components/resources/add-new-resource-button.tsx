'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { AppButton } from '@/components/ui/app-button';
import { CreateResourceModal } from './create-resource-modal'; // Use the renamed modal
import { PlusCircleIcon } from 'lucide-react';

interface AddNewResourceButtonProps {
  onResourceCreated?: () => void;
}

export function AddNewResourceButton({ onResourceCreated }: AddNewResourceButtonProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return null; // Don't render anything if user is not logged in
  }

  return (
    <CreateResourceModal onResourceCreated={onResourceCreated}>
      <AppButton appVariant="primary" className="rounded-lg flex items-center gap-2">
        <PlusCircleIcon size={20} />
        Add New Resource
      </AppButton>
    </CreateResourceModal>
  );
} 