"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ExternalLink, Info, BookOpen } from 'lucide-react';

// Sample data structure from your RAG system
const sampleResponse = {
  "response": {
    "text": "The property at 280 Richards Street in Red Hook, Brooklyn, is utilized as a logistics facility for Amazon, falling under industrial and last-mile distribution use. This type of use is exclusively permitted in M (Manufacturing) or C9 (Commercial with specific industrial use provisions) zones, indicating that 280 Richards is likely zoned M or C9.\n\nAs of May 2024, new industrial zoning regulations in New York City mandate that last-mile facilities must obtain a special permit from the City Planning Commission. This requirement introduces additional restrictions and curbs speculative development, thereby enhancing the value of existing compliant properties such as 280 Richards.\n\nThe Red Hook area presents significant barriers to entry for new logistics and industrial development. These include limited availability of M or C9 zoned land, the willingness of residential developers to pay higher premiums for land conversions, and the new special permitting requirements for establishing new facilities. These elements collectively position 280 Richards as a unique and valuable industrial asset within a highly regulated zoning environment. The uncertainty of approval for new permits is expected to discourage future speculative industrial development, leading to an increase in market rents and a decrease in vacancy rates.",
    "has_sources": true
  },
  "sources": [
    {
      "id": 1,
      "title": "document.md",
      "page": null,
      "relevance": "28.6%",
      "preview": "MARKET (Line 307)\n\nChart data for Warehouse In-Place Rent PSF and Warehouse Market Rent PSF: (Lines 308-331)\n- Year 1: In-Place $36.92, Market $40.00\n- Year 2: In-Place $38.03, Market $41.20\n- Year 3:...",
      "citation": "[1]"
    },
    {
      "id": 2,
      "title": "document.md",
      "page": null,
      "relevance": "28.6%",
      "preview": "MARKET (Line 307)\n\nChart data for Warehouse In-Place Rent PSF and Warehouse Market Rent PSF: (Lines 308-331)\n- Year 1: In-Place $36.92, Market $40.00\n- Year 2: In-Place $38.03, Market $41.20\n- Year 3:...",
      "citation": "[2]"
    },
    {
      "id": 3,
      "title": "document.md",
      "page": null,
      "relevance": "26.8%",
      "preview": "Residential developers' willing to pay 3X premium for land sites (Line 483-488)\n    - New industrial permit, introduced in May 2024, mandates last-mile facilities to apply for a special permit from th...",
      "citation": "[3]"
    },
    {
      "id": 4,
      "title": "document.md",
      "page": null,
      "relevance": "26.8%",
      "preview": "Residential developers' willing to pay 3X premium for land sites (Line 483-488)\n    - New industrial permit, introduced in May 2024, mandates last-mile facilities to apply for a special permit from th...",
      "citation": "[4]"
    }
  ],
  "metadata": {
    "source_count": 4,
    "avg_similarity": 0.27687537475164337,
    "unique_files": ["document.md"]
  }
};

