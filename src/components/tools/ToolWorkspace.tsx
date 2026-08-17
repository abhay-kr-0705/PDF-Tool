import React from 'react';
import { ToolDefinition } from '../../types';
import { CompressTool } from './CompressTool';
import { MergeTool } from './MergeTool';
import { SplitTool } from './SplitTool';
import { ScannedOcrTool } from './ScannedOcrTool';
import { CanvasEditorTool } from './CanvasEditorTool';
import { WatermarkTool } from './WatermarkTool';
import { ProtectUnlockTool } from './ProtectUnlockTool';
import { PageNumbersTool } from './PageNumbersTool';
import { OrganizeRotateTool } from './OrganizeRotateTool';
import { GenericConvertTool } from './GenericConvertTool';
import { ToolSEOContent } from '../seo/ToolSEOContent';
import { IconRenderer } from '../common/IconRenderer';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  onNavigate: (slug: string) => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool, onNavigate }) => {
  const renderToolComponent = () => {
    switch (tool.id) {
      case 'compress-pdf':
        return <CompressTool tool={tool} />;
      case 'merge-pdf':
        return <MergeTool tool={tool} />;
      case 'split-pdf':
        return <SplitTool tool={tool} />;
      case 'edit-scanned-pdf':
        return <ScannedOcrTool tool={tool} />;
      case 'edit-pdf':
      case 'sign-pdf':
      case 'redact-pdf':
        return <CanvasEditorTool tool={tool} />;
      case 'watermark-pdf':
        return <WatermarkTool tool={tool} />;
      case 'protect-pdf':
      case 'unlock-pdf':
        return <ProtectUnlockTool tool={tool} />;
      case 'page-numbers':
        return <PageNumbersTool tool={tool} />;
      case 'rotate-pdf':
      case 'organize-pdf':
      case 'delete-pages':
      case 'extract-pages':
      case 'n-up-pdf':
      case 'resize-pdf':
      case 'grayscale-pdf':
      case 'invert-pdf':
      case 'flatten-pdf':
      case 'crop-pdf':
      case 'pdf-metadata':
        return <OrganizeRotateTool tool={tool} />;
      default:
        return <GenericConvertTool tool={tool} />;
    }
  };

  return (
    <div className="py-6 space-y-6 animate-in fade-in">
      
      {/* Top Header / Back link */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All PDF Tools
        </button>

        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Browser
        </div>
      </div>

      {/* Tool Title & Subtitle */}
      <div className="max-w-3xl mx-auto px-4 text-center space-y-2">
        <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center ${tool.color} bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm`}>
          <IconRenderer name={tool.icon} className="w-6 h-6" />
        </div>

        <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          {tool.name}
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {tool.shortDesc}
        </p>
      </div>

      {/* Interactive Tool Container */}
      <div className="px-4 sm:px-6">
        {renderToolComponent()}
      </div>

      {/* Rich SEO Content */}
      <ToolSEOContent tool={tool} onNavigate={onNavigate} />
    </div>
  );
};
