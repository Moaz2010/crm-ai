"use client";

import React from "react";

// Common styles for dark mode support
const styles = {
  text: "fill-gray-900 dark:fill-gray-100",
  textSecondary: "fill-gray-600 dark:fill-gray-400",
  stroke: "stroke-gray-700 dark:stroke-gray-300",
  strokeDashed: "stroke-gray-500 dark:stroke-gray-500",
  fill: "fill-white dark:fill-gray-800",
  fillAccent: "fill-blue-50 dark:fill-blue-900/20",
  strokeAccent: "stroke-blue-600 dark:stroke-blue-400",
  marker: "fill-gray-700 dark:fill-gray-300",
  markerDashed: "fill-gray-500 dark:fill-gray-500",
};

// ============ SEQUENCE DIAGRAM ============
export const SequenceDiagram = () => {
  const participants = [
    { name: "User", x: 80 },
    { name: "Frontend", x: 230 },
    { name: "API Server", x: 380 },
    { name: "LeadService", x: 530 },
    { name: "Database", x: 680 },
  ];

  // Increased spacing to prevent overlap
  const startY = 100;
  const step = 40;
  
  const messages = [
    { from: 0, to: 1, label: "1: Enter Lead URL", y: startY, activate: 1 },
    { from: 1, to: 2, label: "2: POST /api/leads/parse", y: startY + step, activate: 2 },
    { from: 2, to: 3, label: "3: parseLead(url)", y: startY + step * 2, activate: 3 },
    { from: 3, to: 4, label: "4: Check duplicate", y: startY + step * 3, activate: 4 },
    { from: 4, to: 3, label: "5: No duplicate", y: startY + step * 4, dashed: true, deactivate: 4 },
    { from: 3, to: 2, label: "6: Parsed data", y: startY + step * 5, dashed: true, deactivate: 3 },
    { from: 2, to: 4, label: "7: INSERT lead", y: startY + step * 6, activate: 4 },
    { from: 4, to: 2, label: "8: Lead created", y: startY + step * 7, dashed: true, deactivate: 4 },
    { from: 2, to: 1, label: "9: Success response", y: startY + step * 8, dashed: true, deactivate: 2 },
    { from: 1, to: 0, label: "10: Show new lead", y: startY + step * 9, dashed: true, deactivate: 1 },
    // Enrichment flow
    { from: 0, to: 1, label: "11: Click Enrich", y: startY + step * 11, activate: 1 },
    { from: 1, to: 2, label: "12: POST /api/leads/enrich", y: startY + step * 12, activate: 2 },
    { from: 2, to: 3, label: "13: enrichLead(id)", y: startY + step * 13, activate: 3 },
    { from: 3, to: 4, label: "14: Get lead data", y: startY + step * 14, activate: 4 },
    { from: 4, to: 3, label: "15: Lead data", y: startY + step * 15, dashed: true, deactivate: 4 },
    { from: 3, to: 3, label: "16: Call External APIs", y: startY + step * 16, self: true },
    { from: 3, to: 4, label: "17: UPDATE lead", y: startY + step * 17, activate: 4 },
    { from: 4, to: 3, label: "18: Updated", y: startY + step * 18, dashed: true, deactivate: 4 },
    { from: 3, to: 2, label: "19: Enriched lead", y: startY + step * 19, dashed: true, deactivate: 3 },
    { from: 2, to: 1, label: "20: Success response", y: startY + step * 20, dashed: true, deactivate: 2 },
    { from: 1, to: 0, label: "21: Show enriched data", y: startY + step * 21, dashed: true, deactivate: 1 },
  ];

  // Calculate activation boxes
  const activations: { participant: number; startY: number; endY: number }[] = [];
  const activeStarts: { [key: number]: number } = {};

  messages.forEach((msg) => {
    if (msg.activate !== undefined) {
      activeStarts[msg.activate] = msg.y - 10;
    }
    if (msg.deactivate !== undefined && activeStarts[msg.deactivate] !== undefined) {
      activations.push({
        participant: msg.deactivate,
        startY: activeStarts[msg.deactivate],
        endY: msg.y + 10,
      });
      delete activeStarts[msg.deactivate];
    }
  });

  return (
    <svg viewBox="0 0 780 1000" className="w-full h-full">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" className={styles.marker}>
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
        <marker id="arrowhead-dashed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" className={styles.markerDashed}>
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>

      <text x="390" y="25" textAnchor="middle" className={`text-lg font-bold ${styles.text}`}>
        Sequence Diagram - LeadCatch System
      </text>

      {/* Participants */}
      {participants.map((p, i) => (
        <g key={i}>
          <rect x={p.x - 50} y={40} width={100} height={35} className={`${styles.fill} ${styles.stroke}`} strokeWidth="2" />
          <text x={p.x} y={62} textAnchor="middle" className={`text-sm font-semibold ${styles.text}`}>
            {p.name}
          </text>
          <line x1={p.x} y1={75} x2={p.x} y2={980} className={styles.stroke} strokeWidth="1" strokeDasharray="5,5" />
        </g>
      ))}

      {/* Activations */}
      {activations.map((act, i) => (
        <rect
          key={i}
          x={participants[act.participant].x - 8}
          y={act.startY}
          width={16}
          height={act.endY - act.startY}
          className={`${styles.fill} ${styles.stroke}`}
          strokeWidth="1.5"
        />
      ))}

      {/* Messages */}
      {messages.map((msg, i) => {
        const fromX = participants[msg.from].x;
        const toX = participants[msg.to].x;
        const isLeftToRight = toX > fromX;

        if (msg.self) {
          return (
            <g key={i}>
              <path
                d={`M ${fromX + 8} ${msg.y} H ${fromX + 40} V ${msg.y + 25} H ${fromX + 8}`}
                fill="none"
                className={styles.stroke}
                strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
              />
              <text x={fromX + 45} y={msg.y + 10} className={`text-xs ${styles.text}`}>
                {msg.label}
              </text>
            </g>
          );
        }

        return (
          <g key={i}>
            <line
              x1={isLeftToRight ? fromX + 8 : fromX - 8}
              y1={msg.y}
              x2={isLeftToRight ? toX - 8 : toX + 8}
              y2={msg.y}
              className={msg.dashed ? styles.strokeDashed : styles.stroke}
              strokeWidth="1.5"
              strokeDasharray={msg.dashed ? "5,3" : "none"}
              markerEnd={msg.dashed ? "url(#arrowhead-dashed)" : "url(#arrowhead)"}
            />
            {/* Text background for readability */}
            <rect 
              x={(fromX + toX) / 2 - (msg.label.length * 3)} 
              y={msg.y - 14} 
              width={msg.label.length * 6} 
              height={14} 
              className={`${styles.fill} opacity-80`} 
            />
            <text
              x={(fromX + toX) / 2}
              y={msg.y - 5}
              textAnchor="middle"
              className={`text-xs ${styles.text}`}
            >
              {msg.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ============ DFD DIAGRAM (Level 1) ============
export const DFDDiagram = () => {
  // Level 1 DFD
  const processes = [
    { id: "1.0", name: "Capture Lead", x: 250, y: 150 },
    { id: "2.0", name: "Enrich Lead", x: 450, y: 150 },
    { id: "3.0", name: "Score Lead", x: 650, y: 150 },
    { id: "4.0", name: "Manage Lead", x: 450, y: 350 },
  ];

  const entities = [
    { name: "User", x: 80, y: 150 },
    { name: "Ext. APIs", x: 450, y: 50 },
    { name: "Admin", x: 450, y: 500 },
  ];

  const stores = [
    { id: "D1", name: "Leads DB", x: 250, y: 350 },
    { id: "D2", name: "Contacts DB", x: 650, y: 350 },
  ];

  const flows = [
    { from: { x: 130, y: 140 }, to: { x: 200, y: 140 }, label: "Lead URL" },
    { from: { x: 300, y: 140 }, to: { x: 400, y: 140 }, label: "Lead Data" },
    { from: { x: 500, y: 140 }, to: { x: 600, y: 140 }, label: "Enriched Data" },
    { from: { x: 450, y: 120 }, to: { x: 450, y: 80 }, label: "Query", reverse: true }, // To Ext APIs
    { from: { x: 250, y: 180 }, to: { x: 250, y: 320 }, label: "Store Lead" }, // To D1
    { from: { x: 300, y: 350 }, to: { x: 400, y: 350 }, label: "Read Lead" }, // D1 to 4.0
    { from: { x: 500, y: 350 }, to: { x: 600, y: 350 }, label: "Update Contacts" }, // 4.0 to D2
    { from: { x: 450, y: 380 }, to: { x: 450, y: 470 }, label: "Reports" }, // 4.0 to Admin
    { from: { x: 650, y: 180 }, to: { x: 650, y: 320 }, label: "Store Score" }, // 3.0 to D2 (actually D1 but simplifying)
  ];

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <defs>
        <marker id="dfd-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" className={styles.marker}>
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>

      <text x="400" y="30" textAnchor="middle" className={`text-lg font-bold ${styles.text}`}>
        Data Flow Diagram (Level 1) - LeadCatch System
      </text>

      {/* External Entities */}
      {entities.map((e, i) => (
        <g key={`ent-${i}`}>
          <rect x={e.x - 50} y={e.y - 25} width={100} height={50} className={`${styles.fill} ${styles.stroke}`} strokeWidth="2" />
          <text x={e.x} y={e.y + 5} textAnchor="middle" className={`text-sm font-bold ${styles.text}`}>
            {e.name}
          </text>
        </g>
      ))}

      {/* Processes (Rounded Rects with ID line) */}
      {processes.map((p, i) => (
        <g key={`proc-${i}`}>
          <rect x={p.x - 50} y={p.y - 30} width={100} height={60} rx="10" className={`${styles.fill} ${styles.stroke}`} strokeWidth="2" />
          <line x1={p.x - 50} y1={p.y - 10} x2={p.x + 50} y2={p.y - 10} className={styles.stroke} strokeWidth="1.5" />
          <text x={p.x} y={p.y - 15} textAnchor="middle" className={`text-xs font-semibold ${styles.text}`}>
            {p.id}
          </text>
          <text x={p.x} y={p.y + 15} textAnchor="middle" className={`text-sm font-bold ${styles.text}`}>
            {p.name}
          </text>
        </g>
      ))}

      {/* Data Stores (Open ended rects) */}
      {stores.map((s, i) => (
        <g key={`store-${i}`}>
          <path d={`M ${s.x - 50} ${s.y - 20} H ${s.x + 50} V ${s.y + 20} H ${s.x - 50}`} fill="none" className={styles.stroke} strokeWidth="2" />
          <line x1={s.x - 20} y1={s.y - 20} x2={s.x - 20} y2={s.y + 20} className={styles.stroke} strokeWidth="2" />
          <text x={s.x - 35} y={s.y + 5} textAnchor="middle" className={`text-xs font-bold ${styles.text}`}>
            {s.id}
          </text>
          <text x={s.x + 15} y={s.y + 5} textAnchor="middle" className={`text-sm font-semibold ${styles.text}`}>
            {s.name}
          </text>
        </g>
      ))}

      {/* Flows */}
      {flows.map((f, i) => (
        <g key={`flow-${i}`}>
          <line
            x1={f.from.x}
            y1={f.from.y}
            x2={f.to.x}
            y2={f.to.y}
            className={styles.stroke}
            strokeWidth="1.5"
            markerEnd={f.reverse ? "" : "url(#dfd-arrow)"}
            markerStart={f.reverse ? "url(#dfd-arrow)" : ""}
          />
          <rect 
            x={(f.from.x + f.to.x) / 2 - (f.label.length * 3)} 
            y={(f.from.y + f.to.y) / 2 - 10} 
            width={f.label.length * 6} 
            height={14} 
            className={`${styles.fill} opacity-80`} 
          />
          <text
            x={(f.from.x + f.to.x) / 2}
            y={(f.from.y + f.to.y) / 2}
            textAnchor="middle"
            className={`text-xs ${styles.textSecondary}`}
          >
            {f.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

// ============ ERD DIAGRAM ============
export const ERDDiagram = () => {
  const entities = [
    {
      name: "USER",
      x: 100,
      y: 50,
      attributes: ["id: uuid PK", "email: string", "full_name: string", "created_at: timestamp"],
    },
    {
      name: "LEAD",
      x: 350,
      y: 50,
      attributes: [
        "id: uuid PK",
        "user_id: uuid FK",
        "company_id: uuid FK",
        "first_name: string",
        "last_name: string",
        "email: string",
        "lead_score: int",
        "status: enum",
      ],
    },
    {
      name: "COMPANY",
      x: 600,
      y: 50,
      attributes: ["id: uuid PK", "name: string", "domain: string", "industry: string", "size: string"],
    },
    {
      name: "CONTACT",
      x: 100,
      y: 320,
      attributes: ["id: uuid PK", "lead_id: uuid FK", "type: enum", "value: string", "is_primary: bool"],
    },
    {
      name: "ACTIVITY",
      x: 350,
      y: 320,
      attributes: ["id: uuid PK", "lead_id: uuid FK", "type: enum", "description: text", "created_at: timestamp"],
    },
    {
      name: "TAG",
      x: 600,
      y: 320,
      attributes: ["id: uuid PK", "name: string", "color: string"],
    },
  ];

  const relationships = [
    { from: { x: 200, y: 120 }, to: { x: 270, y: 120 }, label: "creates", fromCard: "1", toCard: "N" },
    { from: { x: 480, y: 120 }, to: { x: 520, y: 120 }, label: "belongs_to", fromCard: "N", toCard: "1" },
    { from: { x: 350, y: 220 }, to: { x: 350, y: 290 }, label: "has", fromCard: "1", toCard: "N" },
    { from: { x: 200, y: 350 }, to: { x: 270, y: 200 }, label: "has", fromCard: "N", toCard: "1" },
    { from: { x: 480, y: 200 }, to: { x: 520, y: 350 }, label: "tagged", fromCard: "N", toCard: "N" },
  ];

  return (
    <svg viewBox="0 0 750 520" className="w-full h-full">
      <text x="375" y="25" textAnchor="middle" className={`text-lg font-bold ${styles.text}`}>
        Entity Relationship Diagram - LeadCatch System
      </text>

      {entities.map((entity, i) => {
        const height = 30 + entity.attributes.length * 18;
        return (
          <g key={i}>
            {/* Header */}
            <rect x={entity.x - 80} y={entity.y} width={160} height={28} className={`${styles.fillAccent} ${styles.strokeAccent}`} strokeWidth="2" />
            <text x={entity.x} y={entity.y + 19} textAnchor="middle" className={`text-sm font-bold ${styles.text}`}>
              {entity.name}
            </text>
            {/* Body */}
            <rect
              x={entity.x - 80}
              y={entity.y + 28}
              width={160}
              height={height - 28}
              className={`${styles.fill} ${styles.strokeAccent}`}
              strokeWidth="2"
            />
            {entity.attributes.map((attr, j) => (
              <text
                key={j}
                x={entity.x - 70}
                y={entity.y + 48 + j * 18}
                className={`text-xs ${styles.text}`}
              >
                {attr}
              </text>
            ))}
          </g>
        );
      })}

      {relationships.map((rel, i) => (
        <g key={i}>
          <line x1={rel.from.x} y1={rel.from.y} x2={rel.to.x} y2={rel.to.y} className={styles.stroke} strokeWidth="1.5" />
          <rect 
            x={(rel.from.x + rel.to.x) / 2 - (rel.label.length * 3)} 
            y={(rel.from.y + rel.to.y) / 2 - 10} 
            width={rel.label.length * 6} 
            height={14} 
            className={`${styles.fill} opacity-80`} 
          />
          <text
            x={(rel.from.x + rel.to.x) / 2}
            y={(rel.from.y + rel.to.y) / 2}
            textAnchor="middle"
            className={`text-xs italic ${styles.textSecondary}`}
          >
            {rel.label}
          </text>
          <text x={rel.from.x + 5} y={rel.from.y - 5} className={`text-xs font-semibold ${styles.text}`}>
            {rel.fromCard}
          </text>
          <text x={rel.to.x - 10} y={rel.to.y - 5} className={`text-xs font-semibold ${styles.text}`}>
            {rel.toCard}
          </text>
        </g>
      ))}
    </svg>
  );
};

// ============ USE CASE DIAGRAM ============
export const UseCaseDiagram = () => {
  const actors = [
    { name: "User", x: 80, y: 200 },
    { name: "Admin", x: 80, y: 400 },
    { name: "System", x: 700, y: 300 },
  ];

  const useCases = [
    { name: "Parse Lead from URL", x: 300, y: 100 },
    { name: "Manual Lead Entry", x: 300, y: 180 },
    { name: "View Lead List", x: 300, y: 260 },
    { name: "Enrich Lead", x: 500, y: 180 },
    { name: "Score Lead", x: 500, y: 260 },
    { name: "Export Leads", x: 300, y: 340 },
    { name: "Manage Settings", x: 300, y: 420 },
    { name: "Generate Reports", x: 300, y: 500 },
    { name: "Call External APIs", x: 500, y: 340 },
    { name: "AI Analysis", x: 500, y: 420 },
  ];

  const connections = [
    { actor: 0, useCase: 0 },
    { actor: 0, useCase: 1 },
    { actor: 0, useCase: 2 },
    { actor: 0, useCase: 3 },
    { actor: 0, useCase: 5 },
    { actor: 1, useCase: 6 },
    { actor: 1, useCase: 7 },
    { actor: 2, useCase: 8 },
    { actor: 2, useCase: 9 },
  ];

  const includes = [
    { from: 3, to: 8, label: "<<include>>" },
    { from: 4, to: 9, label: "<<include>>" },
  ];

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <text x="400" y="30" textAnchor="middle" className={`text-lg font-bold ${styles.text}`}>
        Use Case Diagram - LeadCatch System
      </text>

      {/* System boundary */}
      <rect x="200" y="60" width="400" height="500" fill="none" className={styles.stroke} strokeWidth="2" strokeDasharray="10,5" rx="10" />
      <text x="400" y="80" textAnchor="middle" className={`text-sm font-semibold ${styles.textSecondary}`}>
        LeadCatch System
      </text>

      {/* Actors */}
      {actors.map((actor, i) => (
        <g key={i}>
          <circle cx={actor.x} cy={actor.y - 25} r={12} className={`${styles.fill} ${styles.stroke}`} strokeWidth="2" />
          <line x1={actor.x} y1={actor.y - 13} x2={actor.x} y2={actor.y + 15} className={styles.stroke} strokeWidth="2" />
          <line x1={actor.x - 15} y1={actor.y} x2={actor.x + 15} y2={actor.y} className={styles.stroke} strokeWidth="2" />
          <line x1={actor.x} y1={actor.y + 15} x2={actor.x - 12} y2={actor.y + 35} className={styles.stroke} strokeWidth="2" />
          <line x1={actor.x} y1={actor.y + 15} x2={actor.x + 12} y2={actor.y + 35} className={styles.stroke} strokeWidth="2" />
          <text x={actor.x} y={actor.y + 55} textAnchor="middle" className={`text-sm font-semibold ${styles.text}`}>
            {actor.name}
          </text>
        </g>
      ))}

      {/* Use Cases */}
      {useCases.map((uc, i) => (
        <g key={i}>
          <ellipse cx={uc.x} cy={uc.y} rx={80} ry={25} className={`${styles.fill} ${styles.stroke}`} strokeWidth="2" />
          <text x={uc.x} y={uc.y + 5} textAnchor="middle" className={`text-xs ${styles.text}`}>
            {uc.name}
          </text>
        </g>
      ))}

      {/* Connections */}
      {connections.map((conn, i) => {
        const actor = actors[conn.actor];
        const uc = useCases[conn.useCase];
        return (
          <line
            key={i}
            x1={actor.x + 20}
            y1={actor.y}
            x2={uc.x - 80}
            y2={uc.y}
            className={styles.stroke}
            strokeWidth="1"
          />
        );
      })}

      {/* Includes */}
      {includes.map((inc, i) => {
        const from = useCases[inc.from];
        const to = useCases[inc.to];
        return (
          <g key={i}>
            <line
              x1={from.x + 80}
              y1={from.y}
              x2={to.x - 80}
              y2={to.y}
              className={styles.stroke}
              strokeWidth="1"
              strokeDasharray="5,3"
            />
            <rect 
              x={(from.x + to.x) / 2 + 40 - (inc.label.length * 3)} 
              y={(from.y + to.y) / 2 - 10} 
              width={inc.label.length * 6} 
              height={14} 
              className={`${styles.fill} opacity-80`} 
            />
            <text
              x={(from.x + to.x) / 2 + 40}
              y={(from.y + to.y) / 2}
              textAnchor="middle"
              className={`text-xs italic ${styles.textSecondary}`}
            >
              {inc.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ============ CLASS DIAGRAM ============
export const ClassDiagram = () => {
  const classes = [
    {
      name: "LeadService",
      x: 200,
      y: 50,
      stereotype: "",
      attributes: ["- leads: Lead[]", "- enrichmentProvider: EnrichmentProvider"],
      methods: ["+parseLead(url): Lead", "+enrichLead(id): Lead", "+scoreLead(id): number", "+getLeads(): Lead[]"],
    },
    {
      name: "Lead",
      x: 500,
      y: 50,
      stereotype: "",
      attributes: [
        "- id: string",
        "- firstName: string",
        "- lastName: string",
        "- email: string",
        "- score: number",
        "- status: LeadStatus",
      ],
      methods: ["+getFullName(): string", "+updateScore(score): void", "+enrich(data): void"],
    },
    {
      name: "EnrichmentProvider",
      x: 200,
      y: 320,
      stereotype: "<<interface>>",
      attributes: [],
      methods: ["+enrich(lead): EnrichmentData", "+getProviderName(): string"],
    },
    {
      name: "ApolloProvider",
      x: 80,
      y: 480,
      stereotype: "",
      attributes: ["- apiKey: string"],
      methods: ["+enrich(lead): EnrichmentData", "+getProviderName(): string"],
    },
    {
      name: "ClearbitProvider",
      x: 320,
      y: 480,
      stereotype: "",
      attributes: ["- apiKey: string"],
      methods: ["+enrich(lead): EnrichmentData", "+getProviderName(): string"],
    },
    {
      name: "LeadStatus",
      x: 500,
      y: 320,
      stereotype: "<<enumeration>>",
      attributes: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"],
      methods: [],
    },
  ];

  return (
    <svg viewBox="0 0 700 620" className="w-full h-full">
      <text x="350" y="25" textAnchor="middle" className={`text-lg font-bold ${styles.text}`}>
        Class Diagram - LeadCatch System
      </text>

      {classes.map((cls, i) => {
        const hasStereotype = cls.stereotype !== "";
        const headerHeight = hasStereotype ? 45 : 28;
        const attrHeight = Math.max(cls.attributes.length * 16 + 8, 25);
        const methodHeight = cls.methods.length > 0 ? Math.max(cls.methods.length * 16 + 8, 25) : 0;

        return (
          <g key={i}>
            {/* Header */}
            <rect
              x={cls.x - 90}
              y={cls.y}
              width={180}
              height={headerHeight}
              className={`${hasStereotype ? (cls.stereotype.includes("interface") ? "fill-yellow-50 dark:fill-yellow-900/20" : "fill-blue-50 dark:fill-blue-900/20") : "fill-indigo-50 dark:fill-indigo-900/20"} ${styles.stroke}`}
              strokeWidth="2"
            />
            {hasStereotype ? (
              <>
                <text x={cls.x} y={cls.y + 17} textAnchor="middle" className={`text-xs italic ${styles.textSecondary}`}>
                  {cls.stereotype}
                </text>
                <text x={cls.x} y={cls.y + 35} textAnchor="middle" className={`text-sm font-bold ${styles.text}`}>
                  {cls.name}
                </text>
              </>
            ) : (
              <text x={cls.x} y={cls.y + 19} textAnchor="middle" className={`text-sm font-bold ${styles.text}`}>
                {cls.name}
              </text>
            )}

            {/* Attributes */}
            <rect
              x={cls.x - 90}
              y={cls.y + headerHeight}
              width={180}
              height={attrHeight}
              className={`${styles.fill} ${styles.stroke}`}
              strokeWidth="2"
            />
            {cls.attributes.map((attr, j) => (
              <text
                key={j}
                x={cls.x - 82}
                y={cls.y + headerHeight + 17 + j * 16}
                className={`text-xs ${styles.text}`}
              >
                {attr}
              </text>
            ))}

            {/* Methods */}
            {cls.methods.length > 0 && (
              <>
                <rect
                  x={cls.x - 90}
                  y={cls.y + headerHeight + attrHeight}
                  width={180}
                  height={methodHeight}
                  className={`${styles.fill} ${styles.stroke}`}
                  strokeWidth="2"
                />
                {cls.methods.map((method, j) => (
                  <text
                    key={j}
                    x={cls.x - 82}
                    y={cls.y + headerHeight + attrHeight + 17 + j * 16}
                    className={`text-xs ${styles.text}`}
                  >
                    {method}
                  </text>
                ))}
              </>
            )}
          </g>
        );
      })}

      {/* Relationships */}
      <line x1={290} y1={100} x2={410} y2={100} className={styles.stroke} strokeWidth="1.5" />
      <text x={350} y={90} textAnchor="middle" className={`text-xs ${styles.textSecondary}`}>
        uses
      </text>

      <line x1={200} y1={200} x2={200} y2={290} className={styles.stroke} strokeWidth="1.5" />
      <text x={215} y={250} className={`text-xs ${styles.textSecondary}`}>
        uses
      </text>

      <line x1={500} y1={230} x2={500} y2={290} className={styles.stroke} strokeWidth="1.5" />

      {/* Inheritance */}
      <line x1={80} y1={450} x2={170} y2={400} className={styles.stroke} strokeWidth="1.5" strokeDasharray="5,3" />
      <line x1={320} y1={450} x2={230} y2={400} className={styles.stroke} strokeWidth="1.5" strokeDasharray="5,3" />
      <polygon points="170,400 160,410 180,410" className={`${styles.fill} ${styles.stroke}`} strokeWidth="1.5" />
      <polygon points="230,400 220,410 240,410" className={`${styles.fill} ${styles.stroke}`} strokeWidth="1.5" />
    </svg>
  );
};