// Approach 1: Simple Layout with Sidebar
const SimpleRAGResponse = ({ data }) => {
  const [selectedSource, setSelectedSource] = useState(null);
  
  return (
    <div className="flex gap-6 max-w-7xl mx-auto p-6">
      {/* Main Response */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border p-6">
        <div className="prose max-w-none">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 m-0">Response</h3>
            {data.response.has_sources && (
              <span className="text-sm text-gray-500">
                ({data.metadata.source_count} sources)
              </span>
            )}
          </div>
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {data.response.text}
          </div>
        </div>
      </div>
      
      {/* Sources Sidebar */}
      {data.response.has_sources && (
        <div className="w-80 bg-gray-50 rounded-lg shadow-sm border">
          <div className="p-4 border-b bg-white rounded-t-lg">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Sources
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {data.metadata.source_count} references found
            </p>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {data.sources.map((source) => (
              <div 
                key={source.id}
                className="bg-white rounded-lg p-3 border hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setSelectedSource(source)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {source.citation}
                  </span>
                  <span className="text-xs text-green-600 font-medium">
                    {source.relevance}
                  </span>
                </div>
                <h5 className="font-medium text-sm text-gray-900 mb-1">
                  {source.title}
                </h5>
                <p className="text-xs text-gray-600 line-clamp-3">
                  {source.preview}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Approach 2: Inline Citations with Expandable Sources
const InlineCitationResponse = ({ data }) => {
  const [expandedSources, setExpandedSources] = useState(false);
  const [hoveredCitation, setHoveredCitation] = useState(null);
  
  // Function to highlight citations in text
  const renderTextWithCitations = (text) => {
    const citationRegex = /\[(\d+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = citationRegex.exec(text)) !== null) {
      // Add text before citation
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Add citation button
      const citationNum = match[1];
      const source = data.sources.find(s => s.id.toString() === citationNum);
      
      parts.push(
        <button
          key={match.index}
          className="inline-flex items-center mx-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors relative"
          onMouseEnter={() => setHoveredCitation(source)}
          onMouseLeave={() => setHoveredCitation(null)}
        >
          [{citationNum}]
          {hoveredCitation === source && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
              <div className="font-medium mb-1">{source.title}</div>
              <div className="text-gray-300">{source.preview}</div>
            </div>
          )}
        </button>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts;
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Response Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Result</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{data.metadata.source_count} sources</span>
              <span>Avg. relevance: {(data.metadata.avg_similarity * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          <div className="prose max-w-none text-gray-800 leading-relaxed">
            {renderTextWithCitations(data.response.text)}
          </div>
        </div>
        
        {/* Sources Section */}
        {data.response.has_sources && (
          <div className="border-t">
            <button
              onClick={() => setExpandedSources(!expandedSources)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">References & Sources</span>
                <span className="text-sm text-gray-500">({data.sources.length})</span>
              </div>
              {expandedSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {expandedSources && (
              <div className="px-6 pb-6">
                <div className="grid gap-4">
                  {data.sources.map((source) => (
                    <div key={source.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {source.citation}
                          </span>
                          <h4 className="font-medium text-gray-900">{source.title}</h4>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {source.relevance} relevant
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {source.preview}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Approach 3: Advanced Tabbed Interface
const TabbedRAGResponse = ({ data }) => {
  const [activeTab, setActiveTab] = useState('response');
  const [selectedSource, setSelectedSource] = useState(null);
  
  const tabs = [
    { id: 'response', label: 'Response', icon: BookOpen },
    { id: 'sources', label: `Sources (${data.sources.length})`, icon: FileText },
    { id: 'metadata', label: 'Details', icon: Info }
  ];
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b bg-gray-50">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'response' && (
            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {data.response.text}
              </div>
            </div>
          )}
          
          {activeTab === 'sources' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Source Documents</h4>
                {data.sources.map((source) => (
                  <div
                    key={source.id}
                    onClick={() => setSelectedSource(source)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedSource?.id === source.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {source.citation}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {source.relevance}
                      </span>
                    </div>
                    <h5 className="font-medium text-gray-900 mb-1">{source.title}</h5>
                    {source.page && (
                      <p className="text-sm text-gray-600 mb-2">Page {source.page}</p>
                    )}
                  </div>
                ))}
              </div>
              
              {selectedSource && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Preview</h4>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {selectedSource.preview}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Relevance: {selectedSource.relevance}</span>
                      <span>Citation: {selectedSource.citation}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'metadata' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Query Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sources:</span>
                    <span className="font-medium">{data.metadata.source_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Similarity:</span>
                    <span className="font-medium">{(data.metadata.avg_similarity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unique Files:</span>
                    <span className="font-medium">{data.metadata.unique_files.length}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Source Files</h4>
                <div className="space-y-2">
                  {data.metadata.unique_files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Demo Component
const RAGResponseDemo = () => {
  const [selectedApproach, setSelectedApproach] = useState('simple');
  
  const approaches = [
    { id: 'simple', label: 'Simple Sidebar Layout', component: SimpleRAGResponse },
    { id: 'inline', label: 'Inline Citations', component: InlineCitationResponse },
    { id: 'tabbed', label: 'Advanced Tabbed', component: TabbedRAGResponse }
  ];
  
  const SelectedComponent = approaches.find(a => a.id === selectedApproach)?.component;
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Approach Selector */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">RAG Response Frontend Approaches</h2>
          <div className="flex gap-2">
            {approaches.map((approach) => (
              <button
                key={approach.id}
                onClick={() => setSelectedApproach(approach.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedApproach === approach.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {approach.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Selected Component */}
      <div className="py-8">
        <SelectedComponent data={sampleResponse} />
      </div>
    </div>
  );
};

export default RAGResponseDemo;