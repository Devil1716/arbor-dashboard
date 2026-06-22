import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { Download, X, Loader2 } from 'lucide-react';
import { APP_VERSION } from '@/lib/constants';

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  assets: {
    browser_download_url: string;
    name: string;
  }[];
}

export const AutoUpdater: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState<GitHubRelease | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/Devil1716/arbor-dashboard/releases/latest', {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch release info');
        
        const data: GitHubRelease = await res.json();
        
        // Simple version comparison (assumes format v1.0.X)
        const currentParts = APP_VERSION.replace('v', '').split('.').map(Number);
        const latestParts = data.tag_name.replace('v', '').split('.').map(Number);
        
        let isNewer = false;
        for (let i = 0; i < 3; i++) {
          if (latestParts[i] > currentParts[i]) {
            isNewer = true;
            break;
          } else if (latestParts[i] < currentParts[i]) {
            break;
          }
        }

        if (isNewer && data.assets.length > 0) {
          setUpdateAvailable(data);
        }
      } catch (err) {
        console.error('Update check failed:', err);
      }
    };

    // Check immediately on mount
    checkForUpdates();
    
    // Check every 30 minutes
    const interval = setInterval(checkForUpdates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async () => {
    if (!updateAvailable || updateAvailable.assets.length === 0) return;
    
    // Find the APK asset
    const apkAsset = updateAvailable.assets.find(a => a.name.endsWith('.apk')) || updateAvailable.assets[0];
    
    try {
      setDownloading(true);
      
      // Download the APK directly to native cache
      const downloadResult = await Filesystem.downloadFile({
        url: apkAsset.browser_download_url,
        path: 'update.apk',
        directory: Directory.Data
      });
      
      // Trigger native package installer
      await FileOpener.openFile({
        path: downloadResult.path || '',
        mimeType: 'application/vnd.android.package-archive'
      });
      
      setDismissed(true);
    } catch (err) {
      console.error('Failed to download or install update:', err);
      alert('Background download failed. Try manually from GitHub.');
      // Fallback
      window.open(apkAsset.browser_download_url, '_system');
    } finally {
      setDownloading(false);
    }
  };

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <Card className="w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
            <Download className="w-5 h-5" />
            Update Available
          </CardTitle>
          <button 
            onClick={() => setDismissed(true)}
            disabled={downloading}
            className="text-muted-foreground hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black/40 rounded p-3 border border-white/5">
            <p className="text-sm text-foreground/90 font-medium">
              Version {updateAvailable.tag_name} is ready!
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
              {updateAvailable.name || 'New features and bug fixes.'}
            </p>
            <p className="text-[10px] text-muted-foreground mt-2 border-t border-white/10 pt-2">
              Current Version: {APP_VERSION}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setDismissed(true)}
              disabled={downloading}
              className="flex-1 py-2 bg-secondary text-foreground text-sm rounded shadow-bevel active:shadow-bevel-pressed font-medium transition-all disabled:opacity-50"
            >
              Later
            </button>
            <button 
              onClick={handleUpdate}
              disabled={downloading}
              className="flex-1 py-2 bg-primary text-white text-sm rounded shadow-bevel active:shadow-bevel-pressed font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download & Install
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
