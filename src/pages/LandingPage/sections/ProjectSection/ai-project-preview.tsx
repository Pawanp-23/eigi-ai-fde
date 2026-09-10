import {
  BrainCircuit,
  FileText,
  Database,
  Sparkles,
  Check,
  ArrowRight,
} from 'lucide-react';

/** Illustrative product interfaces; no live client data or implied results. */
export default function AIProjectPreview({
  variant,
  paused = false,
}: {
  variant: string;
  paused?: boolean;
}) {
  const knowledge = variant === 'network';
  return (
    <div
      className={`ai-project-preview ${paused ? 'is-still' : ''}`}
      aria-hidden="true"
    >
      <div className="ai-project-orbit" />
      <div className="ai-product-window">
        <div className="ai-window-bar">
          <span className="ai-window-dots">•••</span>
          <span>{knowledge ? 'KNOWLEDGE WORKSPACE' : 'DOCUMENT WORKFLOW'}</span>
          <Sparkles size={15} />
        </div>
        {knowledge ? (
          <div className="ai-product-content">
            <div className="ai-source-row">
              <span>
                <FileText size={13} /> Docs
              </span>
              <span>
                <Database size={13} /> Data
              </span>
              <span>
                <Check size={13} /> Connected
              </span>
            </div>
            <div className="ai-chat-question">
              What does our onboarding policy say?
            </div>
            <div className="ai-chat-answer">
              <BrainCircuit size={25} />
              <div>
                <strong>One answer. Your sources.</strong>
                <div className="ai-answer-lines">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="ai-source-citation">
                  [1] Handbook · [2] Team wiki
                </span>
              </div>
            </div>
            <div className="ai-workflow-status">
              <span className="ai-status-dot" /> Grounded in your knowledge
            </div>
          </div>
        ) : (
          <div className="ai-product-content">
            <div className="ai-document-flow">
              <div className="ai-invoice">
                <FileText size={28} />
                <strong>INVOICE</strong>
                <span>INV-2026-042</span>
                <i />
                <i />
                <div className="ai-scan-line" />
              </div>
              <ArrowRight size={20} />
              <div className="ai-extracted">
                <span>EXTRACTED FIELDS</span>
                <p>
                  Vendor <strong>Acme Co.</strong>
                </p>
                <p>
                  Amount <strong>$1,240</strong>
                </p>
                <p>
                  Due date <strong>30 Sep</strong>
                </p>
              </div>
            </div>
            <div className="ai-review-step">
              <Check size={16} /> Ready for human review
            </div>
            <div className="ai-workflow-status">
              <span className="ai-status-dot" /> Extract → Validate → Approve
            </div>
          </div>
        )}
      </div>
      <div className="ai-floating-chip">
        <BrainCircuit size={20} />
        <span>{knowledge ? 'RAG ENGINE' : 'AI EXTRACTION'}</span>
      </div>
    </div>
  );
}
