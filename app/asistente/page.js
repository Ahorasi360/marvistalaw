"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const QUICK_STARTS_EN = [
  "I was in a car accident",
  "I need a Living Trust",
  "How do I renew DACA?",
  "I need help with divorce",
];
const QUICK_STARTS_ES = [
  "Tuve un accidente de carro",
  "Necesito un Fideicomiso",
  "¿Cómo renuevo el DACA?",
  "Necesito ayuda con divorcio",
];

export default function AsistentePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text) {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: lang === "es" ? "Lo siento, hubo un error. Llámanos al (323) 418-2252." : "Sorry, there was an error. Call us at (323) 418-2252." }]);
    }
    setLoading(false);
  }

  const quickStarts = lang === "es" ? QUICK_STARTS_ES : QUICK_STARTS_EN;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 16px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "56px", background: "#1E3A8A", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px" }}>⚖️</div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1E3A8A", marginBottom: "8px" }}>
            {lang === "es" ? "Asistente Legal MarVistaLaw" : "MarVistaLaw Legal Assistant"}
          </h1>
          <p style={{ color: "#6B7280", fontSize: "15px", marginBottom: "16px" }}>
            {lang === "es" ? "Cuéntame tu situación y te ayudo a encontrar la ayuda legal correcta." : "Tell me your situation and I'll help you find the right legal help."}
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {["en","es"].map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{ padding: "6px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px",
                  background: lang === l ? "#1E3A8A" : "#E5E7EB", color: lang === l ? "white" : "#374151" }}>
                {l === "en" ? "EN" : "ES"}
              </button>
            ))}
          </div>
        </div>

        {/* Chat box */}
        <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{ minHeight: "360px", maxHeight: "480px", overflowY: "auto", padding: "24px" }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", paddingTop: "40px" }}>
                <p style={{ color: "#9CA3AF", marginBottom: "24px", fontSize: "15px" }}>
                  {lang === "es" ? "¿En qué te puedo ayudar hoy?" : "How can I help you today?"}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxWidth: "480px", margin: "0 auto" }}>
                  {quickStarts.map((q, i) => (
                    <button key={i} onClick={() => send(q)}
                      style={{ padding: "12px 16px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "10px",
                        cursor: "pointer", fontSize: "14px", color: "#1E40AF", fontWeight: "500", textAlign: "left" }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}>
                {m.role === "assistant" && (
                  <div style={{ width: "32px", height: "32px", background: "#1E3A8A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "8px", flexShrink: 0, fontSize: "14px" }}>⚖️</div>
                )}
                <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? "#1E3A8A" : "#F3F4F6", color: m.role === "user" ? "white" : "#1F2937",
                  fontSize: "15px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "32px", height: "32px", background: "#1E3A8A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⚖️</div>
                <div style={{ padding: "12px 16px", background: "#F3F4F6", borderRadius: "16px 16px 16px 4px", display: "flex", gap: "4px" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: "8px", height: "8px", background: "#9CA3AF", borderRadius: "50%", animation: `bounce 1.2s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: "1px solid #E5E7EB", padding: "16px", display: "flex", gap: "10px" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={lang === "es" ? "Escribe tu pregunta legal..." : "Type your legal question..."}
              style={{ flex: 1, padding: "12px 16px", border: "1px solid #D1D5DB", borderRadius: "10px", fontSize: "15px", outline: "none", color: "#1F2937" }} />
            <button onClick={() => send()} disabled={loading || !input.trim()}
              style={{ padding: "12px 20px", background: loading || !input.trim() ? "#9CA3AF" : "#1E3A8A",
                color: "white", border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "700", fontSize: "15px" }}>
              {lang === "es" ? "Enviar" : "Send"}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "24px", background: "#1E3A8A", borderRadius: "12px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "white" }}>
            <div style={{ fontWeight: "700", fontSize: "16px" }}>{lang === "es" ? "¿Prefieres hablar con alguien?" : "Prefer to talk to someone?"}</div>
            <div style={{ opacity: 0.8, fontSize: "14px" }}>{lang === "es" ? "Consulta gratis · Bilingüe · Rápida respuesta" : "Free consultation · Bilingual · Fast response"}</div>
          </div>
          <a href="tel:+13234182252" style={{ background: "#F59E0B", color: "#1E3A8A", padding: "12px 20px", borderRadius: "10px", textDecoration: "none", fontWeight: "800", fontSize: "15px", whiteSpace: "nowrap" }}>
            📞 (323) 418-2252
          </a>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}
