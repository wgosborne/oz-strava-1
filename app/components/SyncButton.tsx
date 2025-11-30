'use client';

import { useState } from 'react';
import { syncFromStrava } from '@/app/actions/syncFromStrava';

interface SyncResult {
  success: boolean;
  activitiesSynced: number;
  gearSynced: number;
  message?: string;
}

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncMessage, setSyncMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    setIsError(false);

    try {
      const result: SyncResult = await syncFromStrava();
      setLastSyncTime(new Date());
      setSyncMessage(
        `Synced ${result.activitiesSynced} activities, ${result.gearSynced} gear items`
      );
      setIsError(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      setSyncMessage(`${errorMessage}`);
      setIsError(true);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isSyncing ? 'Syncing...' : 'Sync from Strava'}
      </button>

      {lastSyncTime && !syncMessage && (
        <span className="text-sm text-gray-600">
          Last synced: {lastSyncTime.toLocaleTimeString()}
        </span>
      )}

      {syncMessage && (
        <span className={`text-sm font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {syncMessage}
        </span>
      )}
    </div>
  );
}
