import React, { useRef, useState, useEffect } from 'react';
import { X, PenTool, Type, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave }) => {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState('cursive');
  const [penColor, setPenColor] = useState('#0f172a');
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && tab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = penColor;
      }
    }
  }, [isOpen, tab, penColor]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        onSave(canvas.toDataURL('image/png'));
      }
    } else if (tab === 'type' && typedName.trim()) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 150;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.font = `42px ${selectedFont}, "Brush Script MT", cursive`;
        ctx.fillStyle = penColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 200, 75);
        onSave(tempCanvas.toDataURL('image/png'));
      }
    }
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onSave(reader.result as string);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-white space-y-6 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg">Create E-Signature</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 text-xs font-semibold">
          <button
            onClick={() => setTab('draw')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === 'draw' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Draw
          </button>
          <button
            onClick={() => setTab('type')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === 'type' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Type className="w-3.5 h-3.5" /> Type Cursive
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === 'upload' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Upload Image
          </button>
        </div>

        {/* Tab Content */}
        {tab === 'draw' && (
          <div className="space-y-3">
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={450}
                height={180}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-44 cursor-crosshair touch-none"
              />
              <button
                onClick={clearCanvas}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Color:</span>
              <div className="flex items-center gap-2">
                {['#0f172a', '#4338ca', '#047857', '#b91c1c'].map(c => (
                  <button
                    key={c}
                    onClick={() => setPenColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${penColor === c ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'type' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Type your full name..."
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {typedName && (
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center">
                <span className="text-4xl text-indigo-600 dark:text-indigo-400 font-serif italic">
                  {typedName}
                </span>
              </div>
            )}
          </div>
        )}

        {tab === 'upload' && (
          <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-indigo-500">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="sig-upload" />
            <label htmlFor="sig-upload" className="cursor-pointer flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8 text-slate-400" />
              <span className="font-semibold text-sm">Upload signature photo or PNG</span>
              <span className="text-xs text-slate-500">Auto-transparent background supported</span>
            </label>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Apply Signature
          </button>
        </div>
      </div>
    </div>
  );
};
