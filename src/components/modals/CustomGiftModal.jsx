import React, { useState } from 'react';
import { CheckCircle, ArrowRight, User, Phone, Gift, MessageSquare } from 'lucide-react';
import { formatPhone, isPhoneValid } from '../../utils/phone';

const CustomGiftModal = ({ onSave, closeModals, isSubmitting }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [giftName, setGiftName] = useState('');
  const [message, setMessage] = useState('');

  const canGoToStep2 = name.trim().length >= 2 && isPhoneValid(phone);
  const canConfirm = giftName.trim().length >= 2;

  const handleConfirm = async () => {
    if (!canConfirm || isSubmitting) return;
    await onSave({
      name: name.trim(),
      phone,
      isFromList: false,
      giftId: null,
      giftName: giftName.trim(),
      message: message.trim(),
    });
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="text-center py-10 space-y-6">
        <CheckCircle size={56} className="mx-auto text-[#721C24]" strokeWidth={1} />
        <div className="space-y-2">
          <h4 className="text-2xl md:text-3xl font-serif text-[#721C24]">Presente registrado!</h4>
          <p className="text-stone-500 text-sm font-light leading-relaxed">
            Obrigado, <span className="font-semibold text-[#721C24]">{name}</span>! Ficamos muito felizes que vá nos presentear com{' '}
            <span className="font-semibold text-[#721C24]">{giftName}</span>. 💕
          </p>
          <p className="text-[10px] text-stone-400 font-light mt-2">
            Caso queira trocar, use o botão "Trocar meu Presente" com o número cadastrado.
          </p>
        </div>
        <button
          onClick={closeModals}
          className="font-bold border-b border-[#721C24] uppercase text-[10px] tracking-widest text-[#721C24]"
        >
          Voltar ao Site
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-5">
        <p className="text-stone-500 text-sm font-light leading-relaxed">
          Informe o presente que deseja dar e, se quiser, deixe uma mensagem no mural.
        </p>

        <div className="relative">
          <Gift size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#721C24]/30" />
          <input
            type="text"
            value={giftName}
            onChange={e => setGiftName(e.target.value)}
            className="w-full border-b-2 border-[#721C24]/20 py-3 pl-6 focus:outline-none focus:border-[#721C24] text-xl font-serif bg-transparent placeholder-[#721C24]/20 text-[#721C24] transition-colors"
            placeholder="Ex: Forro de cama, jogo de panelas..."
            maxLength={80}
            autoFocus
          />
        </div>

        <div className="relative">
          <MessageSquare size={14} className="absolute left-0 top-3.5 text-[#721C24]/30" />
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={2}
            className="w-full border-b-2 border-[#721C24]/20 py-2 pl-6 focus:outline-none focus:border-[#721C24] text-sm font-light bg-transparent placeholder-[#721C24]/20 text-[#721C24] transition-colors resize-none"
            placeholder="Deixe uma mensagem no mural (opcional)"
            maxLength={200}
          />
        </div>

        <button
          disabled={!canConfirm || isSubmitting}
          onClick={handleConfirm}
          className="w-full bg-[#721C24] text-white py-4 uppercase font-bold text-xs tracking-widest disabled:opacity-20 flex justify-center items-center gap-2 shadow-xl"
        >
          {isSubmitting ? 'Registrando...' : <>Confirmar Presente <ArrowRight size={16} /></>}
        </button>

        <button
          onClick={() => setStep(1)}
          className="w-full text-[#721C24]/50 text-[10px] uppercase tracking-widest font-bold py-1 hover:text-[#721C24] transition"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-stone-500 text-sm font-light leading-relaxed">
        Informe seu nome e telefone para registrar seu presente. O número permite que você troque o presente depois, se quiser.
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
          <Phone size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#721C24]/30" />
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            className={`w-full border-b-2 py-3 pl-6 focus:outline-none text-xl font-serif bg-transparent placeholder-[#721C24]/20 transition-colors ${
              phone && !isPhoneValid(phone)
                ? 'border-red-400 text-red-500'
                : isPhoneValid(phone)
                ? 'border-green-500 text-[#721C24]'
                : 'border-[#721C24]/20 text-[#721C24] focus:border-[#721C24]'
            }`}
            placeholder="(XX) XXXXX-XXXX"
            maxLength={15}
            onKeyDown={e => e.key === 'Enter' && canGoToStep2 && setStep(2)}
          />
          <div className="flex justify-end mt-1 h-4">
            {phone && !isPhoneValid(phone) && (
              <p className="text-[9px] text-red-400 font-bold uppercase tracking-wide">Número incompleto</p>
            )}
            {isPhoneValid(phone) && (
              <p className="text-[9px] text-green-500 font-bold uppercase tracking-wide">✓ Válido</p>
            )}
          </div>
        </div>
      </div>

      <button
        disabled={!canGoToStep2}
        onClick={() => setStep(2)}
        className="w-full bg-[#721C24] text-white py-4 uppercase font-bold text-xs tracking-widest disabled:opacity-20 flex justify-center items-center gap-2 shadow-xl"
      >
        Continuar <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default CustomGiftModal;
