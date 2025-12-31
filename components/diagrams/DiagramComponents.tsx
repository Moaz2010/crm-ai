"use client";

import React from "react";

interface DiagramProps {
  isDarkMode?: boolean;
}

// ============ ERD LEVEL 0 - Chen Notation (Conceptual) ============
export const ERDLevel0: React.FC<DiagramProps> = ({ isDarkMode = false }) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
  const subTextColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const strokeColor = isDarkMode ? "#9ca3af" : "#374151";
  const entityFill = isDarkMode ? "#374151" : "#fef3c7";
  const entityStroke = isDarkMode ? "#fbbf24" : "#f59e0b";
  const attrFill = isDarkMode ? "#1f2937" : "white";
  const keyAttrFill = isDarkMode ? "#1e3a5f" : "#dbeafe";
  const multiAttrStroke = isDarkMode ? "#9ca3af" : "#374151";
  const derivedStroke = isDarkMode ? "#6b7280" : "#6b7280";
  const relationFill = isDarkMode ? "#1e3a5f" : "#e0f2fe";
  const relationStroke = isDarkMode ? "#3b82f6" : "#0284c7";
  
  return (
    <svg viewBox="0 0 900 650" className="w-full h-full">
      {/* Title */}
      <text x="450" y="30" textAnchor="middle" className="text-xl font-bold" fill={textColor}>
        ERD (Level 0) - Chen Notation - Conceptual Model
      </text>
      <text x="450" y="50" textAnchor="middle" className="text-sm" fill={subTextColor}>
        Entities with attributes shown as ovals
      </text>

      {/* ========== LEAD ENTITY ========== */}
      <g>
        {/* Entity Rectangle */}
        <rect x="350" y="250" width="120" height="50" fill={entityFill} stroke={entityStroke} strokeWidth="3" />
        <text x="410" y="280" textAnchor="middle" className="text-sm font-bold" fill={textColor}>LEAD</text>

        {/* Primary Key: lead_id (underlined oval) */}
        <ellipse cx="410" cy="160" rx="50" ry="20" fill={keyAttrFill} stroke={strokeColor} strokeWidth="2" />
        <text x="410" y="165" textAnchor="middle" className="text-xs font-semibold" fill={textColor} textDecoration="underline">lead_id</text>
        <line x1="410" y1="180" x2="410" y2="250" stroke={strokeColor} strokeWidth="1.5" />

        {/* first_name */}
        <ellipse cx="280" cy="180" rx="45" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="280" y="184" textAnchor="middle" className="text-xs" fill={textColor}>first_name</text>
        <line x1="310" y1="193" x2="360" y2="250" stroke={strokeColor} strokeWidth="1" />

        {/* last_name */}
        <ellipse cx="200" cy="230" rx="45" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="200" y="234" textAnchor="middle" className="text-xs" fill={textColor}>last_name</text>
        <line x1="240" y1="238" x2="350" y2="265" stroke={strokeColor} strokeWidth="1" />

        {/* email */}
        <ellipse cx="200" cy="290" rx="35" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="200" y="294" textAnchor="middle" className="text-xs" fill={textColor}>email</text>
        <line x1="235" y1="290" x2="350" y2="280" stroke={strokeColor} strokeWidth="1" />

        {/* Multi-valued: phone (double oval) */}
        <ellipse cx="280" cy="350" rx="40" ry="18" fill={attrFill} stroke={multiAttrStroke} strokeWidth="1.5" />
        <ellipse cx="280" cy="350" rx="34" ry="14" fill="none" stroke={multiAttrStroke} strokeWidth="1" />
        <text x="280" y="354" textAnchor="middle" className="text-xs" fill={textColor}>phone</text>
        <line x1="305" y1="335" x2="360" y2="300" stroke={strokeColor} strokeWidth="1" />

        {/* Derived: lead_score (dashed oval) */}
        <ellipse cx="540" cy="180" rx="50" ry="18" fill={attrFill} stroke={derivedStroke} strokeWidth="1.5" strokeDasharray="5,3" />
        <text x="540" y="184" textAnchor="middle" className="text-xs" fill={textColor}>lead_score</text>
        <line x1="510" y1="193" x2="460" y2="250" stroke={strokeColor} strokeWidth="1" />

        {/* status */}
        <ellipse cx="540" cy="230" rx="35" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="540" y="234" textAnchor="middle" className="text-xs" fill={textColor}>status</text>
        <line x1="510" y1="238" x2="470" y2="260" stroke={strokeColor} strokeWidth="1" />

        {/* created_at */}
        <ellipse cx="540" cy="290" rx="45" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="540" y="294" textAnchor="middle" className="text-xs" fill={textColor}>created_at</text>
        <line x1="500" y1="290" x2="470" y2="280" stroke={strokeColor} strokeWidth="1" />
      </g>

      {/* ========== USER ENTITY ========== */}
      <g>
        <rect x="70" y="450" width="100" height="50" fill={entityFill} stroke={entityStroke} strokeWidth="3" />
        <text x="120" y="480" textAnchor="middle" className="text-sm font-bold" fill={textColor}>USER</text>

        {/* user_id (PK) */}
        <ellipse cx="50" cy="400" rx="40" ry="18" fill={keyAttrFill} stroke={strokeColor} strokeWidth="2" />
        <text x="50" y="404" textAnchor="middle" className="text-xs font-semibold" fill={textColor} textDecoration="underline">user_id</text>
        <line x1="70" y1="415" x2="100" y2="450" stroke={strokeColor} strokeWidth="1" />

        {/* email */}
        <ellipse cx="50" cy="520" rx="35" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="50" y="524" textAnchor="middle" className="text-xs" fill={textColor}>email</text>
        <line x1="70" y1="505" x2="100" y2="500" stroke={strokeColor} strokeWidth="1" />

        {/* full_name */}
        <ellipse cx="180" cy="540" rx="45" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="180" y="544" textAnchor="middle" className="text-xs" fill={textColor}>full_name</text>
        <line x1="160" y1="525" x2="140" y2="500" stroke={strokeColor} strokeWidth="1" />
      </g>

      {/* ========== COMPANY ENTITY ========== */}
      <g>
        <rect x="700" y="450" width="120" height="50" fill={entityFill} stroke={entityStroke} strokeWidth="3" />
        <text x="760" y="480" textAnchor="middle" className="text-sm font-bold" fill={textColor}>COMPANY</text>

        {/* company_id (PK) */}
        <ellipse cx="820" cy="400" rx="50" ry="18" fill={keyAttrFill} stroke={strokeColor} strokeWidth="2" />
        <text x="820" y="404" textAnchor="middle" className="text-xs font-semibold" fill={textColor} textDecoration="underline">company_id</text>
        <line x1="800" y1="415" x2="780" y2="450" stroke={strokeColor} strokeWidth="1" />

        {/* name */}
        <ellipse cx="850" cy="520" rx="35" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="850" y="524" textAnchor="middle" className="text-xs" fill={textColor}>name</text>
        <line x1="830" y1="505" x2="800" y2="500" stroke={strokeColor} strokeWidth="1" />

        {/* domain */}
        <ellipse cx="700" cy="540" rx="40" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="700" y="544" textAnchor="middle" className="text-xs" fill={textColor}>domain</text>
        <line x1="720" y1="525" x2="740" y2="500" stroke={strokeColor} strokeWidth="1" />

        {/* industry */}
        <ellipse cx="620" cy="490" rx="40" ry="18" fill={attrFill} stroke={strokeColor} strokeWidth="1.5" />
        <text x="620" y="494" textAnchor="middle" className="text-xs" fill={textColor}>industry</text>
        <line x1="660" y1="485" x2="700" y2="475" stroke={strokeColor} strokeWidth="1" />
      </g>

      {/* ========== RELATIONSHIPS (Diamonds) ========== */}
      {/* USER --(creates)--> LEAD */}
      <g>
        <polygon points="250,400 290,425 250,450 210,425" fill={relationFill} stroke={relationStroke} strokeWidth="2" />
        <text x="250" y="430" textAnchor="middle" className="text-xs font-semibold" fill={textColor}>creates</text>
        {/* Connection lines */}
        <line x1="170" y1="460" x2="210" y2="430" stroke={strokeColor} strokeWidth="1.5" />
        <line x1="290" y1="410" x2="360" y2="300" stroke={strokeColor} strokeWidth="1.5" />
        {/* Cardinality */}
        <text x="185" y="438" className="text-xs font-bold" fill={textColor}>1</text>
        <text x="320" y="370" className="text-xs font-bold" fill={textColor}>N</text>
      </g>

      {/* LEAD --(belongs_to)--> COMPANY */}
      <g>
        <polygon points="620,350 660,375 620,400 580,375" fill={relationFill} stroke={relationStroke} strokeWidth="2" />
        <text x="620" y="380" textAnchor="middle" className="text-xs font-semibold" fill={textColor}>belongs</text>
        {/* Connection lines */}
        <line x1="470" y1="290" x2="580" y2="365" stroke={strokeColor} strokeWidth="1.5" />
        <line x1="660" y1="385" x2="720" y2="450" stroke={strokeColor} strokeWidth="1.5" />
        {/* Cardinality */}
        <text x="510" y="320" className="text-xs font-bold" fill={textColor}>N</text>
        <text x="690" y="420" className="text-xs font-bold" fill={textColor}>1</text>
      </g>

      {/* Legend */}
      <g transform="translate(30, 80)">
        <rect x="0" y="0" width="150" height="130" fill={attrFill} stroke={strokeColor} strokeWidth="1" rx="5" />
        <text x="75" y="18" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Legend</text>
        <line x1="5" y1="25" x2="145" y2="25" stroke={strokeColor} strokeWidth="0.5" />
        
        {/* Entity */}
        <rect x="10" y="35" width="30" height="15" fill={entityFill} stroke={entityStroke} strokeWidth="1.5" />
        <text x="50" y="47" className="text-xs" fill={subTextColor}>Entity</text>
        
        {/* Attribute */}
        <ellipse cx="25" cy="65" rx="15" ry="8" fill={attrFill} stroke={strokeColor} strokeWidth="1" />
        <text x="50" y="68" className="text-xs" fill={subTextColor}>Attribute</text>
        
        {/* Key */}
        <ellipse cx="25" cy="85" rx="15" ry="8" fill={keyAttrFill} stroke={strokeColor} strokeWidth="1" />
        <text x="50" y="88" className="text-xs" fill={subTextColor}>Key (underlined)</text>
        
        {/* Multi-valued */}
        <ellipse cx="25" cy="105" rx="15" ry="8" fill={attrFill} stroke={strokeColor} strokeWidth="1" />
        <ellipse cx="25" cy="105" rx="12" ry="6" fill="none" stroke={strokeColor} strokeWidth="0.5" />
        <text x="50" y="108" className="text-xs" fill={subTextColor}>Multi-valued</text>
        
        {/* Derived */}
        <ellipse cx="25" cy="122" rx="15" ry="8" fill={attrFill} stroke={derivedStroke} strokeWidth="1" strokeDasharray="3,2" />
        <text x="50" y="125" className="text-xs" fill={subTextColor}>Derived</text>
      </g>
    </svg>
  );
};

