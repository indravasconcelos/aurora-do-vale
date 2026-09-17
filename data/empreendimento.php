<?php
// ============================================================
// BASE DE CONHECIMENTO (PHP)
// ============================================================
// >>> DADOS FICTICIOS - PROTOTIPO <<<
// Substitua os valores abaixo pelos dados reais do empreendimento
// quando forem fornecidos.
// ============================================================

return [
  'nome' => 'Residencial Aurora do Vale',
  'slogan' => 'Transformando sonhos em realidade',
  'localizacao' => [
    'cidade' => 'Nova Esperanca',
    'estado' => 'RO',
    'endereco' => 'Rua das Acacias, 1200',
    'bairro' => 'Bairro Aurora',
    'cep' => '76800-000',
  ],
  'modelos' => [
    [
      'nome' => 'Modelo Essencial',
      'area' => '48m2',
      'quartos' => 2,
      'banheiros' => 1,
      'vagas' => 1,
      'preco' => 'R$ 189.900',
      'parcela_estimada' => 'a partir de R$ 850/mes',
      'destaque' => [
        '2 quartos',
        'Sala de estar',
        'Cozinha planejada',
        'Vaga coberta',
        'Area externa',
      ],
    ],
    [
      'nome' => 'Modelo Plus',
      'area' => '58m2',
      'quartos' => 3,
      'suites' => 1,
      'banheiros' => 2,
      'vagas' => 1,
      'preco' => 'R$ 219.900',
      'parcela_estimada' => 'a partir de R$ 1.050/mes',
      'destaque' => [
        '3 quartos (1 suite)',
        'Sala ampla',
        'Cozinha planejada',
        'Vaga coberta',
        'Area externa',
      ],
    ],
  ],
  'pagamento' => [
    'fgts' => true,
    'entrada_facilitada' => true,
    'financiamento_prazo_maximo' => '30 anos',
    'observacao' => 'Condicoes sujeitas a analise de credito pela instituicao financeira.',
  ],
  'entrega' => [
    'prazo' => 'ate 12 meses apos assinatura do contrato',
    'acompanhamento' => 'Equipe acompanha todo o processo, da documentacao a entrega das chaves.',
  ],
  'caracteristicas' => [
    'Acabamento de qualidade',
    'Piso, azulejo e pintura inclusos',
    'Esquadrias modernas',
    'Projeto funcional e bem planejado',
  ],
  'infraestrutura' => [
    'Escolas publicas proximas',
    'Posto de saude',
    'Mercados e comerceios',
    'Transporte publico acessivel',
  ],
  'documentacao' => [
    'Documentos pessoais (RG, CPF)',
    'Comprovante de renda',
    'Comprovante de residencia',
    'Extrato do FGTS (se aplicavel)',
  ],
  'faq' => [
    [
      'pergunta' => 'Qual a renda minima para comprar?',
      'resposta' => 'Nao ha renda minima fixa. O financiamento e analisado individualmente pela instituicao financeira.',
    ],
    [
      'pergunta' => 'Qual o valor das parcelas?',
      'resposta' => 'As parcelas variam conforme o prazo e a entrada. Em media, comecam a partir de R$ 850 para o Modelo Essencial e R$ 1.050 para o Modelo Plus.',
    ],
    [
      'pergunta' => 'Posso usar o FGTS?',
      'resposta' => 'Sim! O FGTS pode ser utilizado para dar entrada ou amortizar o financiamento.',
    ],
    [
      'pergunta' => 'A casa vem com mobilia?',
      'resposta' => 'Nao. As casas sao entregues sem mobilia, apenas com acabamento basico (piso, azulejo, pintura, esquadrias).',
    ],
    [
      'pergunta' => 'O bairro tem escola e posto de saude perto?',
      'resposta' => 'Sim, o bairro possui escolas publicas, posto de saude, mercado e transportes proximos.',
    ],
  ],
  'observacoes' => [
    'Este e um prototipo com dados ficticios.',
    'Valores e enderecos sao ilustrativos.',
    'Todos os dados serao substituidos por informacoes reais quando disponiveis.',
  ],
];
