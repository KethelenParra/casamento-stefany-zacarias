import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Phone, Gift, RefreshCw, AlertCircle, List, PackagePlus } from 'lucide-react';
import { formatPhone, isPhoneValid } from '../../utils/phone';

const ExchangeModal = ({
  modalStep,
  setModalStep,
  exchangePhone,
  setExchangePhone,
  exchangeCurrentGift,
  exchangeNewGift,
  setExchangeNewGift,
  exchangeError,
  setExchangeError,
  gifts,
  handleVerifyPhone,
  handleExchange,
  closeModals,
}) => {
  const [tab, setTab] = useState('list');
  const [customNewGiftName, setCustomNewGiftName] = useState('');

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setExchangeNewGift(null);
    setCustomNewGiftName('');
  };

  const handleConfirm = () => {
    if (tab === 'custom' && customNewGiftName.trim().length >= 2) {
      setExchangeNewGift({ isCustom: true, name: customNewGiftName.trim() });
      handleExchange({ isCustom: true, name: customNewGiftName.trim() });
    } else {
      handleExchange();
    }
  };

  const canConfirm =
    tab === 'list'
      ? !!exchangeNewGift && !exchangeNewGift.isCustom
      : customNewGiftName.trim().length >= 2;

  return (
    <>
      {modalStep === 1 && (
        <div className="space-y-6">
          <p className="text-stone-500 text-sm font-light leading-relaxed">
            Para trocar o seu presente, informe o número de telefone que usou ao escolhê-lo. Vamos verificar o seu cadastro.
          </p>
          <div className="relative">
            <Phone size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#721C24]/30" />
            <input
              type="tel"
              inputMode="numeric"
              value={exchangePhone}
              onChange={e => { setExchangePhone(formatPhone(e.target.value)); setExchangeError(''); }}
              className={`w-full border-b-2 py-3 pl-6 focus:outline-none text-xl font-serif bg-transparent placeholder-[#721C24]/20 transition-colors ${
                exchangePhone && !isPhoneValid(exchangePhone)
                  ? 'border-red-400 text-red-500'
                  : isPhoneValid(exchangePhone)
                  ? 'border-green-500 text-[#721C24]'
                  : 'border-[#721C24]/20 text-[#721C24] focus:border-[#721C24]'
              }`}
              placeholder="(XX) XXXXX-XXXX"
              maxLength={15}
              onKeyDown={e => e.key === 'Enter' && isPhoneValid(exchangePhone) && handleVerifyPhone()}
            />
            <div className="flex justify-end mt-1 h-4">
              {exchangePhone && !isPhoneValid(exchangePhone) && (
                <p className="text-[9px] text-red-400 font-bold uppercase tracking-wide">Número incompleto</p>
              )}
              {isPhoneValid(exchangePhone) && (
                <p className="text-[9px] text-green-500 font-bold uppercase tracking-wide">✓ Válido</p>
              )}
            </div>
          </div>
          {exchangeError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              <AlertCircle size={14} className="shrink-0" />
              <p className="text-[11px] font-medium">{exchangeError}</p>
            </div>
          )}
          <button
            disabled={!isPhoneValid(exchangePhone)}
            onClick={handleVerifyPhone}
            className="w-full bg-[#721C24] text-white py-4 uppercase font-bold text-xs tracking-widest disabled:opacity-20 flex justify-center items-center gap-2 shadow-xl"
          >
            Verificar <ArrowRight size={16} />
          </button>
        </div>
      )}

      {modalStep === 2 && exchangeCurrentGift && (
        <div className="space-y-5">
          <div className="bg-[#721C24]/5 border border-[#721C24]/15 p-4 flex items-center gap-3">
            <Gift size={18} className="text-[#721C24]/50 shrink-0" />
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold">Seu presente atual</p>
              <p className="font-serif text-lg text-[#721C24]">{exchangeCurrentGift.name}</p>
            </div>
          </div>

          <div className="flex border border-[#721C24]/20 overflow-hidden">
            <button
              onClick={() => handleTabChange('list')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-bold transition-all ${
                tab === 'list'
                  ? 'bg-[#721C24] text-white'
                  : 'text-[#721C24]/50 hover:text-[#721C24] hover:bg-[#721C24]/5'
              }`}
            >
              <List size={11} /> Da lista
            </button>
            <button
              onClick={() => handleTabChange('custom')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-bold transition-all border-l border-[#721C24]/20 ${
                tab === 'custom'
                  ? 'bg-[#721C24] text-white'
                  : 'text-[#721C24]/50 hover:text-[#721C24] hover:bg-[#721C24]/5'
              }`}
            >
              <PackagePlus size={11} /> Personalizado
            </button>
          </div>

          {tab === 'list' && (
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">Escolha o novo presente</p>
              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {gifts.filter(g => !g.reserved).map(g => (
                  <button
                    key={g.id}
                    onClick={() => setExchangeNewGift(g)}
                    className={`text-left p-3 border transition-all duration-200 ${
                      exchangeNewGift?.id === g.id
                        ? 'border-[#721C24] bg-[#721C24]/5'
                        : 'border-stone-200 hover:border-[#721C24]/40'
                    }`}
                  >
                    <p className="text-[8px] uppercase tracking-[0.2em] text-stone-400 font-bold">{g.category}</p>
                    <p className="font-serif text-sm text-[#721C24] leading-tight mt-0.5">{g.name}</p>
                    {exchangeNewGift?.id === g.id && (
                      <CheckCircle size={12} className="text-[#721C24] mt-1" />
                    )}
                  </button>
                ))}
                {gifts.filter(g => !g.reserved).length === 0 && (
                  <p className="col-span-2 text-center text-stone-400 text-xs italic py-4">Não há presentes disponíveis no momento.</p>
                )}
              </div>
            </div>
          )}

          {tab === 'custom' && (
            <div className="relative">
              <Gift size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#721C24]/30" />
              <input
                type="text"
                value={customNewGiftName}
                onChange={e => setCustomNewGiftName(e.target.value)}
                className="w-full border-b-2 border-[#721C24]/20 py-3 pl-6 focus:outline-none focus:border-[#721C24] text-xl font-serif bg-transparent placeholder-[#721C24]/20 text-[#721C24] transition-colors"
                placeholder="Ex: Forro de cama, jogo de panelas..."
                maxLength={80}
                autoFocus
              />
            </div>
          )}

          <button
            disabled={!canConfirm}
            onClick={handleConfirm}
            className="w-full bg-[#721C24] text-white py-4 uppercase font-bold text-xs tracking-widest disabled:opacity-20 flex justify-center items-center gap-2 shadow-xl"
          >
            <RefreshCw size={14} /> Confirmar Troca
          </button>
          <button
            onClick={() => setModalStep(1)}
            className="w-full text-[#721C24]/50 text-[10px] uppercase tracking-widest font-bold py-1 hover:text-[#721C24] transition"
          >
            Voltar
          </button>
        </div>
      )}

      {modalStep === 4 && (
        <div className="text-center py-10 space-y-6">
          <CheckCircle size={56} className="mx-auto text-[#721C24]" strokeWidth={1} />
          <div className="space-y-2">
            <h4 className="text-2xl md:text-3xl font-serif text-[#721C24]">Troca realizada!</h4>
            <p className="text-stone-500 text-sm font-light">
              O seu novo presente é{' '}
              <span className="font-bold text-[#721C24]">
                {exchangeNewGift?.name ?? customNewGiftName}
              </span>. Obrigado!
            </p>
          </div>
          <button onClick={closeModals} className="font-bold border-b border-[#721C24] uppercase text-[10px] tracking-widest text-[#721C24]">Voltar ao Site</button>
        </div>
      )}
    </>
  );
};

export default ExchangeModal;
