import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        rememberLastUsedCamera: true,
      },
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        html5QrcodeScanner.clear();
        onScan(decodedText);
      },
      (errorMessage) => {
        // Ignore errors from html5-qrcode as they are usually just standard scan failures
      }
    );

    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-slate-800">Scan Product Barcode</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 flex-grow bg-slate-50 relative aspect-square">
           <div id="reader" ref={scannerRef} className="w-full h-full overflow-hidden rounded-xl border-2 border-dashed border-emerald-200"></div>
        </div>
        <div className="p-4 bg-white border-t border-gray-100">
           <p className="text-xs text-slate-500 text-center mb-4">Position the barcode within the frame to scan.</p>
           <Button onClick={onClose} variant="outline" className="w-full">Cancel</Button>
        </div>
      </div>
    </div>
  );
}
