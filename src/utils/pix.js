/**
 * Gerador de payload PIX estático (padrão EMV/BCB)
 * https://www.bcb.gov.br/content/estabilidadefinanceira/forumpagamentos/migracaopix/Padrao_QR_Code_PIX.pdf
 */

function tlv(id, value) {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return ((crc & 0xffff).toString(16).toUpperCase()).padStart(4, '0');
}

/**
 * Gera o payload EMV PIX estático para a chave de telefone dos noivos.
 * Sub-elemento 02 (descrição) omitido — alguns bancos interpretam mal
 * o campo e classificam o QR Code estático como dinâmico.
 * @param {number|string} amount - Valor em reais (número)
 * @returns {string} payload PIX pronto para QR Code
 */
export function generatePixPayload(amount) {
  const pixKey = '63992834074';
  const merchantName = 'Stefany e Zacarias';
  const merchantCity = 'PALMAS';

  const formattedAmount = parseFloat(amount).toFixed(2);

  const merchantAccountInfo = tlv('00', 'BR.GOV.BCB.PIX') + tlv('01', pixKey);

  const additionalData = tlv('05', '***');

  const payloadSemCRC =
    tlv('00', '01') +
    tlv('26', merchantAccountInfo) +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('54', formattedAmount) +
    tlv('58', 'BR') +
    tlv('59', merchantName) +
    tlv('60', merchantCity) +
    tlv('62', additionalData) +
    '6304';

  return payloadSemCRC + crc16(payloadSemCRC);
}
