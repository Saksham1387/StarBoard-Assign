"use client"

import React, { useState, useCallback, useMemo } from 'react';
import { Upload, FileSpreadsheet, Search, Filter, Download, Eye, BarChart3, Table } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';

const ExcelNavigator = () => {
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [sheetData, setSheetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'

  const handleFileUpload = useCallback((event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setLoading(true);
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        
        setWorkbook(wb);
        setSheets(wb.SheetNames);
        
        // Load first sheet by default
        if (wb.SheetNames.length > 0) {
          const firstSheet = wb.SheetNames[0];
          setActiveSheet(firstSheet);
          loadSheetData(wb, firstSheet);
        }
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading Excel file. Please ensure it\'s a valid .xlsx file.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  }, []);

  const loadSheetData = (wb, sheetName) => {
    try {
      const worksheet = wb.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setSheetData(jsonData);
    } catch (error) {
      console.error('Error loading sheet data:', error);
      setSheetData([]);
    }
  };

  const handleSheetChange = (sheetName) => {
    if (workbook) {
      setActiveSheet(sheetName);
      loadSheetData(workbook, sheetName);
      setSearchTerm('');
    }
  };

  const filteredData = sheetData.filter(row => 
    row.some(cell => 
      cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getSheetIcon = (sheetName) => {
    const name = sheetName.toLowerCase();
    if (name.includes('summary') || name.includes('overview')) return '📊';
    if (name.includes('financial') || name.includes('finance')) return '💰';
    if (name.includes('analysis') || name.includes('data')) return '📈';
    if (name.includes('property') || name.includes('real estate')) return '🏢';
    return '📋';
  };

  const downloadSheet = () => {
    if (!workbook || !activeSheet) return;
    
    const worksheet = workbook.Sheets[activeSheet];
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSheet}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Process data for charts
  const chartData = useMemo(() => {
    if (filteredData.length < 2) return [];
    
    const headers = filteredData[0] || [];
    const rows = filteredData.slice(1);
    
    // Find numeric columns
    const numericColumns = headers.map((header, index) => {
      const isNumeric = rows.some(row => {
        const value = row[index];
        return value !== null && value !== undefined && value !== '' && !isNaN(Number(value));
      });
      return { header, index, isNumeric };
    }).filter(col => col.isNumeric);

    // Create chart data (limit to first 20 rows for performance)
    return rows.slice(0, 20).map((row, rowIndex) => {
      const dataPoint = { name: `Row ${rowIndex + 1}` };
      
      // Use first non-numeric column as name if available
      const labelColumn = headers.findIndex((header, index) => {
        const value = row[index];
        return value && isNaN(Number(value)) && typeof value === 'string';
      });
      
      if (labelColumn !== -1 && row[labelColumn]) {
        dataPoint.name = row[labelColumn].toString().slice(0, 20);
      }
      
      // Add numeric data
      numericColumns.forEach(col => {
        const value = row[col.index];
        if (value !== null && value !== undefined && value !== '') {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            dataPoint[col.header] = numValue;
          }
        }
      });
      
      return dataPoint;
    }).filter(item => Object.keys(item).length > 1); // Only include rows with data
  }, [filteredData]);

  const numericColumns = useMemo(() => {
    if (filteredData.length < 2) return [];
    
    const headers = filteredData[0] || [];
    const rows = filteredData.slice(1);
    
    return headers.map((header, index) => {
      const isNumeric = rows.some(row => {
        const value = row[index];
        return value !== null && value !== undefined && value !== '' && !isNaN(Number(value));
      });
      return { header, index, isNumeric };
    }).filter(col => col.isNumeric);
  }, [filteredData]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#8dd1e1'];

  const renderChart = () => {
    if (chartData.length === 0 || numericColumns.length === 0) {
      return (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No numeric data found for chart visualization</p>
          <p className="text-sm text-gray-400 mt-2">Charts require at least one column with numeric values</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Bar Chart */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Bar Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericColumns.slice(0, 5).map((col, index) => (
                <Bar 
                  key={col.header} 
                  dataKey={col.header} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        {numericColumns.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-4">Line Chart</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                {numericColumns.slice(0, 3).map((col, index) => (
                  <Line 
                    key={col.header}
                    type="monotone" 
                    dataKey={col.header} 
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart for first numeric column */}
        {numericColumns.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-4">Pie Chart - {numericColumns[0].header}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey={numericColumns[0].header}
                >
                  {chartData.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  if (!file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
            <div className="text-center">
              <FileSpreadsheet className="mx-auto h-24 w-24 text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Upload Excel File
              </h3>
              <p className="text-gray-500 mb-6">
                Select your .xlsx file to begin analysis
              </p>
              
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
                <div className="inline-flex items-center px-8 py-4 bg-black text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg">
                  <Upload className="mr-3 h-5 w-5" />
                  Choose File
                </div>
              </label>
            </div>
          </div>

          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileSpreadsheet className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{file.name}</h1>
                <p className="text-sm text-gray-500">{sheets.length} sheets available</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Table className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'chart' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={downloadSheet}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Sheet Navigation */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Worksheets ({sheets.length})
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sheets.map((sheet, index) => (
                  <button
                    key={index}
                    onClick={() => handleSheetChange(sheet)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeSheet === sheet
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{getSheetIcon(sheet)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{sheet}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {activeSheet}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{filteredData.length} rows</span>
                    <span>•</span>
                    <span>{filteredData[0]?.length || 0} columns</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                  </div>
                ) : viewMode === 'table' ? (
                  filteredData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {filteredData[0]?.map((header, index) => (
                              <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header || `Column ${index + 1}`}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredData.slice(1, 21).map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                  {cell?.toString() || ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {filteredData.length > 21 && (
                        <div className="mt-4 text-center text-sm text-gray-500">
                          Showing first 20 rows of {filteredData.length} total rows
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No data to display</p>
                    </div>
                  )
                ) : (
                  renderChart()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelNavigator;