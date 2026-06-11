import React, { useState } from 'react';
import { Mail, Send, CheckCircle, MessageSquare } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    // Simulate sending network request
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      
      // Save contact message in localStorage as a mock inbox database
      try {
        const existingMessages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        existingMessages.push({
          ...formData,
          id: Date.now(),
          date: new Date().toISOString()
        });
        localStorage.setItem('portfolio_messages', JSON.stringify(existingMessages));
      } catch (err) {
        console.error('Failed to save message:', err);
      }

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Clear success message after 4 seconds
      setTimeout(() => setIsSent(false), 4000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="container animate-slide-up" style={{ marginBottom: '6rem' }} id="contact">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <MessageSquare size={22} style={{ color: 'var(--accent-primary)' }} />
        <h2>Get In Touch</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Info panel */}
        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          <h3>Let's Collaborate</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Whether you want to build a project together, query a feature, or just say hello, drop me a line! I will get back to you as soon as possible.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)'
              }}>
                <Mail size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>contact@developer.me</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(129, 140, 248, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-secondary)'
              }}>
                <Mail size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>GitHub Inbox</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>Direct Message via Issue logs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="contact-grid">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  className="form-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={inputStyle}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                style={{ ...inputStyle, resize: 'none' }}
                className="form-input"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSending || isSent}
              className="btn btn-primary"
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minHeight: '45px'
              }}
            >
              {isSending ? (
                <>Simulating Connection...</>
              ) : isSent ? (
                <>
                  <CheckCircle size={16} />
                  Message Transmitted!
                </>
              ) : (
                <>
                  <Send size={15} />
                  Transmit Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .form-input {
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.15);
        }
        @media (max-width: 600px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--panel-border)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  outline: 'none'
};
