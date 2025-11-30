'use server';

import { revalidatePath } from 'next/cache';

export async function syncFromStrava() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

    const response = await fetch(`${baseUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Sync failed with status ${response.status}: ${error}`);
    }

    const result = await response.json();

    // Revalidate all pages that display activities/gear so they show fresh data
    revalidatePath('/');
    revalidatePath('/map');
    revalidatePath('/stats');
    revalidatePath('/gear');

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during sync';
    console.error('Sync error:', message);
    throw new Error(message);
  }
}
