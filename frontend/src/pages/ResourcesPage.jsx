import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C } from "../constants/theme";

import { Section, SectionLabel, SectionTitle } from "../components/shared";

// ── Data ─────────────────────────────────────────────────────
const resources = [
  {
    id: "web",
    category: "Web Development",
    path: "web-development",
    description: "Frontend and backend development resources",
    color: C.cyan,
    items: [
      { title: "HTML & CSS Basics", type: "PDF", link: "#" },
      { title: "JavaScript Fundamentals", type: "PDF", link: "#" },
      { title: "React Introduction", type: "PPT", link: "#" },
      { title: "Node.js & Express", type: "PDF", link: "#" },
    ],
  },
  {
    id: "dsa",
    category: "Data Structures & Algorithms",
    path: "data-structures-algo",
    description: "DSA concepts and practice material",
    color: "#8B5CF6",
    items: [
      { title: "Arrays and Strings", type: "PDF", link: "#" },
      { title: "Trees and Graphs", type: "PDF", link: "#" },
      { title: "Dynamic Programming", type: "PPT", link: "#" },
    ],
  },
  {
    id: "ai",
    category: "AI & Machine Learning",
    path: "ai-machine-learning",
    description: "Introduction to AI/ML concepts",
    color: "#F472B6",
    items: [
      { title: "Python for ML", type: "PDF", link: "#" },
      { title: "Neural Networks Basics", type: "PPT", link: "#" },
      { title: "Prompt Engineering", type: "PDF", link: "#" },
    ],
  },
  {
    id: "tools",
    category: "Dev Tools",
    path: "dev-tools",
    description: "Git, Docker, Linux and other tools",
    color: "#FBBF24",
    items: [
      { title: "Git & GitHub Guide", type: "PDF", link: "#" },
      { title: "Docker Introduction", type: "PPT", link: "#" },
      { title: "Linux Command Line", type: "PDF", link: "#" },
    ],
  },
];

const TYPE_META = {
  PDF: {
    label: "PDF",
    bg: "rgba(244,67,74,0.1)",
    color: "#F4474A",
    border: "rgba(244,67,74,0.25)",
  },
  PPT: {
    label: "PPT",
    bg: "rgba(251,191,36,0.1)",
    color: "#FBBF24",
    border: "rgba(251,191,36,0.25)",
  },
  VIDEO: {
    label: "VID",
    bg: "rgba(20,184,166,0.1)",
    color: C.cyan,
    border: "rgba(20,184,166,0.25)",
  },
  LINK: {
    label: "LINK",
    bg: "rgba(139,92,246,0.1)",
    color: "#8B5CF6",
    border: "rgba(139,92,246,0.25)",
  },
};

// ── Type badge ────────────────────────────────────────────────
function TypeBadge({ type }) {
  const m = TYPE_META[type] || TYPE_META.LINK;
  return (
    <span
      style={{
        backgroundColor: m.bg,
        border: `1px solid ${m.border}`,
        color: m.color,
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        padding: "2px 8px",
        borderRadius: "20px",
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        flexShrink: 0,
      }}
    >
      {m.label}
    </span>
  );
}

// ── File row inside an open folder ───────────────────────────
function FileRow({ item, index, folderColor }) {
  return (
    <motion.a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.18, delay: index * 0.05 }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)", x: 4 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px 10px 40px",
        textDecoration: "none",
        borderBottom: `1px solid ${C.border}`,
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.15s ease",
      }}
    >
      {/* Tree connector lines */}
      <span
        style={{
          position: "absolute",
          left: "20px",
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: "20px",
          top: "50%",
          width: "10px",
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      />

      {/* File dot */}
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "1px",
          backgroundColor: folderColor,
          opacity: 0.7,
          flexShrink: 0,
        }}
      />

      {/* Title */}
      <span
        style={{
          color: "#9CA3AF",
          fontSize: "13px",
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          flex: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {item.title.toLowerCase().replace(/ /g, "-")}
        <span style={{ color: "#4B5563" }}>
          {item.type === "PDF"
            ? ".pdf"
            : item.type === "PPT"
              ? ".pptx"
              : ".link"}
        </span>
      </span>

      <TypeBadge type={item.type} />

      {/* Arrow */}
      <span
        style={{
          color: "#374151",
          fontSize: "12px",
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          transition: "color 0.15s",
        }}
      >
        →
      </span>
    </motion.a>
  );
}

