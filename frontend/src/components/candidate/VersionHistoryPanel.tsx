'use client';

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { useVersions } from '@/hooks/useCandidates';
import { useRouter } from 'next/navigation';

interface VersionHistoryPanelProps {
  candidateId: string;
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({ candidateId }) => {
  const { data, isLoading } = useVersions(candidateId);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const router = useRouter();

  const versions = data?.data || [];

  const handleToggleVersion = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else {
      if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, versionId]);
      } else {
        setSelectedVersions([selectedVersions[1], versionId]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      router.push(`/report/${candidateId}/compare?vA=${selectedVersions[0]}&vB=${selectedVersions[1]}`);
    }
  };

  if (isLoading) return <div className="animate-pulse h-48 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>;

  return (
    <Card className="overflow-hidden shadow-xl dark:bg-slate-900 border-primary/10 rounded-xl">
      <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl font-black">history</span>
          <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-wider text-xs">Resume Versions</h3>
        </div>
        {selectedVersions.length === 2 && (
          <Button 
            onClick={handleCompare}
            variant="primary" 
            className="h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20"
          >
            Compare Selected
          </Button>
        )}
      </div>
      
      <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
        {versions.length === 0 ? (
          <p className="text-center text-slate-500 text-xs py-8 font-bold italic">No version history available.</p>
        ) : (
          versions.slice().reverse().map((version: any) => {
            const isSelected = selectedVersions.includes(version.versionId);
            return (
              <div 
                key={version.versionId}
                onClick={() => handleToggleVersion(version.versionId)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] ${
                    isSelected ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    V{version.versionNumber}
                  </div>
                  <div>
                    <p className={`text-[11px] font-black uppercase tracking-tight ${isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                      {version.fileName || 'Snapshot'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
                      {new Date(version.timestamp).toLocaleDateString()} • {new Date(version.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-primary text-xl font-black">check_circle</span>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {versions.length > 1 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-primary/5">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest text-center leading-relaxed">
            Select any two versions to see <br/> a side-by-side comparison.
          </p>
        </div>
      )}
    </Card>
  );
};
