import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, User, Copy, CheckCircle, Heart, MessageSquare } from 'lucide-react';
import { generatePixPayload } from '../../utils/pix';

const formatCurrency = (raw) => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const number = parseInt(digits, 10) / 100;
  return number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseCurrency = (formatted) => {
  return parseFloat(formatted.replace(/\./g, '').replace(',', '.')) || 0;
};

const PixModal = ({ onSave, closeModals, isSubmitting }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [amountRaw, setAmountRaw] = useState('');
  const [copied, setCopied] = useState(false);
  const [pixPayload, setPixPayload] = useState('');
  const [message, setMessage] = useState('');
  const [showAsPix, setShowAsPix] = useState(false);

  const parsedAmount = parseCurrency(amountRaw);
  const canSubmit = name.trim().length >= 2 && parsedAmount >= 1;

  const handleGenerate = () => {
    if (!canSubmit) return;
    const payload = generatePixPayload(parsedAmount, name.trim());
    setPixPayload(payload);
    setStep(2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleConcluir = async () => {
    const hasContent = message.trim().length > 0 || showAsPix;
    if (hasContent) {
      await onSave({ name: name.trim(), message: message.trim(), showAsPix });
    }
    closeModals();
  };

  if (step === 2) {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold">Presente de</p>
          <p className="font-serif text-xl text-[#721C24]">{name}</p>
          <div className="flex items-center justify-center gap-1.5 text-[#721C24]/60">
            <Heart size={10} fill="currentColor" />
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold">Casamento Stefany &amp; Zacarias</p>
            <Heart size={10} fill="currentColor" />
          </div>
          <p className="text-2xl font-serif text-[#721C24] font-bold">
            R$&nbsp;{amountRaw}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-white border border-[#721C24]/10 shadow-sm rounded">
            <QRCodeSVG
              value={pixPayload}
              size={180}
              level="M"
              includeMargin={false}
              fgColor="#721C24"
            />
          </div>
          <p className="text-[10px] text-stone-400 text-center font-light leading-relaxed max-w-xs">
            Abra o aplicativo do seu banco, acesse a área Pix e escolha <strong>QR Code</strong> ou <strong>Pix Copia e Cola</strong>.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={`w-full py-3 uppercase font-bold text-xs tracking-widest flex justify-center items-center gap-2 border transition-all duration-300 shadow-sm ${
            copied
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-[#721C24] text-white border-[#721C24] hover:bg-[#8B0000]'
          }`}
        >
          {copied ? <><CheckCircle size={14} /> Código copiado!</> : <><Copy size={14} /> Copiar código PIX</>}
        </button>

        <div className="border-t border-[#721C24]/10 pt-4 space-y-4">
          <div className="relative">
            <MessageSquare size={14} className="absolute left-0 top-3.5 text-[#721C24]/30" />
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={2}
              className="w-full border-b-2 border-[#721C24]/20 py-2 pl-6 focus:outline-none focus:border-[#721C24] text-sm font-light bg-transparent placeholder-[#721C24]/20 text-[#721C24] transition-colors resize-none"
              placeholder="Deixar mensagem no mural (opcional)"
              maxLength={200}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setShowAsPix(v => !v)}
              className={`w-10 h-5 rounded-full relative transition-colors duration-300 shrink-0 ${
                showAsPix ? 'bg-[#721C24]' : 'bg-stone-200'
              }`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
                showAsPix ? 'left-5' : 'left-0.5'
              }`} />
            </div>
            <span className="text-xs text-stone-500 font-light leading-tight group-hover:text-[#721C24] transition-colors">
              Exibir <span className="font-semibold text-[#721C24]">"Pix"</span> como presente no mural
            </span>
          </label>
        </div>

        <button
          disabled={isSubmitting}
          onClick={handleConcluir}
          className="w-full bg-[#721C24] text-white py-4 uppercase font-bold text-xs tracking-widest disabled:opacity-20 flex justify-center items-center gap-2 shadow-xl"
        >
          {isSubmitting ? 'Salvando...' : 'Concluir'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-stone-500 text-sm font-light leading-relaxed">
        Prefere presentear os noivos com um Pix? Informe seu nome e o valor desejado. Geraremos um QR Code para você na hora!
      </p>

      <div className="space-y-5">
        <div className="relative">
          <User size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#721C24]/30" />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border-b-2 border-[#721C24]/20 py-3 pl-6 focus:outline-none focus:border-[#721C24] text-xl font-serif bg-transparent placeholder-[#721C24]/20 text-[#721C24] transition-colors"
            placeholder="Seu nome"
            maxLength={60}
          />
        </div>

        <div className="relative">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#721C24]/30 text-sm font-serif">R$</span>
          <input
            type="text"
            inputMode="numeric"
            value={amountRaw}
            onChange={e => setAmountRaw(formatCurrency(e.target.value))}
            className="w-full border-b-2 border-[#721C24]/20 py-3 pl-8 focus:outline-none focus:border-[#721C24] text-xl font-serif bg-transparent placeholder-[#721C24]/20 text-[#721C24] transition-colors"
            placeholder="0,00"
            onKeyDown={e => e.key === 'Enter' && canSubmit && handleGenerate()}
          />
        </div>

        {parsedAmount > 0 && parsedAmount < 1 && (
          <p className="text-[10px] text-red-400 font-bold uppercase tracking-wide">Valor mínimo: R$ 1,00</p>
        )}
      </div>

      <button
        disabled={!canSubmit}
        onClick={handleGenerate}
        className="w-full bg-[#721C24] text-white py-4 uppercase font-bold text-xs tracking-widest disabled:opacity-20 flex justify-center items-center gap-2 shadow-xl"
      >
        Gerar QR Code PIX <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default PixModal;
