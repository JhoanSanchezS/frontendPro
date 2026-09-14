const consejos = {
  Agua: [
    '💧 Cierra la llave mientras te cepillas los dientes para ahorrar agua.',
    '💧 Revisa que no haya fugas de agua en tu hogar.',
    '💧 Aprovecha el agua cuando sea posible para reutilizarla en otras actividades.'
  ],

  Energía: [
    '⚡ Apaga las luces cuando no las necesites.',
    '⚡ Desconecta los equipos que no estés utilizando.',
    '⚡ Aprovecha la luz natural durante el día para reducir el consumo de energía.'
  ],

  Gas: [
    '🔥 Verifica que las llaves del gas queden bien cerradas después de utilizarlas.',
    '🔥 Mantén las instalaciones de gas en buen estado y revisa posibles fugas.',
    '🔥 Utiliza el gas de manera responsable y evita desperdiciarlo durante la cocción.'
  ]
};

export function obtenerConsejo(tipoServicio) {
  const listaConsejos = consejos[tipoServicio];

  if (!listaConsejos) {
    return '🌱 Recuerda utilizar responsablemente los servicios públicos.';
  }

  const indice = Math.floor(Math.random() * listaConsejos.length);

  return listaConsejos[indice];
}