// ── Folder / Category card ────────────────────────────────────
function FolderCard({ resource, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.45,
        type: "spring",
        stiffness: 180,
      }}
      style={{
        backgroundColor: C.card,
        border: `1px solid ${isOpen ? `${resource.color}33` : C.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        transition: "border-color 0.25s ease",
      }}
    >
      {/* Header row — click to toggle */}
      <motion.button
        onClick={onToggle}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "20px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          position: "relative",
        }}
      >
        {/* Colored top accent when open */}
        {isOpen && (
          <motion.div
            layoutId={`accent-${resource.id}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${resource.color}, transparent)`,
            }}
          />
        )}

        {/* Folder icon */}
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            backgroundColor: `${resource.color}14`,
            border: `1px solid ${resource.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill={resource.color}
            opacity="0.85"
          >
            <path d="M1 3.5A1.5 1.5 0 012.5 2h3l1.5 2H13.5A1.5 1.5 0 0115 5.5v7A1.5 1.5 0 0113.5 14h-11A1.5 1.5 0 011 12.5v-9z" />
          </svg>
        </div>

        {/* Labels */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: "#E8EAED",
              fontSize: "15px",
              fontWeight: 700,
              marginBottom: "3px",
              letterSpacing: "-0.01em",
            }}
          >
            {resource.category}
          </div>
          <div
            style={{
              color: C.muted,
              fontSize: "12px",
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
            }}
          >
            ~/{resource.path}
          </div>
        </div>

        {/* Item count */}
        <span
          style={{
            color: resource.color,
            fontSize: "11px",
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            backgroundColor: `${resource.color}12`,
            border: `1px solid ${resource.color}25`,
            padding: "3px 10px",
            borderRadius: "20px",
            flexShrink: 0,
          }}
        >
          {resource.items.length} files
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            color: C.muted,
            fontSize: "12px",
            flexShrink: 0,
            display: "inline-block",
          }}
        >
          ▶
        </motion.span>
      </motion.button>

      {/* File list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="files"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden", borderTop: `1px solid ${C.border}` }}
          >
            {resource.items.map((item, i) => (
              <FileRow
                key={item.title}
                item={item}
                index={i}
                folderColor={resource.color}
              />
            ))}

            {/* Footer */}
            <div
              style={{
                padding: "10px 24px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: resource.color,
                  opacity: 0.5,
                }}
              />
              <span
                style={{
                  color: "#374151",
                  fontSize: "11px",
                  fontFamily: '"Fira Code", "Cascadia Code", monospace',
                }}
              >
                {resource.items.length} items · {resource.description}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Component ─────────────────────────────────────────────────
export default function Resources() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const totalFiles = resources.reduce((s, r) => s + r.items.length, 0);

  return (
    <Section>
      <SectionLabel>Resources</SectionLabel>
      <SectionTitle>Study material &amp; references.</SectionTitle>

      {/* Repo-style meta line */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "32px",
          padding: "12px 18px",
          backgroundColor: "rgba(15,21,32,0.6)",
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          fontSize: "12px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: C.cyan }}>kp-dev-cell</span>
        <span style={{ color: "#374151" }}>/</span>
        <span style={{ color: "#E8EAED" }}>resources</span>
        <span style={{ color: "#374151", marginLeft: "auto" }}>
          <span style={{ color: C.muted }}>{resources.length} directories</span>
          <span style={{ color: "#374151", margin: "0 8px" }}>·</span>
          <span style={{ color: C.muted }}>{totalFiles} files</span>
          <span style={{ color: "#374151", margin: "0 8px" }}>·</span>
          <span style={{ color: "#4B5563" }}>updated regularly</span>
        </span>
      </motion.div>

      {/* Folder list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {resources.map((resource, i) => (
          <FolderCard
            key={resource.id}
            resource={resource}
            index={i}
            isOpen={openId === resource.id}
            onToggle={() => toggle(resource.id)}
          />
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          textAlign: "center",
          color: "#374151",
          fontSize: "12px",
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          marginTop: "32px",
        }}
      >
        # more resources added regularly — contact us to contribute
      </motion.p>
    </Section>
  );
}
