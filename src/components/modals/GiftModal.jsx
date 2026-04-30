import React from 'react';
import { CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { formatPhone, isPhoneValid } from '../../utils/phone';

const GiftModal = ({ modalType, modalStep, setModalStep, formData, setFormData, selectedGift, handleAction, closeModals, isSubmitting }) => (
  <>
    {modalStep === 1 && (
      <div className="space-y-5">
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full border-b-2 border-[#721C24]/20 py-3 focus:border-[#721C24] outline-none text-xl font-serif bg-transparent text-[#721C24] placeholder-[#721C24]/20"
          placeholder="Seu nome"
        />
        {modalType === 'gift' && (
          <div className="relative">
            <Phone size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#721C24]/30" />
            <input
              type="tel"
              inputMode="numeric"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
              className={`w-full border-b-2 py-3 pl-6 focus:outline-none text-xl font-serif bg-transparent placeholder-[#721C24]/20 transition-colors ${
                formData.phone && !isPhoneValid(formData.phone)
                  ? 'border-red-400 text-red-500'
                  : isPhoneValid(formData.phone)
                  ? 'border-green-500 text-[#721C24]'
                  : 'border-[#721C24]/20 text-[#721C24] focus:border-[#721C24]'
              }`}
              placeholder="(XX) XXXXX-XXXX"
              maxLength={15}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-[9px] text-stone-400 uppercase tracking-widest">Necessário para possível troca futura</p>
              {formData.phone && !isPhoneValid(formData.phone) && (
                <p className="text-[9px] text-red-400 font-bold uppercase tracking-wide">Número incompleto</p>
              )}
              {isPhoneValid(formData.phone) && (
                <p className="text-[9px] text-green-500 font-bold uppercase tracking-wide">✓ Válido</p>
              )}
            </div>
          </div>
        )}
        <button
          disabled={!formData.name || (modalType === 'gift' && !isPhoneValid(formData.phone))}
          onClick={() => setModalStep(modalType === 'direct' ? 3 : 2)}
          className="w-full bg-[#721C24] text-white py-4 uppercase font-bold text-xs tracking-widest disabled:opacity-20 flex justify-center items-center gap-2 shadow-xl"
        >
          Próximo <ArrowRight size={16} />
        </button>
      </div>
    )}

    {modalStep === 2 && (
      <div className="text-center space-y-8 py-4">
        <p className="font-serif italic text-lg text-[#721C24]/60">Deseja aproveitar para deixar uma mensagem carinhosa para o casal?</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => setModalStep(3)} className="w-full bg-[#721C24] text-white py-4 font-bold text-xs tracking-widest uppercase shadow-md">Sim, escrever recado</button>
          <button onClick={handleAction} disabled={isSubmitting} className="w-full border border-[#721C24] py-4 font-bold text-xs tracking-widest uppercase text-[#721C24] hover:bg-[#721C24]/5 disabled:opacity-50">{isSubmitting ? 'Finalizando...' : 'Pular e finalizar'}</button>
        </div>
      </div>
    )}

    {modalStep === 3 && (
      <div className="space-y-6">
        <div>
          <textarea
            rows={4}
            maxLength={300}
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            className="w-full border border-[#721C24]/10 p-4 focus:border-[#721C24] outline-none text-lg italic bg-[#721C24]/5 text-[#721C24]"
            placeholder="Sua mensagem de carinho..."
          />
          <p className="text-[9px] text-stone-400 text-right mt-1 uppercase tracking-widest">{formData.message.length}/300</p>
        </div>
        <button
          onClick={handleAction}
          disabled={isSubmitting}
          className="w-full bg-[#721C24] text-white py-4 font-bold text-xs tracking-widest uppercase shadow-xl disabled:opacity-50"
        >
          {isSubmitting ? 'Publicando...' : 'Publicar Mensagem'}
        </button>
      </div>
    )}

    {modalStep === 4 && (
      <div className="text-center py-10 space-y-6">
        <CheckCircle size={56} className="mx-auto text-[#721C24]" strokeWidth={1} />
        <h4 className="text-2xl md:text-3xl font-serif text-[#721C24]">Obrigado pelo carinho!</h4>
        <button
          onClick={closeModals}
          className="font-bold border-b border-[#721C24] uppercase text-[10px] tracking-widest text-[#721C24]"
        >
          Voltar ao Site
        </button>
      </div>
    )}
  </>
);

export default GiftModal;