// ============ ERD LEVEL 1 - Relational Schema (Current ERD) ============
export const ERDLevel1: React.FC<DiagramProps> = ({ isDarkMode = false }) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
  const subTextColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const strokeColor = isDarkMode ? "#6b7280" : "#374151";
  const bgLight = isDarkMode ? "#1f2937" : "#f8fafc";
  
  return (
    <svg viewBox="0 0 900 500" className="w-full h-full">
      {/* Title */}
      <text x="450" y="30" textAnchor="middle" className="text-xl font-bold" fill={textColor}>
        Entity Relationship Diagram - LeadCatch System
      </text>

      {/* USER Entity - Green */}
      <g>
        <rect x="50" y="80" width="180" height="35" fill="#86efac" stroke="#22c55e" strokeWidth="2" />
        <text x="140" y="103" textAnchor="middle" className="text-sm font-bold fill-gray-800">USER</text>
        <rect x="50" y="115" width="180" height="90" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
        <text x="60" y="138" className="text-xs fill-gray-700">id : uuid (PK)</text>
        <text x="60" y="156" className="text-xs fill-gray-700">email : varchar</text>
        <text x="60" y="174" className="text-xs fill-gray-700">full_name : varchar</text>
        <text x="60" y="192" className="text-xs fill-gray-700">created_at : timestamp</text>
      </g>

      {/* LEAD Entity - Yellow/Amber */}
      <g>
        <rect x="360" y="80" width="180" height="35" fill="#fde047" stroke="#eab308" strokeWidth="2" />
        <text x="450" y="103" textAnchor="middle" className="text-sm font-bold fill-gray-800">LEAD</text>
        <rect x="360" y="115" width="180" height="145" fill="#fefce8" stroke="#eab308" strokeWidth="2" />
        <text x="370" y="138" className="text-xs fill-gray-700">id : uuid (PK)</text>
        <text x="370" y="156" className="text-xs fill-gray-700">user_id : uuid (FK)</text>
        <text x="370" y="174" className="text-xs fill-gray-700">company_id : uuid (FK)</text>
        <text x="370" y="192" className="text-xs fill-gray-700">first_name : varchar</text>
        <text x="370" y="210" className="text-xs fill-gray-700">last_name : varchar</text>
        <text x="370" y="228" className="text-xs fill-gray-700">email : varchar</text>
        <text x="370" y="246" className="text-xs fill-gray-700">lead_score : integer</text>
      </g>

      {/* COMPANY Entity - Blue */}
      <g>
        <rect x="670" y="80" width="180" height="35" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
        <text x="760" y="103" textAnchor="middle" className="text-sm font-bold fill-gray-800">COMPANY</text>
        <rect x="670" y="115" width="180" height="108" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
        <text x="680" y="138" className="text-xs fill-gray-700">id : uuid (PK)</text>
        <text x="680" y="156" className="text-xs fill-gray-700">name : varchar</text>
        <text x="680" y="174" className="text-xs fill-gray-700">domain : varchar</text>
        <text x="680" y="192" className="text-xs fill-gray-700">industry : varchar</text>
        <text x="680" y="210" className="text-xs fill-gray-700">size : varchar</text>
      </g>

      {/* CONTACT Entity - Purple */}
      <g>
        <rect x="50" y="320" width="180" height="35" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="2" />
        <text x="140" y="343" textAnchor="middle" className="text-sm font-bold fill-gray-800">CONTACT</text>
        <rect x="50" y="355" width="180" height="108" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="2" />
        <text x="60" y="378" className="text-xs fill-gray-700">id : uuid (PK)</text>
        <text x="60" y="396" className="text-xs fill-gray-700">lead_id : uuid (FK)</text>
        <text x="60" y="414" className="text-xs fill-gray-700">type : enum</text>
        <text x="60" y="432" className="text-xs fill-gray-700">value : varchar</text>
        <text x="60" y="450" className="text-xs fill-gray-700">is_primary : boolean</text>
      </g>

      {/* ACTIVITY Entity - Orange */}
      <g>
        <rect x="360" y="320" width="180" height="35" fill="#fdba74" stroke="#f97316" strokeWidth="2" />
        <text x="450" y="343" textAnchor="middle" className="text-sm font-bold fill-gray-800">ACTIVITY</text>
        <rect x="360" y="355" width="180" height="108" fill="#fff7ed" stroke="#f97316" strokeWidth="2" />
        <text x="370" y="378" className="text-xs fill-gray-700">id : uuid (PK)</text>
        <text x="370" y="396" className="text-xs fill-gray-700">lead_id : uuid (FK)</text>
        <text x="370" y="414" className="text-xs fill-gray-700">type : enum</text>
        <text x="370" y="432" className="text-xs fill-gray-700">description : text</text>
        <text x="370" y="450" className="text-xs fill-gray-700">created_at : timestamp</text>
      </g>

      {/* TAG Entity - Pink */}
      <g>
        <rect x="670" y="320" width="180" height="35" fill="#f9a8d4" stroke="#ec4899" strokeWidth="2" />
        <text x="760" y="343" textAnchor="middle" className="text-sm font-bold fill-gray-800">TAG</text>
        <rect x="670" y="355" width="180" height="72" fill="#fdf2f8" stroke="#ec4899" strokeWidth="2" />
        <text x="680" y="378" className="text-xs fill-gray-700">id : uuid (PK)</text>
        <text x="680" y="396" className="text-xs fill-gray-700">name : varchar</text>
        <text x="680" y="414" className="text-xs fill-gray-700">color : varchar</text>
      </g>

      {/* Relationships with crow's foot notation */}
      {/* USER creates LEAD (1 to Many) */}
      <line x1="230" y1="150" x2="360" y2="150" stroke="#374151" strokeWidth="2" />
      <text x="295" y="140" textAnchor="middle" className="text-xs fill-gray-600">creates</text>
      {/* 1 side */}
      <line x1="235" y1="145" x2="235" y2="155" stroke="#374151" strokeWidth="2" />
      {/* Many side - crow's foot */}
      <line x1="355" y1="150" x2="340" y2="140" stroke="#374151" strokeWidth="2" />
      <line x1="355" y1="150" x2="340" y2="160" stroke="#374151" strokeWidth="2" />

      {/* LEAD belongs_to COMPANY (Many to 1) */}
      <line x1="540" y1="150" x2="670" y2="150" stroke="#374151" strokeWidth="2" />
      <text x="605" y="140" textAnchor="middle" className="text-xs fill-gray-600">belongs to</text>
      {/* Many side - crow's foot */}
      <line x1="545" y1="150" x2="560" y2="140" stroke="#374151" strokeWidth="2" />
      <line x1="545" y1="150" x2="560" y2="160" stroke="#374151" strokeWidth="2" />
      {/* 1 side */}
      <line x1="665" y1="145" x2="665" y2="155" stroke="#374151" strokeWidth="2" />

      {/* LEAD has CONTACT (1 to Many) */}
      <line x1="140" y1="260" x2="140" y2="320" stroke="#374151" strokeWidth="2" />
      <line x1="360" y1="260" x2="140" y2="260" stroke="#374151" strokeWidth="2" />
      <text x="250" y="250" textAnchor="middle" className="text-xs fill-gray-600">has</text>
      {/* 1 side at LEAD */}
      <line x1="355" y1="255" x2="355" y2="265" stroke="#374151" strokeWidth="2" />
      {/* Many side - crow's foot at CONTACT */}
      <line x1="140" y1="315" x2="130" y2="300" stroke="#374151" strokeWidth="2" />
      <line x1="140" y1="315" x2="150" y2="300" stroke="#374151" strokeWidth="2" />

      {/* LEAD has ACTIVITY (1 to Many) */}
      <line x1="450" y1="260" x2="450" y2="320" stroke="#374151" strokeWidth="2" />
      <text x="465" y="290" className="text-xs fill-gray-600">has</text>
      {/* 1 side */}
      <line x1="445" y1="265" x2="455" y2="265" stroke="#374151" strokeWidth="2" />
      {/* Many side - crow's foot */}
      <line x1="450" y1="315" x2="440" y2="300" stroke="#374151" strokeWidth="2" />
      <line x1="450" y1="315" x2="460" y2="300" stroke="#374151" strokeWidth="2" />

      {/* LEAD tagged TAG (Many to Many) */}
      <line x1="540" y1="220" x2="670" y2="355" stroke="#374151" strokeWidth="2" />
      <text x="620" y="270" className="text-xs fill-gray-600">tagged</text>
      {/* Many side both ends */}
      <line x1="545" y1="225" x2="555" y2="210" stroke="#374151" strokeWidth="2" />
      <line x1="545" y1="225" x2="560" y2="230" stroke="#374151" strokeWidth="2" />
      <line x1="665" y1="350" x2="655" y2="340" stroke="#374151" strokeWidth="2" />
      <line x1="665" y1="350" x2="675" y2="340" stroke="#374151" strokeWidth="2" />
    </svg>
  );
};

