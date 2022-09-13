import React, { useEffect, useRef } from 'react';

const HelpPage = () => {

  return (
    <div className="HelpPage">
      
      <h1>Funcionalidades por implementar</h1>

      <ul>
        <li>Notas de rodapé estão sem links e ainda não são recuperadas no docx final</li>
        <li>Juntar 2 entidades com tipos diferentes na tabela não é possivél</li>
        <li>Não é possivél ordenar a tabela pela ordem que aparece no texto (novas entidades aparecem no fim)</li>
      </ul>

    </div>
  )
}

export default HelpPage;
