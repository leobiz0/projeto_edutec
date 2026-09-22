// Banco baseado no conteúdo do site InovaAI.
// correct: 0=A, 1=B, 2=C, 3=D. why: explicação após a resposta.
window.RUNNER_QUESTIONS = [
  {
    "category": "História da IA",
    "q": "Em qual década começou a história da Inteligência Artificial?",
    "a": [
      "1930",
      "1950",
      "1980",
      "2000"
    ],
    "correct": 1,
    "why": "Segundo a base InovaAI, a história da IA começou na década de 1950."
  },
  {
    "category": "História da IA",
    "q": "Quem apresentou o Teste de Turing?",
    "a": [
      "Alan Turing",
      "Albert Einstein",
      "Steve Jobs",
      "Tim Berners-Lee"
    ],
    "correct": 0,
    "why": "Alan Turing propôs o teste para avaliar comportamento inteligente semelhante ao humano."
  },
  {
    "category": "História da IA",
    "q": "Em qual evento o termo “Inteligência Artificial” foi oficialmente criado?",
    "a": [
      "Feira de Hannover",
      "Conferência de Dartmouth",
      "Olimpíadas de Londres",
      "Congresso de Viena"
    ],
    "correct": 1,
    "why": "O termo foi cunhado na Conferência de Dartmouth, em 1956."
  },
  {
    "category": "Inteligência Artificial",
    "q": "O que sistemas de IA procuram realizar?",
    "a": [
      "Apenas armazenar arquivos",
      "Tarefas que normalmente exigem inteligência humana",
      "Somente cálculos simples",
      "Apenas conectar computadores"
    ],
    "correct": 1,
    "why": "A IA realiza tarefas como aprendizado, raciocínio e reconhecimento de padrões."
  },
  {
    "category": "Inteligência Artificial",
    "q": "Qual destes é um desafio relacionado ao avanço da IA?",
    "a": [
      "Privacidade",
      "Cor do monitor",
      "Tamanho do teclado",
      "Velocidade da impressora"
    ],
    "correct": 0,
    "why": "A base destaca desafios relacionados à ética, privacidade e mercado de trabalho."
  },
  {
    "category": "Machine learning",
    "q": "O que é machine learning?",
    "a": [
      "Um editor de imagens",
      "Um método que aprende com dados",
      "Um tipo de cabo",
      "Uma rede social"
    ],
    "correct": 1,
    "why": "Machine learning automatiza a construção de modelos que aprendem com dados."
  },
  {
    "category": "Machine learning",
    "q": "O que modelos de machine learning identificam nos dados?",
    "a": [
      "Parafusos",
      "Padrões",
      "Cores da tela somente",
      "Senhas obrigatoriamente"
    ],
    "correct": 1,
    "why": "Os modelos analisam dados para identificar padrões e apoiar decisões."
  },
  {
    "category": "Machine learning",
    "q": "O que pode acontecer quando um modelo recebe novos dados?",
    "a": [
      "Ele pode se adaptar",
      "Ele sempre para de funcionar",
      "Ele apaga a internet",
      "Ele troca o computador"
    ],
    "correct": 0,
    "why": "O aspecto iterativo permite que modelos se adaptem ao serem expostos a novos dados."
  },
  {
    "category": "Deep learning",
    "q": "Deep learning também é chamado de…",
    "a": [
      "Aprendizagem profunda",
      "Aprendizagem impressa",
      "Memória virtual",
      "Automação manual"
    ],
    "correct": 0,
    "why": "Deep learning significa aprendizagem profunda."
  },
  {
    "category": "Deep learning",
    "q": "O deep learning utiliza várias…",
    "a": [
      "Tomadas elétricas",
      "Camadas de processamento",
      "Telas ao mesmo tempo",
      "Pastas vazias"
    ],
    "correct": 1,
    "why": "A aprendizagem profunda processa muitos dados por inúmeras camadas de algoritmos."
  },
  {
    "category": "Deep learning",
    "q": "Qual tarefa pode usar deep learning?",
    "a": [
      "Reconhecimento de voz",
      "Troca física de uma bateria",
      "Limpeza de uma tela",
      "Instalação de uma cadeira"
    ],
    "correct": 0,
    "why": "A base cita reconhecimento de voz, identificação de imagens e predições."
  },
  {
    "category": "Redes neurais",
    "q": "Em que as redes neurais artificiais são inspiradas?",
    "a": [
      "Motores de carros",
      "Neurônios humanos",
      "Satélites",
      "Cabos de rede"
    ],
    "correct": 1,
    "why": "As redes neurais se baseiam na arquitetura dos neurônios humanos."
  },
  {
    "category": "Redes neurais",
    "q": "Quais camadas aparecem em uma rede neural artificial?",
    "a": [
      "Entrada, oculta e saída",
      "Somente entrada",
      "Áudio e vídeo",
      "Superior e inferior"
    ],
    "correct": 0,
    "why": "A base descreve camada de entrada, saída e pelo menos uma camada oculta."
  },
  {
    "category": "Redes neurais",
    "q": "Como se chama o primeiro tipo de neurônio usado em uma rede neural?",
    "a": [
      "Pixel",
      "Perceptron",
      "Sensor",
      "Algoritmo azul"
    ],
    "correct": 1,
    "why": "O Perceptron foi o primeiro tipo de neurônio usado em uma RNA."
  },
  {
    "category": "Visão computacional",
    "q": "O que a visão computacional permite às máquinas?",
    "a": [
      "Interpretar informações visuais",
      "Sentir sabores",
      "Produzir eletricidade",
      "Trocar peças sozinhas"
    ],
    "correct": 0,
    "why": "Ela permite que máquinas “vejam” e interpretem imagens e vídeos."
  },
  {
    "category": "Visão computacional",
    "q": "Qual é uma etapa da visão computacional citada na base?",
    "a": [
      "Aquisição de imagens",
      "Impressão de documentos",
      "Criação de senhas",
      "Compra de equipamentos"
    ],
    "correct": 0,
    "why": "As etapas citadas são aquisição, processamento, análise e reconhecimento de padrões."
  },
  {
    "category": "Visão computacional",
    "q": "Em qual área a visão computacional pode reconhecer objetos e faces?",
    "a": [
      "Análise de imagens",
      "Contabilidade manual",
      "Carregamento elétrico",
      "Digitação"
    ],
    "correct": 0,
    "why": "Reconhecimento de objetos e faces é uma aplicação visual citada na base."
  },
  {
    "category": "Aplicações da IA",
    "q": "Na saúde, como a IA pode ajudar?",
    "a": [
      "Apoiando diagnósticos e decisões clínicas",
      "Eliminando todos os médicos",
      "Garantindo que ninguém adoeça",
      "Substituindo todo tratamento"
    ],
    "correct": 0,
    "why": "A IA pode apoiar diagnósticos, decisões clínicas, pesquisas e saúde pública."
  },
  {
    "category": "Aplicações da IA",
    "q": "Na indústria, a manutenção preditiva serve para…",
    "a": [
      "Prever falhas e reduzir custos",
      "Mudar a cor das máquinas",
      "Aumentar erros",
      "Interromper toda produção"
    ],
    "correct": 0,
    "why": "A manutenção preditiva ajuda a evitar falhas e diminuir custos."
  },
  {
    "category": "Aplicações da IA",
    "q": "Na educação, plataformas adaptativas podem…",
    "a": [
      "Ajustar conteúdos às necessidades do estudante",
      "Aplicar a mesma atividade para todos sempre",
      "Eliminar professores",
      "Impedir pesquisas"
    ],
    "correct": 0,
    "why": "A base explica que a IA pode personalizar o ensino conforme ritmo e necessidade."
  }
];
