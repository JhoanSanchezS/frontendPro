const consejos = {
  Agua: [
    'Cierra la llave mientras te cepillas los dientes.',
    'Revisa periódicamente que no haya fugas en tu hogar.',
    'Reutiliza agua cuando sea seguro y práctico hacerlo.'
  ],
  Energía: [
    'Apaga las luces de las habitaciones que no estés usando.',
    'Desconecta los equipos que no necesiten permanecer conectados.',
    'Aprovecha la luz natural durante el día.'
  ],
  Gas: [
    'Verifica que las llaves del gas queden cerradas después de usarlas.',
    'Mantén las instalaciones en buen estado y atiende cualquier señal de fuga.',
    'Cocina con recipientes adecuados para aprovechar mejor el calor.'
  ]
};

// Devuelve una recomendación aleatoria relacionada con el servicio seleccionado.
export function obtenerConsejo(tipoServicio) {
  const listaConsejos = consejos[tipoServicio];
  if (!listaConsejos) return 'Usa tus servicios de manera responsable.';

  const indice = Math.floor(Math.random() * listaConsejos.length);
  return listaConsejos[indice];
}