// ============ ERD WRAPPER WITH LEVEL SELECTOR ============
interface ERDProps extends DiagramProps {
  level?: 0 | 1;
  onLevelChange?: (level: 0 | 1) => void;
  showLevelSelector?: boolean;
}

export const ERDDiagram: React.FC<ERDProps> = ({ 
  isDarkMode = false, 
  level = 1, 
  onLevelChange,
  showLevelSelector = true 
}) => {
  const [currentLevel, setCurrentLevel] = React.useState<0 | 1>(level);

  React.useEffect(() => {
    setCurrentLevel(level);
  }, [level]);

  const handleLevelChange = (newLevel: 0 | 1) => {
    setCurrentLevel(newLevel);
    onLevelChange?.(newLevel);
  };

  return (
    <div className="w-full">
      {showLevelSelector && (
        <div className={`flex items-center justify-center gap-3 p-4 mb-4 rounded-xl ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}>
          <span className={`text-sm font-semibold ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>Select ERD Style:</span>
          <div className="flex gap-2">
            {([0, 1] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                  currentLevel === lvl
                    ? isDarkMode
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                      : "bg-blue-600 text-white border-blue-600 shadow-lg"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-gray-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <span className="block font-bold">Level {lvl}</span>
                <span className={`block text-xs mt-0.5 ${
                  currentLevel === lvl 
                    ? "text-blue-100" 
                    : isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  {lvl === 0 ? "Chen (Conceptual)" : "Relational Schema"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="w-full">
        {currentLevel === 0 && <ERDLevel0 isDarkMode={isDarkMode} />}
        {currentLevel === 1 && <ERDLevel1 isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
};

// ============ SEQUENCE DIAGRAM ============
export const SequenceDiagram: React.FC<DiagramProps> = ({ isDarkMode = false }) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
  const subTextColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const strokeColor = isDarkMode ? "#9ca3af" : "#374151";
  const dashedColor = isDarkMode ? "#6b7280" : "#6b7280";
  const boxFill = isDarkMode ? "#374151" : "white";
  
  return (
    <svg viewBox="0 0 850 900" className="w-full h-full">
      {/* Title */}
      <text x="425" y="25" textAnchor="middle" className="text-xl font-bold" fill={textColor}>
        Sequence Diagram - LeadCatch System
      </text>

      {/* Participants */}
      {[
        { name: "User", x: 80 },
        { name: "Frontend", x: 230 },
        { name: "API Server", x: 410 },
        { name: "LeadService", x: 590 },
        { name: "Database", x: 770 },
      ].map((p, i) => (
        <g key={i}>
          <rect x={p.x - 55} y={40} width={110} height={35} fill={boxFill} stroke={strokeColor} strokeWidth="2" />
          <text x={p.x} y={62} textAnchor="middle" className="text-sm font-semibold" fill={textColor}>{p.name}</text>
          <line x1={p.x} y1={75} x2={p.x} y2={880} stroke={strokeColor} strokeWidth="1" strokeDasharray="6,4" />
        </g>
      ))}

      {/* Activation boxes */}
      <rect x="222" y="105" width="16" height="245" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />
      <rect x="402" y="125" width="16" height="205" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />
      <rect x="582" y="145" width="16" height="125" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />
      <rect x="762" y="165" width="16" height="45" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />
      <rect x="762" y="245" width="16" height="45" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />
      
      {/* Enrichment flow activations */}
      <rect x="222" y="400" width="16" height="245" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />
      <rect x="402" y="420" width="16" height="205" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />
      <rect x="582" y="440" width="16" height="165" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />
      <rect x="762" y="460" width="16" height="45" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />
      <rect x="762" y="560" width="16" height="45" fill={boxFill} stroke={strokeColor} strokeWidth="1.5" />

      {/* Messages - Lead Capture Flow */}
      {/* 1: Enter Lead URL */}
      <line x1="80" y1="110" x2="222" y2="110" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="151" y="100" textAnchor="middle" className="text-xs fill-gray-700">1: Enter Lead URL</text>
      
      {/* 2: POST /api/leads/parse */}
      <line x1="238" y1="130" x2="402" y2="130" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="320" y="120" textAnchor="middle" className="text-xs fill-gray-700">2: POST /api/leads/parse</text>
      
      {/* 3: parseLead(url) */}
      <line x1="418" y1="150" x2="582" y2="150" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="500" y="140" textAnchor="middle" className="text-xs fill-gray-700">3: parseLead(url)</text>
      
      {/* 4: Check duplicate */}
      <line x1="598" y1="170" x2="762" y2="170" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="680" y="160" textAnchor="middle" className="text-xs fill-gray-700">4: Check duplicate</text>
      
      {/* 5: No duplicate (response) */}
      <line x1="762" y1="200" x2="598" y2="200" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="680" y="215" textAnchor="middle" className="text-xs fill-gray-500">5: No duplicate</text>
      
      {/* 6: Parsed data */}
      <line x1="582" y1="230" x2="418" y2="230" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="500" y="245" textAnchor="middle" className="text-xs fill-gray-500">6: Parsed data</text>
      
      {/* 7: INSERT lead */}
      <line x1="418" y1="255" x2="762" y2="255" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="590" y="248" textAnchor="middle" className="text-xs" fill={textColor}>7: INSERT lead</text>
      
      {/* 8: Lead created */}
      <line x1="762" y1="290" x2="418" y2="290" stroke={dashedColor} strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="590" y="308" textAnchor="middle" className="text-xs" fill={subTextColor}>8: Lead created</text>
      
      {/* 9: Success response */}
      <line x1="402" y1="310" x2="238" y2="310" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="320" y="325" textAnchor="middle" className="text-xs fill-gray-500">9: Success response</text>
      
      {/* 10: Show new lead */}
      <line x1="222" y1="340" x2="80" y2="340" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="151" y="355" textAnchor="middle" className="text-xs fill-gray-500">10: Show new lead</text>

      {/* Separator */}
      <line x1="30" y1="380" x2="820" y2="380" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
      <text x="425" y="395" textAnchor="middle" className="text-xs fill-gray-400">Enrichment Flow</text>

      {/* Enrichment flow messages */}
      {/* 11: Click Enrich */}
      <line x1="80" y1="405" x2="222" y2="405" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="151" y="395" textAnchor="middle" className="text-xs fill-gray-700">11: Click Enrich</text>
      
      {/* 12: POST /api/leads/enrich */}
      <line x1="238" y1="425" x2="402" y2="425" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="320" y="415" textAnchor="middle" className="text-xs fill-gray-700">12: POST /api/leads/enrich</text>
      
      {/* 13: enrichLead(id) */}
      <line x1="418" y1="445" x2="582" y2="445" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="500" y="435" textAnchor="middle" className="text-xs fill-gray-700">13: enrichLead(id)</text>
      
      {/* 14: Get lead data */}
      <line x1="598" y1="465" x2="762" y2="465" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="680" y="455" textAnchor="middle" className="text-xs fill-gray-700">14: Get lead data</text>
      
      {/* 15: Lead data */}
      <line x1="762" y1="495" x2="598" y2="495" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="680" y="510" textAnchor="middle" className="text-xs fill-gray-500">15: Lead data</text>
      
      {/* 16: Self call - Call External APIs */}
      <path d="M 598 525 H 650 V 550 H 598" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="670" y="540" className="text-xs fill-gray-700">16: Call External APIs</text>
      
      {/* 17: UPDATE lead */}
      <line x1="598" y1="565" x2="762" y2="565" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="680" y="555" textAnchor="middle" className="text-xs fill-gray-700">17: UPDATE lead</text>
      
      {/* 18: Updated */}
      <line x1="762" y1="595" x2="598" y2="595" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="680" y="610" textAnchor="middle" className="text-xs fill-gray-500">18: Updated</text>
      
      {/* 19: Enriched lead */}
      <line x1="582" y1="615" x2="418" y2="615" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="500" y="630" textAnchor="middle" className="text-xs fill-gray-500">19: Enriched lead</text>
      
      {/* 20: Success response */}
      <line x1="402" y1="635" x2="238" y2="635" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="320" y="650" textAnchor="middle" className="text-xs fill-gray-500">20: Success response</text>
      
      {/* 21: Show enriched data */}
      <line x1="222" y1="655" x2="80" y2="655" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-dashed)" />
      <text x="151" y="670" textAnchor="middle" className="text-xs fill-gray-500">21: Show enriched data</text>

      {/* Arrow markers */}
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
        </marker>
        <marker id="arrow-dashed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
        </marker>
      </defs>
    </svg>
  );
};

// ============ DFD LEVEL 0 - Context Diagram ============
export const DFDLevel0: React.FC<DiagramProps> = ({ isDarkMode = false }) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
  const subTextColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const strokeColor = isDarkMode ? "#9ca3af" : "#374151";
  const boxFill = isDarkMode ? "#374151" : "white";
  const processFill = isDarkMode ? "#1e40af" : "#dbeafe";
  
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full">
      <defs>
        <marker id="dfd0-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
        </marker>
      </defs>

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" className="text-xl font-bold" fill={textColor}>
        Data Flow Diagram (Level 0) - Context Diagram
      </text>

      {/* Central Process - LeadCatch System */}
      <circle cx="400" cy="250" r="80" fill={processFill} stroke={strokeColor} strokeWidth="3" />
      <text x="400" y="240" textAnchor="middle" className="text-sm font-bold" fill={textColor}>0</text>
      <text x="400" y="260" textAnchor="middle" className="text-sm font-bold" fill={textColor}>LeadCatch</text>
      <text x="400" y="280" textAnchor="middle" className="text-sm font-bold" fill={textColor}>System</text>

      {/* External Entity: User */}
      <rect x="50" y="120" width="120" height="60" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="110" y="155" textAnchor="middle" className="text-sm font-bold" fill={textColor}>User</text>

      {/* External Entity: Admin */}
      <rect x="50" y="320" width="120" height="60" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="110" y="355" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Admin</text>

      {/* External Entity: External APIs */}
      <rect x="630" y="120" width="120" height="60" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="690" y="150" textAnchor="middle" className="text-xs font-bold" fill={textColor}>External</text>
      <text x="690" y="168" textAnchor="middle" className="text-xs font-bold" fill={textColor}>APIs</text>

      {/* External Entity: Database */}
      <rect x="630" y="320" width="120" height="60" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="690" y="355" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Database</text>

      {/* Data Flows */}
      {/* User -> System */}
      <line x1="170" y1="140" x2="325" y2="210" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd0-arrow)" />
      <text x="220" y="160" className="text-xs" fill={subTextColor}>Lead URL</text>
      <text x="220" y="175" className="text-xs" fill={subTextColor}>Manual Entry</text>

      {/* System -> User */}
      <line x1="325" y1="280" x2="170" y2="340" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd0-arrow)" />
      <text x="220" y="325" className="text-xs" fill={subTextColor}>Lead List</text>

      {/* Admin -> System */}
      <line x1="170" y1="350" x2="325" y2="280" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd0-arrow)" />
      <text x="220" y="340" className="text-xs" fill={subTextColor}>Config</text>

      {/* System -> Admin */}
      <line x1="325" y1="290" x2="170" y2="360" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd0-arrow)" />
      <text x="220" y="360" className="text-xs" fill={subTextColor}>Reports</text>

      {/* System <-> External APIs */}
      <line x1="475" y1="210" x2="630" y2="150" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd0-arrow)" />
      <text x="570" y="160" className="text-xs" fill={subTextColor}>Enrich Request</text>
      <line x1="630" y1="170" x2="475" y2="230" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd0-arrow)" />
      <text x="570" y="220" className="text-xs" fill={subTextColor}>Enriched Data</text>

      {/* System <-> Database */}
      <line x1="475" y1="280" x2="630" y2="340" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd0-arrow)" />
      <text x="570" y="295" className="text-xs" fill={subTextColor}>Store/Update</text>
      <line x1="630" y1="360" x2="475" y2="290" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd0-arrow)" />
      <text x="570" y="355" className="text-xs" fill={subTextColor}>Lead Data</text>
    </svg>
  );
};

// ============ DFD LEVEL 1 - Main Processes ============
export const DFDLevel1: React.FC<DiagramProps> = ({ isDarkMode = false }) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
  const subTextColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const strokeColor = isDarkMode ? "#9ca3af" : "#374151";
  const boxFill = isDarkMode ? "#374151" : "white";
  
  return (
    <svg viewBox="0 0 900 650" className="w-full h-full">
      <defs>
        <marker id="dfd-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
        </marker>
      </defs>

      {/* Title */}
      <text x="450" y="30" textAnchor="middle" className="text-xl font-bold" fill={textColor}>
        Data Flow Diagram (Level 1) - LeadCatch System
      </text>

      {/* External Entity: User (top left) */}
      <rect x="30" y="100" width="100" height="50" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="80" y="130" textAnchor="middle" className="text-sm font-bold" fill={textColor}>User</text>

      {/* External Entity: External APIs (top right) */}
      <rect x="770" y="100" width="100" height="50" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="820" y="125" textAnchor="middle" className="text-xs font-bold" fill={textColor}>External</text>
      <text x="820" y="140" textAnchor="middle" className="text-xs font-bold" fill={textColor}>APIs</text>

      {/* External Entity: Admin (bottom) */}
      <rect x="30" y="500" width="100" height="50" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="80" y="530" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Admin</text>

      {/* Process 1.0: Capture Lead */}
      <rect x="200" y="80" width="130" height="70" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="200" y1="105" x2="330" y2="105" stroke={strokeColor} strokeWidth="1.5" />
      <text x="265" y="98" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>1.0</text>
      <text x="265" y="125" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Capture</text>
      <text x="265" y="142" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Lead</text>

      {/* Process 2.0: Enrich Lead */}
      <rect x="430" y="80" width="130" height="70" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="430" y1="105" x2="560" y2="105" stroke={strokeColor} strokeWidth="1.5" />
      <text x="495" y="98" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>2.0</text>
      <text x="495" y="125" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Enrich</text>
      <text x="495" y="142" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Lead</text>

      {/* Process 3.0: Score Lead */}
      <rect x="630" y="180" width="130" height="70" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="630" y1="205" x2="760" y2="205" stroke={strokeColor} strokeWidth="1.5" />
      <text x="695" y="198" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>3.0</text>
      <text x="695" y="225" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Score</text>
      <text x="695" y="242" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Lead</text>

      {/* Process 4.0: Manage Lead */}
      <rect x="300" y="280" width="130" height="70" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="300" y1="305" x2="430" y2="305" stroke={strokeColor} strokeWidth="1.5" />
      <text x="365" y="298" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>4.0</text>
      <text x="365" y="325" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Manage</text>
      <text x="365" y="342" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Lead</text>

      {/* Process 5.0: Generate Reports */}
      <rect x="200" y="460" width="130" height="70" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="200" y1="485" x2="330" y2="485" stroke={strokeColor} strokeWidth="1.5" />
      <text x="265" y="478" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>5.0</text>
      <text x="265" y="505" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Generate</text>
      <text x="265" y="522" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Reports</text>

      {/* Data Store D1: Lead Database */}
      <g>
        <path d="M 500 280 L 500 340 L 680 340 L 680 280" fill="none" stroke={strokeColor} strokeWidth="2" />
        <line x1="500" y1="280" x2="680" y2="280" stroke={strokeColor} strokeWidth="2" />
        <line x1="530" y1="280" x2="530" y2="340" stroke={strokeColor} strokeWidth="2" />
        <text x="515" y="315" textAnchor="middle" className="text-xs font-bold" fill={subTextColor}>D1</text>
        <text x="605" y="315" textAnchor="middle" className="text-sm font-semibold" fill={textColor}>Lead Database</text>
      </g>

      {/* Data Store D2: Activity Log */}
      <g>
        <path d="M 500 400 L 500 460 L 680 460 L 680 400" fill="none" stroke={strokeColor} strokeWidth="2" />
        <line x1="500" y1="400" x2="680" y2="400" stroke={strokeColor} strokeWidth="2" />
        <line x1="530" y1="400" x2="530" y2="460" stroke={strokeColor} strokeWidth="2" />
        <text x="515" y="435" textAnchor="middle" className="text-xs font-bold" fill={subTextColor}>D2</text>
        <text x="605" y="435" textAnchor="middle" className="text-sm font-semibold" fill={textColor}>Activity Log</text>
      </g>

      {/* Data Flows */}
      {/* User -> 1.0 Lead URL */}
      <line x1="130" y1="115" x2="200" y2="115" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="165" y="105" textAnchor="middle" className="text-xs" fill={subTextColor}>Lead URL</text>

      {/* 1.0 -> 2.0 Lead Data */}
      <line x1="330" y1="115" x2="430" y2="115" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="380" y="105" textAnchor="middle" className="text-xs" fill={subTextColor}>Lead Data</text>

      {/* 2.0 -> 3.0 Enriched Data */}
      <line x1="560" y1="130" x2="630" y2="200" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="610" y="155" textAnchor="middle" className="text-xs" fill={subTextColor}>Enriched</text>

      {/* 2.0 <-> External APIs */}
      <line x1="560" y1="100" x2="770" y2="100" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="665" y="90" textAnchor="middle" className="text-xs" fill={subTextColor}>Enrich Request</text>
      <line x1="770" y1="140" x2="560" y2="140" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="665" y="158" textAnchor="middle" className="text-xs" fill={subTextColor}>API Response</text>
      
      {/* 3.0 <-> External APIs (Score uses AI) */}
      <line x1="760" y1="200" x2="820" y2="150" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="805" y="180" textAnchor="middle" className="text-xs" fill={subTextColor}>AI</text>

      {/* 1.0 -> D1 Store Lead */}
      <line x1="265" y1="150" x2="265" y2="230" stroke={strokeColor} strokeWidth="1.5" />
      <line x1="265" y1="230" x2="500" y2="310" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="350" y="220" textAnchor="middle" className="text-xs" fill={subTextColor}>Store Lead</text>

      {/* 3.0 -> D1 Update Score */}
      <line x1="695" y1="250" x2="695" y2="265" stroke={strokeColor} strokeWidth="1.5" />
      <line x1="695" y1="265" x2="650" y2="280" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="710" y="262" textAnchor="middle" className="text-xs" fill={subTextColor}>Score</text>

      {/* D1 -> 4.0 Read Lead */}
      <line x1="500" y1="310" x2="430" y2="310" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="465" y="300" textAnchor="middle" className="text-xs" fill={subTextColor}>Read Lead</text>

      {/* 4.0 -> D2 Log Activity */}
      <line x1="365" y1="350" x2="365" y2="430" stroke={strokeColor} strokeWidth="1.5" />
      <line x1="365" y1="430" x2="500" y2="430" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="420" y="420" textAnchor="middle" className="text-xs" fill={subTextColor}>Log Activity</text>

      {/* 4.0 -> User Lead List */}
      <line x1="300" y1="315" x2="80" y2="150" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="170" y="220" textAnchor="middle" className="text-xs" fill={subTextColor}>Lead List</text>

      {/* D1 -> 5.0 Report Data */}
      <line x1="550" y1="340" x2="550" y2="380" stroke={strokeColor} strokeWidth="1.5" />
      <line x1="550" y1="380" x2="330" y2="495" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="470" y="400" textAnchor="middle" className="text-xs" fill={subTextColor}>Report Data</text>

      {/* 5.0 -> Admin Reports */}
      <line x1="200" y1="495" x2="130" y2="495" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="165" y="485" textAnchor="middle" className="text-xs" fill={subTextColor}>Reports</text>

      {/* Admin -> 5.0 Config */}
      <line x1="130" y1="525" x2="200" y2="525" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd-arrow)" />
      <text x="165" y="545" textAnchor="middle" className="text-xs" fill={subTextColor}>Config</text>
    </svg>
  );
};

// ============ DFD LEVEL 2 - Detailed Subprocesses ============
export const DFDLevel2: React.FC<DiagramProps> = ({ isDarkMode = false }) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
  const subTextColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const strokeColor = isDarkMode ? "#9ca3af" : "#374151";
  const boxFill = isDarkMode ? "#374151" : "white";
  const highlightFill = isDarkMode ? "#1e3a5f" : "#dbeafe";
  
  return (
    <svg viewBox="0 0 900 600" className="w-full h-full">
      <defs>
        <marker id="dfd2-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
        </marker>
      </defs>

      {/* Title */}
      <text x="450" y="30" textAnchor="middle" className="text-xl font-bold" fill={textColor}>
        Data Flow Diagram (Level 2) - Capture Lead Decomposition
      </text>
      <text x="450" y="55" textAnchor="middle" className="text-sm" fill={subTextColor}>
        Detailed breakdown of Process 1.0
      </text>

      {/* Parent Process Boundary */}
      <rect x="120" y="80" width="660" height="450" fill={highlightFill} fillOpacity="0.3" stroke={strokeColor} strokeWidth="2" strokeDasharray="8,4" rx="15" />
      <text x="130" y="100" className="text-sm font-semibold" fill={subTextColor}>Process 1.0: Capture Lead</text>

      {/* External Entity: User (input) */}
      <rect x="20" y="180" width="80" height="50" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="60" y="210" textAnchor="middle" className="text-sm font-bold" fill={textColor}>User</text>

      {/* Process 1.1: Validate URL */}
      <rect x="150" y="150" width="120" height="60" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="150" y1="175" x2="270" y2="175" stroke={strokeColor} strokeWidth="1.5" />
      <text x="210" y="168" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>1.1</text>
      <text x="210" y="195" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Validate URL</text>

      {/* Process 1.2: Extract Domain */}
      <rect x="150" y="260" width="120" height="60" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="150" y1="285" x2="270" y2="285" stroke={strokeColor} strokeWidth="1.5" />
      <text x="210" y="278" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>1.2</text>
      <text x="210" y="298" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Extract</text>
      <text x="210" y="312" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Domain</text>

      {/* Process 1.3: Scrape Website */}
      <rect x="340" y="150" width="120" height="60" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="340" y1="175" x2="460" y2="175" stroke={strokeColor} strokeWidth="1.5" />
      <text x="400" y="168" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>1.3</text>
      <text x="400" y="195" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Scrape Website</text>

      {/* Process 1.4: Parse Contact Info */}
      <rect x="340" y="260" width="120" height="60" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="340" y1="285" x2="460" y2="285" stroke={strokeColor} strokeWidth="1.5" />
      <text x="400" y="278" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>1.4</text>
      <text x="400" y="298" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Parse Contact</text>
      <text x="400" y="312" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Info</text>

      {/* Process 1.5: Create Lead Record */}
      <rect x="530" y="200" width="120" height="60" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="530" y1="225" x2="650" y2="225" stroke={strokeColor} strokeWidth="1.5" />
      <text x="590" y="218" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>1.5</text>
      <text x="590" y="238" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Create Lead</text>
      <text x="590" y="252" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Record</text>

      {/* Process 1.6: Detect Duplicates */}
      <rect x="530" y="340" width="120" height="60" rx="10" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <line x1="530" y1="365" x2="650" y2="365" stroke={strokeColor} strokeWidth="1.5" />
      <text x="590" y="358" textAnchor="middle" className="text-xs font-semibold" fill={subTextColor}>1.6</text>
      <text x="590" y="378" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Detect</text>
      <text x="590" y="392" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Duplicates</text>

      {/* Data Store D1: Lead Database */}
      <g>
        <path d="M 700 280 L 700 340 L 860 340 L 860 280" fill="none" stroke={strokeColor} strokeWidth="2" />
        <line x1="700" y1="280" x2="860" y2="280" stroke={strokeColor} strokeWidth="2" />
        <line x1="730" y1="280" x2="730" y2="340" stroke={strokeColor} strokeWidth="2" />
        <text x="715" y="315" textAnchor="middle" className="text-xs font-bold" fill={subTextColor}>D1</text>
        <text x="795" y="315" textAnchor="middle" className="text-sm font-semibold" fill={textColor}>Lead Database</text>
      </g>

      {/* Temp Data Store: URL Cache */}
      <g>
        <path d="M 150 400 L 150 450 L 300 450 L 300 400" fill="none" stroke={strokeColor} strokeWidth="2" />
        <line x1="150" y1="400" x2="300" y2="400" stroke={strokeColor} strokeWidth="2" />
        <line x1="175" y1="400" x2="175" y2="450" stroke={strokeColor} strokeWidth="2" />
        <text x="162" y="430" textAnchor="middle" className="text-xs font-bold" fill={subTextColor}>T1</text>
        <text x="238" y="430" textAnchor="middle" className="text-sm font-semibold" fill={textColor}>URL Cache</text>
      </g>

      {/* Output to Process 2.0 */}
      <rect x="700" y="180" width="100" height="50" fill={boxFill} stroke={strokeColor} strokeWidth="2" strokeDasharray="5,3" />
      <text x="750" y="200" textAnchor="middle" className="text-xs font-bold" fill={subTextColor}>To Process</text>
      <text x="750" y="220" textAnchor="middle" className="text-sm font-bold" fill={textColor}>2.0</text>

      {/* Data Flows */}
      {/* User -> 1.1 Lead URL */}
      <line x1="100" y1="205" x2="150" y2="180" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="115" y="175" className="text-xs" fill={subTextColor}>Lead URL</text>

      {/* 1.1 -> 1.2 Valid URL */}
      <line x1="210" y1="210" x2="210" y2="260" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="225" y="240" className="text-xs" fill={subTextColor}>Valid URL</text>

      {/* 1.1 -> 1.3 URL */}
      <line x1="270" y1="180" x2="340" y2="180" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="305" y="170" className="text-xs" fill={subTextColor}>URL</text>

      {/* 1.2 -> T1 Domain */}
      <line x1="210" y1="320" x2="210" y2="400" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="230" y="365" className="text-xs" fill={subTextColor}>Domain</text>

      {/* 1.3 -> 1.4 HTML Data */}
      <line x1="400" y1="210" x2="400" y2="260" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="420" y="240" className="text-xs" fill={subTextColor}>HTML</text>

      {/* 1.4 -> 1.5 Contact Info */}
      <line x1="460" y1="285" x2="530" y2="235" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="495" y="245" className="text-xs" fill={subTextColor}>Contact Info</text>

      {/* 1.5 -> 1.6 Lead Record */}
      <line x1="590" y1="260" x2="590" y2="340" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="615" y="305" className="text-xs" fill={subTextColor}>Lead</text>

      {/* 1.6 -> D1 Check Duplicates */}
      <line x1="650" y1="370" x2="700" y2="320" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="690" y="360" className="text-xs" fill={subTextColor}>Check</text>

      {/* D1 -> 1.6 Existing Leads */}
      <line x1="700" y1="330" x2="650" y2="380" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="700" y="380" className="text-xs" fill={subTextColor}>Existing</text>

      {/* 1.5 -> D1 Store Lead */}
      <line x1="650" y1="230" x2="700" y2="290" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="680" y="245" className="text-xs" fill={subTextColor}>Store</text>

      {/* 1.5 -> 2.0 Lead Data */}
      <line x1="650" y1="220" x2="700" y2="205" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="670" y="198" className="text-xs" fill={subTextColor}>Lead Data</text>

      {/* T1 -> 1.6 Cached URLs */}
      <line x1="300" y1="425" x2="530" y2="380" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#dfd2-arrow)" />
      <text x="400" y="415" className="text-xs" fill={subTextColor}>Cached URLs</text>
    </svg>
  );
};

// ============ DFD WRAPPER WITH LEVEL SELECTOR ============
interface DFDProps extends DiagramProps {
  level?: 0 | 1 | 2;
  onLevelChange?: (level: 0 | 1 | 2) => void;
  showLevelSelector?: boolean;
}

export const DFDDiagram: React.FC<DFDProps> = ({ 
  isDarkMode = false, 
  level = 1, 
  onLevelChange,
  showLevelSelector = true 
}) => {
  const [currentLevel, setCurrentLevel] = React.useState<0 | 1 | 2>(level);

  React.useEffect(() => {
    setCurrentLevel(level);
  }, [level]);

  const handleLevelChange = (newLevel: 0 | 1 | 2) => {
    setCurrentLevel(newLevel);
    onLevelChange?.(newLevel);
  };

  return (
    <div className="w-full">
      {showLevelSelector && (
        <div className={`flex items-center justify-center gap-3 p-4 mb-4 rounded-xl ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}>
          <span className={`text-sm font-semibold ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>Select DFD Level:</span>
          <div className="flex gap-2">
            {([0, 1, 2] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                  currentLevel === lvl
                    ? isDarkMode
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                      : "bg-blue-600 text-white border-blue-600 shadow-lg"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-gray-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <span className="block font-bold">Level {lvl}</span>
                <span className={`block text-xs mt-0.5 ${
                  currentLevel === lvl 
                    ? "text-blue-100" 
                    : isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  {lvl === 0 ? "Context" : lvl === 1 ? "Main Processes" : "Detailed"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="w-full">
        {currentLevel === 0 && <DFDLevel0 isDarkMode={isDarkMode} />}
        {currentLevel === 1 && <DFDLevel1 isDarkMode={isDarkMode} />}
        {currentLevel === 2 && <DFDLevel2 isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
};

// ============ USE CASE DIAGRAM ============
export const UseCaseDiagram: React.FC<DiagramProps> = ({ isDarkMode = false }) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
  const subTextColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const strokeColor = isDarkMode ? "#9ca3af" : "#374151";
  const boxFill = isDarkMode ? "#374151" : "white";
  const boundaryFill = isDarkMode ? "#1f2937" : "#f8fafc";
  const boundaryStroke = isDarkMode ? "#60a5fa" : "#3b82f6";
  
  return (
    <svg viewBox="0 0 800 650" className="w-full h-full">
      {/* Title */}
      <text x="400" y="30" textAnchor="middle" className="text-xl font-bold" fill={textColor}>
        Use Case Diagram - LeadCatch System
      </text>

      {/* System Boundary */}
      <rect x="180" y="60" width="450" height="550" fill={boundaryFill} stroke={boundaryStroke} strokeWidth="2" strokeDasharray="10,5" rx="15" />
      <text x="405" y="85" textAnchor="middle" className="text-sm font-semibold" fill={boundaryStroke}>LeadCatch System</text>

      {/* Actor: User (stick figure) */}
      <g>
        <circle cx="80" cy="175" r="15" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <line x1="80" y1="190" x2="80" y2="240" stroke={strokeColor} strokeWidth="2" />
        <line x1="55" y1="210" x2="105" y2="210" stroke={strokeColor} strokeWidth="2" />
        <line x1="80" y1="240" x2="55" y2="280" stroke={strokeColor} strokeWidth="2" />
        <line x1="80" y1="240" x2="105" y2="280" stroke={strokeColor} strokeWidth="2" />
        <text x="80" y="305" textAnchor="middle" className="text-sm font-semibold" fill={textColor}>User</text>
      </g>

      {/* Actor: Admin */}
      <g>
        <circle cx="80" cy="425" r="15" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <line x1="80" y1="440" x2="80" y2="490" stroke={strokeColor} strokeWidth="2" />
        <line x1="55" y1="460" x2="105" y2="460" stroke={strokeColor} strokeWidth="2" />
        <line x1="80" y1="490" x2="55" y2="530" stroke={strokeColor} strokeWidth="2" />
        <line x1="80" y1="490" x2="105" y2="530" stroke={strokeColor} strokeWidth="2" />
        <text x="80" y="555" textAnchor="middle" className="text-sm font-semibold" fill={textColor}>Admin</text>
      </g>

      {/* Actor: System */}
      <g>
        <circle cx="720" cy="300" r="15" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <line x1="720" y1="315" x2="720" y2="365" stroke={strokeColor} strokeWidth="2" />
        <line x1="695" y1="335" x2="745" y2="335" stroke={strokeColor} strokeWidth="2" />
        <line x1="720" y1="365" x2="695" y2="405" stroke={strokeColor} strokeWidth="2" />
        <line x1="720" y1="365" x2="745" y2="405" stroke={strokeColor} strokeWidth="2" />
        <text x="720" y="430" textAnchor="middle" className="text-sm font-semibold" fill={textColor}>System</text>
      </g>

      {/* Use Cases */}
      {/* Parse Lead from URL */}
      <ellipse cx="300" cy="130" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="300" y="135" textAnchor="middle" className="text-xs" fill={textColor}>Parse Lead from URL</text>

      {/* Manual Lead Entry */}
      <ellipse cx="300" cy="200" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="300" y="205" textAnchor="middle" className="text-xs" fill={textColor}>Manual Lead Entry</text>

      {/* View Lead List */}
      <ellipse cx="300" cy="270" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="300" y="275" textAnchor="middle" className="text-xs" fill={textColor}>View Lead List</text>

      {/* Export Leads */}
      <ellipse cx="300" cy="340" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="300" y="345" textAnchor="middle" className="text-xs" fill={textColor}>Export Leads</text>

      {/* Enrich Lead */}
      <ellipse cx="500" cy="200" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="500" y="205" textAnchor="middle" className="text-xs" fill={textColor}>Enrich Lead</text>

      {/* Score Lead */}
      <ellipse cx="500" cy="270" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="500" y="275" textAnchor="middle" className="text-xs" fill={textColor}>Score Lead</text>

      {/* Manage Settings */}
      <ellipse cx="300" cy="460" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="300" y="465" textAnchor="middle" className="text-xs" fill={textColor}>Manage Settings</text>

      {/* Generate Reports */}
      <ellipse cx="300" cy="530" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="300" y="535" textAnchor="middle" className="text-xs" fill={textColor}>Generate Reports</text>

      {/* Call External APIs */}
      <ellipse cx="500" cy="340" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="500" y="345" textAnchor="middle" className="text-xs" fill={textColor}>Call External APIs</text>

      {/* AI Analysis */}
      <ellipse cx="500" cy="410" rx="90" ry="30" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
      <text x="500" y="415" textAnchor="middle" className="text-xs" fill={textColor}>AI Analysis</text>

      {/* Connections from User */}
      <line x1="105" y1="200" x2="210" y2="135" stroke={strokeColor} strokeWidth="1" />
      <line x1="105" y1="210" x2="210" y2="200" stroke={strokeColor} strokeWidth="1" />
      <line x1="105" y1="220" x2="210" y2="270" stroke={strokeColor} strokeWidth="1" />
      <line x1="105" y1="230" x2="210" y2="340" stroke={strokeColor} strokeWidth="1" />
      <line x1="105" y1="210" x2="410" y2="200" stroke={strokeColor} strokeWidth="1" />

      {/* Connections from Admin */}
      <line x1="105" y1="460" x2="210" y2="460" stroke={strokeColor} strokeWidth="1" />
      <line x1="105" y1="480" x2="210" y2="530" stroke={strokeColor} strokeWidth="1" />

      {/* Connections from System */}
      <line x1="695" y1="330" x2="590" y2="340" stroke={strokeColor} strokeWidth="1" />
      <line x1="695" y1="350" x2="590" y2="410" stroke={strokeColor} strokeWidth="1" />

      {/* Include relationships - Using curved paths to avoid overlap */}
      {/* Enrich Lead includes Score Lead - curves right */}
      <path 
        d="M 530 225 Q 600 250 530 275" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeDasharray="5,3" 
        markerEnd="url(#arrowhead)"
      />
      <text x="610" y="255" className="text-xs italic" fill={subTextColor}>«include»</text>

      {/* Score Lead includes Call External APIs - curves left */}
      <path 
        d="M 470 295 Q 400 320 470 345" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeDasharray="5,3" 
        markerEnd="url(#arrowhead)"
      />
      <text x="360" y="325" className="text-xs italic" fill={subTextColor}>«include»</text>

      {/* Call External APIs includes AI Analysis - curves right */}
      <path 
        d="M 530 365 Q 600 385 530 415" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeDasharray="5,3" 
        markerEnd="url(#arrowhead)"
      />
      <text x="610" y="395" className="text-xs italic" fill={subTextColor}>«include»</text>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
        </marker>
      </defs>
    </svg>
  );
};

// ============ CLASS DIAGRAM - Like the Person/Student/Professor Example ============
export const ClassDiagram: React.FC<DiagramProps> = ({ isDarkMode = false }) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
  const subTextColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const strokeColor = isDarkMode ? "#9ca3af" : "#374151";
  const boxFill = isDarkMode ? "#374151" : "white";
  const headerFill = isDarkMode ? "#4b5563" : "#f3f4f6";
  const interfaceFill = isDarkMode ? "#713f12" : "#fef3c7";
  const enumFill = isDarkMode ? "#1e3a5f" : "#e0e7ff";
  
  return (
    <svg viewBox="0 0 800 700" className="w-full h-full" style={{ minHeight: '600px' }}>
      {/* Title */}
      <text x="400" y="30" textAnchor="middle" className="text-xl font-bold" fill={textColor}>
        Class Diagram - LeadCatch System
      </text>

      {/* LeadService Class */}
      <g>
        <rect x="50" y="60" width="220" height="30" fill={headerFill} stroke={strokeColor} strokeWidth="2" />
        <text x="160" y="80" textAnchor="middle" className="text-sm font-bold" fill={textColor}>LeadService</text>
        <rect x="50" y="90" width="220" height="50" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="60" y="110" className="text-xs" fill={subTextColor}>- leads: Lead[]</text>
        <text x="60" y="128" className="text-xs" fill={subTextColor}>- enrichmentProvider: EnrichmentProvider</text>
        <rect x="50" y="140" width="220" height="85" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="60" y="158" className="text-xs" fill={subTextColor}>+ parseLead(url: string): Lead</text>
        <text x="60" y="176" className="text-xs" fill={subTextColor}>+ enrichLead(id: string): Lead</text>
        <text x="60" y="194" className="text-xs" fill={subTextColor}>+ scoreLead(id: string): number</text>
        <text x="60" y="212" className="text-xs" fill={subTextColor}>+ getLeads(): Lead[]</text>
      </g>

      {/* Lead Class */}
      <g>
        <rect x="350" y="60" width="200" height="30" fill={headerFill} stroke={strokeColor} strokeWidth="2" />
        <text x="450" y="80" textAnchor="middle" className="text-sm font-bold" fill={textColor}>Lead</text>
        <rect x="350" y="90" width="200" height="115" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="360" y="108" className="text-xs" fill={subTextColor}>- id: string</text>
        <text x="360" y="124" className="text-xs" fill={subTextColor}>- firstName: string</text>
        <text x="360" y="140" className="text-xs" fill={subTextColor}>- lastName: string</text>
        <text x="360" y="156" className="text-xs" fill={subTextColor}>- email: string</text>
        <text x="360" y="172" className="text-xs" fill={subTextColor}>- score: number</text>
        <text x="360" y="188" className="text-xs" fill={subTextColor}>- status: LeadStatus</text>
        <rect x="350" y="205" width="200" height="70" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="360" y="223" className="text-xs" fill={subTextColor}>+ getFullName(): string</text>
        <text x="360" y="241" className="text-xs" fill={subTextColor}>+ updateScore(score: number): void</text>
        <text x="360" y="259" className="text-xs" fill={subTextColor}>+ enrich(data: object): void</text>
      </g>

      {/* LeadStatus Enumeration */}
      <g>
        <rect x="600" y="60" width="170" height="30" fill={enumFill} stroke={strokeColor} strokeWidth="2" />
        <text x="685" y="75" textAnchor="middle" className="text-xs italic" fill={subTextColor}>«enumeration»</text>
        <rect x="600" y="90" width="170" height="25" fill={enumFill} stroke={strokeColor} strokeWidth="2" />
        <text x="685" y="108" textAnchor="middle" className="text-sm font-bold" fill={textColor}>LeadStatus</text>
        <rect x="600" y="115" width="170" height="100" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="610" y="135" className="text-xs" fill={subTextColor}>NEW</text>
        <text x="610" y="153" className="text-xs" fill={subTextColor}>CONTACTED</text>
        <text x="610" y="171" className="text-xs" fill={subTextColor}>QUALIFIED</text>
        <text x="610" y="189" className="text-xs" fill={subTextColor}>CONVERTED</text>
        <text x="610" y="207" className="text-xs" fill={subTextColor}>LOST</text>
      </g>

      {/* EnrichmentProvider Interface */}
      <g>
        <rect x="100" y="320" width="220" height="30" fill={interfaceFill} stroke={strokeColor} strokeWidth="2" />
        <text x="210" y="335" textAnchor="middle" className="text-xs italic" fill={subTextColor}>«interface»</text>
        <rect x="100" y="350" width="220" height="25" fill={interfaceFill} stroke={strokeColor} strokeWidth="2" />
        <text x="210" y="368" textAnchor="middle" className="text-sm font-bold" fill={textColor}>EnrichmentProvider</text>
        <rect x="100" y="375" width="220" height="20" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <rect x="100" y="395" width="220" height="55" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="110" y="418" className="text-xs" fill={subTextColor}>+ enrich(lead: Lead): EnrichmentData</text>
        <text x="110" y="438" className="text-xs" fill={subTextColor}>+ getProviderName(): string</text>
      </g>

      {/* ApolloProvider Class */}
      <g>
        <rect x="30" y="540" width="180" height="30" fill={headerFill} stroke={strokeColor} strokeWidth="2" />
        <text x="120" y="560" textAnchor="middle" className="text-sm font-bold" fill={textColor}>ApolloProvider</text>
        <rect x="30" y="570" width="180" height="35" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="40" y="592" className="text-xs" fill={subTextColor}>- apiKey: string</text>
        <rect x="30" y="605" width="180" height="55" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="40" y="625" className="text-xs" fill={subTextColor}>+ enrich(lead): EnrichmentData</text>
        <text x="40" y="645" className="text-xs" fill={subTextColor}>+ getProviderName(): string</text>
      </g>

      {/* ClearbitProvider Class */}
      <g>
        <rect x="240" y="540" width="180" height="30" fill={headerFill} stroke={strokeColor} strokeWidth="2" />
        <text x="330" y="560" textAnchor="middle" className="text-sm font-bold" fill={textColor}>ClearbitProvider</text>
        <rect x="240" y="570" width="180" height="35" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="250" y="592" className="text-xs" fill={subTextColor}>- apiKey: string</text>
        <rect x="240" y="605" width="180" height="55" fill={boxFill} stroke={strokeColor} strokeWidth="2" />
        <text x="250" y="625" className="text-xs" fill={subTextColor}>+ enrich(lead): EnrichmentData</text>
        <text x="250" y="645" className="text-xs" fill={subTextColor}>+ getProviderName(): string</text>
      </g>

      {/* Relationships with Cardinality */}
      
      {/* LeadService ---> Lead (composition: 1 to 0..*) */}
      <line x1="270" y1="150" x2="350" y2="150" stroke={strokeColor} strokeWidth="1.5" />
      {/* Filled diamond for composition */}
      <polygon points="270,150 260,145 250,150 260,155" fill={strokeColor} stroke={strokeColor} strokeWidth="1" />
      {/* Cardinality labels */}
      <text x="275" y="140" className="text-xs font-semibold" fill={textColor}>1</text>
      <text x="335" y="140" className="text-xs font-semibold" fill={textColor}>0..*</text>

      {/* LeadService ---> EnrichmentProvider (aggregation: 1 to 1) */}
      <line x1="160" y1="225" x2="160" y2="320" stroke={strokeColor} strokeWidth="1.5" />
      {/* Hollow diamond for aggregation */}
      <polygon points="160,225 155,235 160,245 165,235" fill={isDarkMode ? "#1f2937" : "white"} stroke={strokeColor} strokeWidth="1.5" />
      {/* Cardinality labels */}
      <text x="170" y="240" className="text-xs font-semibold" fill={textColor}>1</text>
      <text x="170" y="310" className="text-xs font-semibold" fill={textColor}>1</text>

      {/* Lead ---> LeadStatus (association: 1 to 1) */}
      <line x1="550" y1="150" x2="600" y2="150" stroke={strokeColor} strokeWidth="1.5" />
      <text x="555" y="140" className="text-xs font-semibold" fill={textColor}>1</text>
      <text x="590" y="140" className="text-xs font-semibold" fill={textColor}>1</text>

      {/* Inheritance arrows (hollow triangle) - ApolloProvider implements EnrichmentProvider */}
      <line x1="120" y1="540" x2="180" y2="450" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="5,3" />
      <polygon points="180,450 170,465 190,465" fill={isDarkMode ? "#1f2937" : "white"} stroke={strokeColor} strokeWidth="1.5" />

      {/* ClearbitProvider implements EnrichmentProvider */}
      <line x1="330" y1="540" x2="240" y2="450" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="5,3" />
      <polygon points="240,450 230,465 250,465" fill={isDarkMode ? "#1f2937" : "white"} stroke={strokeColor} strokeWidth="1.5" />

      {/* Cardinality Legend */}
      <g transform="translate(550, 480)">
        <rect x="0" y="0" width="220" height="180" fill={boxFill} stroke={strokeColor} strokeWidth="1" rx="5" />
        <text x="110" y="20" textAnchor="middle" className="text-xs font-bold" fill={textColor}>Cardinality Notation</text>
        <line x1="10" y1="30" x2="210" y2="30" stroke={strokeColor} strokeWidth="0.5" />
        
        {/* 0..1 */}
        <line x1="20" y1="50" x2="70" y2="50" stroke={strokeColor} strokeWidth="1.5" />
        <rect x="70" y="42" width="25" height="16" fill={boxFill} stroke={strokeColor} strokeWidth="1" />
        <text x="82" y="54" textAnchor="middle" className="text-xs" fill={textColor}>0..1</text>
        <text x="110" y="54" className="text-xs" fill={subTextColor}>Zero or one</text>
        
        {/* 1 */}
        <line x1="20" y1="75" x2="70" y2="75" stroke={strokeColor} strokeWidth="1.5" />
        <rect x="70" y="67" width="25" height="16" fill={boxFill} stroke={strokeColor} strokeWidth="1" />
        <text x="82" y="79" textAnchor="middle" className="text-xs" fill={textColor}>1</text>
        <text x="110" y="79" className="text-xs" fill={subTextColor}>One and only one</text>
        
        {/* 0..* */}
        <line x1="20" y1="100" x2="70" y2="100" stroke={strokeColor} strokeWidth="1.5" />
        <rect x="70" y="92" width="25" height="16" fill={boxFill} stroke={strokeColor} strokeWidth="1" />
        <text x="82" y="104" textAnchor="middle" className="text-xs" fill={textColor}>0..*</text>
        <text x="110" y="104" className="text-xs" fill={subTextColor}>Zero or more</text>
        
        {/* 1..* */}
        <line x1="20" y1="125" x2="70" y2="125" stroke={strokeColor} strokeWidth="1.5" />
        <rect x="70" y="117" width="25" height="16" fill={boxFill} stroke={strokeColor} strokeWidth="1" />
        <text x="82" y="129" textAnchor="middle" className="text-xs" fill={textColor}>1..*</text>
        <text x="110" y="129" className="text-xs" fill={subTextColor}>One or more</text>
        
        {/* n..m */}
        <line x1="20" y1="150" x2="70" y2="150" stroke={strokeColor} strokeWidth="1.5" />
        <rect x="70" y="142" width="25" height="16" fill={boxFill} stroke={strokeColor} strokeWidth="1" />
        <text x="82" y="154" textAnchor="middle" className="text-xs" fill={textColor}>n..m</text>
        <text x="110" y="154" className="text-xs" fill={subTextColor}>Range specified</text>
      </g>
    </svg>
  );
};

export type DiagramType = "erd" | "usecase" | "sequence" | "dfd" | "class";
export type DFDLevelType = 0 | 1 | 2;

export const DiagramComponents: Record<DiagramType, React.FC<DiagramProps>> = {
  erd: ERDDiagram,
  usecase: UseCaseDiagram,
  sequence: SequenceDiagram,
  dfd: DFDDiagram,
  class: ClassDiagram,
};
