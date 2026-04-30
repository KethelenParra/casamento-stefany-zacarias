import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import { supabase } from './config/supabase';
import { FAMILY_VIDEOS } from './data/constants';

import Navbar from './components/Navbar';
import TabBar from './components/TabBar';
import Footer from './components/Footer';
import GiftModal from './components/modals/GiftModal';
import ExchangeModal from './components/modals/ExchangeModal';

import HomePage from './pages/HomePage';
import ListaPresente from './pages/ListaPresente';
import Recardo from './pages/Recardo';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [gifts, setGifts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('gift');
  const [selectedGift, setSelectedGift] = useState(null);
  const [modalStep, setModalStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', message: '', phone: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [exchangePhone, setExchangePhone] = useState('');
  const [exchangeCurrentGift, setExchangeCurrentGift] = useState(null);
  const [exchangeNewGift, setExchangeNewGift] = useState(null);
  const [exchangeError, setExchangeError] = useState('');

  useEffect(() => {
    fetchGifts();
    fetchMessages();
  }, []);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase.from('gifts').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) setGifts(data);
    } catch (e) {
      console.error('Erro ao buscar presentes:', e);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (!error && data) setMessages(data);
    } catch (e) {
      console.error('Erro ao buscar mensagens:', e);
    }
  };

  const handleAction = async () => {
    if (!formData.name || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('messages').insert([{
        author: formData.name,
        text: formData.message || 'Enviou um abraço virtual!',
        gift_name: selectedGift?.name || null
      }]);

      if (!error) {
        if (selectedGift) {
          await supabase.from('gifts').update({
            reserved: true,
            reserved_by_name: formData.name,
            reserved_by_phone: formData.phone
          }).eq('id', selectedGift.id);
        }
        setModalStep(4);
        fetchMessages();
        fetchGifts();
      }
    } catch (e) {
      console.error('Erro ao salvar:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhone = async () => {
    setExchangeError('');
    const phone = exchangePhone.replace(/\D/g, '');
    if (phone.length !== 10 && phone.length !== 11) {
      setExchangeError('Digite um número de telefone válido com DDD.');
      return;
    }

    const found = gifts.find(g => g.reserved && g.reserved_by_phone && g.reserved_by_phone.replace(/\D/g, '') === phone);
    if (found) {
      setExchangeCurrentGift(found);
      setExchangeNewGift(null);
      setModalStep(2);
    } else {
      setExchangeError('Número não encontrado. Verifique se digitou corretamente ou se já escolheu um presente.');
    }
  };

  const handleExchange = async () => {
    if (!exchangeCurrentGift || !exchangeNewGift) return;

    try {
      await supabase.from('gifts').update({
        reserved: false,
        reserved_by_name: null,
        reserved_by_phone: null
      }).eq('id', exchangeCurrentGift.id);

      await supabase.from('gifts').update({
        reserved: true,
        reserved_by_name: exchangeCurrentGift.reserved_by_name,
        reserved_by_phone: exchangeCurrentGift.reserved_by_phone
      }).eq('id', exchangeNewGift.id);

      const { data: msgData, error: msgError } = await supabase.from('messages')
        .update({ gift_name: exchangeNewGift.name })
        .eq('author', exchangeCurrentGift.reserved_by_name)
        .not('gift_name', 'is', null)
        .select();

      if (msgError) {
        console.error('Erro ao atualizar mimo na mensagem:', msgError);
      } else {
        console.log('Mimo atualizado nas mensagens:', msgData);
      }

      setModalStep(4);
      fetchGifts();
      fetchMessages();
    } catch (e) {
      console.error('Erro ao trocar presente:', e);
    }
  };

  const onSelectGift = (gift) => {
    setSelectedGift(gift);
    setModalType('gift');
    setModalStep(1);
    setIsModalOpen(true);
  };

  const onDeleteGift = (id) => {
    setGifts(prev => prev.filter(g => g.id !== id));
  };

  const onOpenMessageModal = () => {
    setModalType('direct');
    setModalStep(1);
    setSelectedGift(null);
    setIsModalOpen(true);
  };

  const onOpenExchangeModal = () => {
    setModalType('exchange');
    setModalStep(1);
    setExchangePhone('');
    setExchangeCurrentGift(null);
    setExchangeNewGift(null);
    setExchangeError('');
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalStep(1);
      setFormData({ name: '', message: '', phone: '' });
      setSelectedGift(null);
      setExchangePhone('');
      setExchangeCurrentGift(null);
      setExchangeNewGift(null);
      setExchangeError('');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#721C24] selection:bg-[#721C24] selection:text-white font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <div className="pb-20 md:pb-0">
        {activePage === 'home' && <HomePage />}
        {activePage === 'gifts' && (
          <ListaPresente
            gifts={gifts}
            onSelectGift={onSelectGift}
            onDeleteGift={onDeleteGift}
            onExchange={onOpenExchangeModal}
          />
        )}
        {activePage === 'messages' && (
          <Recardo
            messages={messages}
            familyVideos={FAMILY_VIDEOS}
            onOpenModal={onOpenMessageModal}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#721C24]/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModals} />
          <div className="relative bg-[#FDFCFB] w-full md:max-w-xl rounded-t-[2.5rem] md:rounded-lg shadow-2xl p-8 space-y-6 animate-in slide-in-from-bottom-10 duration-500 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#721C24]/10 pb-4">
              <h3 className="font-serif text-xl md:text-2xl text-[#721C24]">
                {modalType === 'direct' && 'Deixar Mensagem'}
                {modalType === 'gift' && `Presentear: ${selectedGift?.name}`}
                {modalType === 'exchange' && 'Trocar meu Presente'}
              </h3>
              <button onClick={closeModals} className="text-[#721C24]/40 p-1"><X size={24} /></button>
            </div>

            {modalType !== 'exchange' && (
              <GiftModal
                modalType={modalType}
                modalStep={modalStep}
                setModalStep={setModalStep}
                formData={formData}
                setFormData={setFormData}
                selectedGift={selectedGift}
                handleAction={handleAction}
                closeModals={closeModals}
                isSubmitting={isSubmitting}
              />
            )}

            {modalType === 'exchange' && (
              <ExchangeModal
                modalStep={modalStep}
                setModalStep={setModalStep}
                exchangePhone={exchangePhone}
                setExchangePhone={setExchangePhone}
                exchangeCurrentGift={exchangeCurrentGift}
                exchangeNewGift={exchangeNewGift}
                setExchangeNewGift={setExchangeNewGift}
                exchangeError={exchangeError}
                setExchangeError={setExchangeError}
                gifts={gifts}
                handleVerifyPhone={handleVerifyPhone}
                handleExchange={handleExchange}
                closeModals={closeModals}
              />
            )}
          </div>
        </div>
      )}

      <TabBar activePage={activePage} setActivePage={setActivePage} />

      <Footer />
    </div>
  );
}
