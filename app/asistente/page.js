"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

const QUICK = [
  "Necesito un fideicomiso en vida",
  "Tuve un accidente de auto",
  "Quiero mi green card",
  "Necesito un divorcio",
  "I need a living trust",
  "I was in a car accident",
];

export default function AsistentePage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "¡Hola! Soy el asistente legal de Mar Vista Law. Cuéntame qué situación legal tienes — te conecto con el abogado correcto en segundos. 🇺🇸🇲🇽\n\nHi! I\'m the Mar Vista Law legal assistant. Tell me about your legal situation — I\'ll connect you with the right attorney in seconds." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [collectedData, setCollectedData] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text) {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", content: data.text }]);
      if (data.collectedData?.ready) setCollectedData(data.collectedData);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Hubo un error. Llámanos al (323) 418-2252." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ maxWidth: "780px", margin: "0 auto", width: "100%", padding: "24px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>⚖️</div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1E3A8A", margin: "0 0 6px" }}>
            Asistente Legal — Legal Assistant
          </h1>
          <p style={{ color: "#6B7280", fontSize: "15px", margin: 0 }}>
            Bilingual · Free · Confidential · (323) 418-2252
          </p>
        </div>

        {/* Quick chips */}
        {messages.length <= 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px", justifyContent: "center" }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)} style={{
                background: "white", border: "1px solid #BFDBFE", borderRadius: "20px",
                padding: "8px 14px", fontSize: "13px", color: "#1E3A8A", cursor: "pointer",
                fontWeight: "500"
              }}>{q}</button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)", minHeight: "300px", overflowY: "auto", maxHeight: "480px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "14px" }}>
              {m.role === "assistant" && (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px", flexShrink: 0, fontSize: "16px" }}>⚖️</div>
              )}
              <div style={{
                maxWidth: "75%", padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role === "user" ? "#1E3A8A" : "#F0F4FF",
                color: m.role === "user" ? "white" : "#1F2937",
                fontSize: "15px", lineHeight: "1.6", whiteSpace: "pre-wrap"
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#6B7280" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>⚖️</div>
              <span style={{ fontSize: "20px", letterSpacing: "2px" }}>···</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* CTA if ready */}
        {collectedData && (
          <div style={{ background: "#EFF6FF", border: "2px solid #1E3A8A", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <p style={{ margin: 0, color: "#1E3A8A", fontWeight: "600", fontSize: "15px" }}>
              ✅ Ready to connect with an attorney in {collectedData.city || "California"}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href={`/${collectedData.service}/${(collectedData.city || "los-angeles").toLowerCase().replace(/\s+/g, "-")}`}
                style={{ background: "#1E3A8A", color: "white", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>
                Find Attorney →
              </a>
              <a href="tel:+13234182252" style={{ background: "#F59E0B", color: "white", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>
                📞 Call Now
              </a>
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Describe tu situación legal... / Describe your legal situation..."
            disabled={loading}
            style={{ flex: 1, padding: "14px 18px", borderRadius: "12px", border: "1px solid #BFDBFE", fontSize: "15px", color: "#1F2937", outline: "none", background: "white" }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{
            background: "#1E3A8A", color: "white", border: "none", borderRadius: "12px",
            padding: "14px 22px", cursor: "pointer", fontWeight: "700", fontSize: "15px",
            opacity: loading || !input.trim() ? 0.6 : 1
          }}>
            {loading ? "..." : "→"}
          </button>
        </div>

        <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: "12px", marginTop: "12px" }}>
          Not legal advice · Attorney referral service · marvistalaw.com
        </p>
      </div>
    </div>
  );
}
