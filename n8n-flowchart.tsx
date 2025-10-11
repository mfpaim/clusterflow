import React, { useState } from 'react';
import { FileText, Database, Brain, FileCheck, Mail, CheckCircle, AlertCircle, Settings } from 'lucide-react';

const N8nFlowchart = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedPath, setSelectedPath] = useState('all');

  const nodeDetails = {
    trigger: {
      title: "Google Drive Trigger",
      description: "Watches folder for new PDF uploads",
      config: "Folder: 'Tests to Convert'\nPoll Time: Every 1 minute\nFile Type Filter: .pdf",
      icon: FileText
    },
    extract: {
      title: "PDF Text Extraction",
      description: "Converts PDF to plain text",
      config: "Method: OCR + Text Parser\nOutput: Raw text string\nHandles: Scanned & digital PDFs",
      icon: FileCheck
    },
    metadata: {
      title: "Extract Metadata",
      description: "Gets file name, date, size",
      config: "Captures: File name, upload date\nUsed for: Document naming",
      icon: Database
    },
    standards: {
      title: "Standards Lookup",
      description: "Fetch relevant standards from database",
      config: "Source: Google Sheets or Airtable\nMatch by: Grade + Subject\nOutput: Standards array",
      icon: Database
    },
    ai: {
      title: "AI Processing (LLM)",
      description: "Generate lesson plan with AI",
      config: "Model: GPT-4 or Claude\nMax Tokens: 4000\nTemperature: 0.7\nIncludes: Standards alignment",
      icon: Brain
    },
    doc: {
      title: "Create Google Doc",
      description: "Generate formatted document",
      config: "Template: Pre-formatted\nFolder: 'Generated Lesson Plans'\nPermissions: Editable by teacher",
      icon: FileText
    },
    email: {
      title: "Send Notification",
      description: "Email teacher with link",
      config: "Subject: 'Lesson Plan Ready'\nBody: Doc link + summary\nCC: Optional dept. head",
      icon: Mail
    },
    success: {
      title: "Success Log",
      description: "Track completed workflows",
      config: "Logs to: Spreadsheet\nMetrics: Time, file name, status",
      icon: CheckCircle
    },
    error: {
      title: "Error Handler",
      description: "Catch and notify on failures",
      config: "Action: Email admin\nRetry: 2 attempts\nLog error details",
      icon: AlertCircle
    }
  };

  const paths = {
    all: ['trigger', 'extract', 'metadata', 'standards', 'ai', 'doc', 'email', 'success'],
    simple: ['trigger', 'extract', 'ai', 'doc', 'email'],
    advanced: ['trigger', 'extract', 'metadata', 'standards', 'ai', 'doc', 'email', 'success', 'error']
  };

  const renderNode = (nodeKey, position) => {
    const node = nodeDetails[nodeKey];
    const Icon = node.icon;
    const isActive = paths[selectedPath].includes(nodeKey);
    const isHovered = hoveredNode === nodeKey;

    return (
      <div
        key={nodeKey}
        className={`absolute transition-all duration-300 ${
          isActive ? 'opacity-100' : 'opacity-30'
        }`}
        style={position}
        onMouseEnter={() => setHoveredNode(nodeKey)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <div className={`relative ${isHovered ? 'z-10' : 'z-0'}`}>
          <div className={`bg-white rounded-lg border-2 p-4 shadow-lg transition-all duration-300 ${
            isActive ? 'border-blue-500' : 'border-gray-300'
          } ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100'}`}
          style={{ width: '200px' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`${isActive ? 'text-blue-500' : 'text-gray-400'}`} size={24} />
              <h3 className="font-bold text-sm">{node.title}</h3>
            </div>
            <p className="text-xs text-gray-600 mb-2">{node.description}</p>
            {isHovered && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 whitespace-pre-line">{node.config}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderConnection = (from, to, isActive) => {
    const fromPos = positions[from];
    const toPos = positions[to];
    
    if (!fromPos || !toPos) return null;

    const x1 = fromPos.left + 100;
    const y1 = fromPos.top + 80;
    const x2 = toPos.left + 100;
    const y2 = toPos.top;

    return (
      <line
        key={`${from}-${to}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isActive ? "#3B82F6" : "#E5E7EB"}
        strokeWidth={isActive ? "3" : "2"}
        markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead-inactive)"}
        className="transition-all duration-300"
      />
    );
  };

  const positions = {
    trigger: { top: 20, left: 300 },
    extract: { top: 150, left: 300 },
    metadata: { top: 150, left: 50 },
    standards: { top: 280, left: 50 },
    ai: { top: 280, left: 300 },
    doc: { top: 410, left: 300 },
    email: { top: 540, left: 300 },
    success: { top: 540, left: 550 },
    error: { top: 670, left: 300 }
  };

  const connections = {
    all: [
      ['trigger', 'extract'],
      ['trigger', 'metadata'],
      ['extract', 'ai'],
      ['metadata', 'standards'],
      ['standards', 'ai'],
      ['ai', 'doc'],
      ['doc', 'email'],
      ['email', 'success']
    ],
    simple: [
      ['trigger', 'extract'],
      ['extract', 'ai'],
      ['ai', 'doc'],
      ['doc', 'email']
    ],
    advanced: [
      ['trigger', 'extract'],
      ['trigger', 'metadata'],
      ['extract', 'ai'],
      ['metadata', 'standards'],
      ['standards', 'ai'],
      ['ai', 'doc'],
      ['doc', 'email'],
      ['email', 'success'],
      ['ai', 'error'],
      ['doc', 'error']
    ]
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                n8n Lesson Plan Generator Workflow
              </h1>
              <p className="text-gray-600">
                Visual flowchart showing the complete automation process
              </p>
            </div>
            <Settings className="text-blue-500" size={48} />
          </div>
          
          {/* Path Selector */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setSelectedPath('simple')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPath === 'simple'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Simple Version (5 nodes)
            </button>
            <button
              onClick={() => setSelectedPath('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPath === 'all'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Standard Version (8 nodes)
            </button>
            <button
              onClick={() => setSelectedPath('advanced')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPath === 'advanced'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Advanced Version (9 nodes)
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> Hover over any node to see configuration details. 
            Switch between workflow versions to see complexity levels.
          </p>
        </div>

        {/* Flowchart Canvas */}
        <div className="bg-white rounded-lg shadow-lg p-8 relative" style={{ minHeight: '800px' }}>
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <marker
                id="arrowhead-active"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
              </marker>
              <marker
                id="arrowhead-inactive"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#E5E7EB" />
              </marker>
            </defs>
            {connections[selectedPath].map(([from, to]) =>
              renderConnection(from, to, true)
            )}
            {selectedPath === 'advanced' && (
              <>
                {renderConnection('ai', 'error', true)}
                {renderConnection('doc', 'error', true)}
              </>
            )}
          </svg>

          {/* Nodes */}
          {Object.keys(nodeDetails).map(nodeKey => {
            const pos = positions[nodeKey];
            return paths[selectedPath].includes(nodeKey) && renderNode(nodeKey, pos);
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow">
            <h4 className="font-bold text-sm mb-2">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Active Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Inactive Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                <span>Data Flow</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-2 text-green-600">⚡ Time Savings</h3>
            <p className="text-2xl font-bold">2-3 hours</p>
            <p className="text-sm text-gray-600">Reduced to 5 minutes per plan</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-2 text-blue-600">💰 Monthly Cost</h3>
            <p className="text-2xl font-bold">$20-30</p>
            <p className="text-sm text-gray-600">n8n cloud + AI API usage</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-2 text-purple-600">🎯 Setup Time</h3>
            <p className="text-2xl font-bold">30 minutes</p>
            <p className="text-sm text-gray-600">One-time configuration</p>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Implementation Steps</h2>
          <div className="space-y-3">
            {[
              { step: 1, title: "Set up n8n account", desc: "Sign up at n8n.io or self-host" },
              { step: 2, title: "Connect Google Drive", desc: "Authorize n8n to access your Drive" },
              { step: 3, title: "Add AI credentials", desc: "Input OpenAI or Anthropic API key" },
              { step: 4, title: "Configure trigger", desc: "Set folder and polling interval" },
              { step: 5, title: "Test with sample PDF", desc: "Upload a test file and verify output" },
              { step: 6, title: "Customize prompt", desc: "Adjust for your state standards" },
              { step: 7, title: "Go live", desc: "Share folder with teachers" }
            ].map(item => (
              <div key={item.step} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default N8nFlowchart;