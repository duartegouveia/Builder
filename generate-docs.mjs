import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType, TableBorders, convertInchesToTwip } from 'docx';
import fs from 'fs';

const FONT = 'Calibri';
const FONT_SIZE = 22; // 11pt in half-points
const HEADING_COLOR = '1F4E79';
const ACCENT_COLOR = '2E75B6';
const LIGHT_BG = 'D6E4F0';

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, font: FONT, size: 32, color: HEADING_COLOR })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, font: FONT, size: 28, color: ACCENT_COLOR })],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, font: FONT, size: 24, color: HEADING_COLOR })],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE, ...opts })],
  });
}

function boldPara(label, text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: label, bold: true, font: FONT, size: FONT_SIZE }),
      new TextRun({ text, font: FONT, size: FONT_SIZE }),
    ],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE })],
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}

// ============================================================
// DOCUMENT 1: REQUIREMENTS
// ============================================================
function generateRequirementsDoc() {
  const sections = [];

  // Title page
  sections.push(
    new Paragraph({ spacing: { before: 2000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'RELATION BUILDER', bold: true, font: FONT, size: 52, color: HEADING_COLOR })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'Documento de Requisitos', font: FONT, size: 36, color: ACCENT_COLOR })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'Descrição Funcional Detalhada e Justificação', font: FONT, size: 28, color: '666666' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: `Versão 1.1 — ${new Date().toLocaleDateString('pt-PT')}`, font: FONT, size: 22, color: '999999' })],
    }),
    emptyLine(),
  );

  // Table of Contents placeholder
  sections.push(heading1('Índice'));
  sections.push(para('1. Introdução'));
  sections.push(para('2. Estrutura de Dados e Modelo Relacional'));
  sections.push(para('3. Gestão de Estado e Instâncias'));
  sections.push(para('4. Visualização em Tabela'));
  sections.push(para('5. Vista de Cartões'));
  sections.push(para('6. Vista Pivot'));
  sections.push(para('7. Vista de Análise'));
  sections.push(para('8. Vista de IA'));
  sections.push(para('9. Vistas Guardadas'));
  sections.push(para('10. Filtragem'));
  sections.push(para('11. Ordenação'));
  sections.push(para('12. Agrupamento'));
  sections.push(para('13. Estatísticas por Coluna'));
  sections.push(para('14. Formatação Condicional'));
  sections.push(para('15. Binning (Discretização)'));
  sections.push(para('16. Operações sobre Linhas'));
  sections.push(para('17. Operações Multi-Registo'));
  sections.push(para('18. Diálogos de Seleção'));
  sections.push(para('19. Exportação'));
  sections.push(para('20. Importação'));
  sections.push(para('21. Verificação de Integridade'));
  sections.push(para('22. Navegação Hierárquica'));
  sections.push(para('23. Relações Aninhadas'));
  sections.push(para('24. Pesquisa Rápida'));
  sections.push(para('25. Paginação'));
  sections.push(para('26. Modos de Apresentação'));
  sections.push(para('27. Opções Configuráveis (rel_options)'));
  sections.push(para('28. Atalhos de Teclado'));
  sections.push(para('29. Responsividade e Interface'));
  sections.push(para('30. Colunas Derivadas'));
  sections.push(para('31. Log de Operações'));
  sections.push(para('32. Visibilidade de Colunas (columns_visible)'));
  sections.push(para('33. Produto Cartesiano'));
  sections.push(para('34. Remoção de Duplicados'));

  // 1. Introduction
  sections.push(heading1('1. Introdução'));
  sections.push(para('O Relation Builder é uma ferramenta avançada de gestão de dados relacionais construída como aplicação web com HTML, JavaScript vanilla e CSS standard. O seu objetivo principal é permitir a criação, manipulação, análise e visualização de dados tabulares com funcionalidades comparáveis a folhas de cálculo profissionais, mas integradas numa interface web leve e sem dependências de frameworks.'));
  sections.push(boldPara('Público-alvo: ', 'Utilizadores que necessitam de controlo preciso sobre relações de dados, desde analistas de dados até gestores de informação.'));
  sections.push(boldPara('Filosofia: ', 'Todas as instâncias de relação utilizam código parametrizado idêntico via initRelationInstance(), garantindo consistência e manutenibilidade.'));
  sections.push(para('A versão 1.1 introduz funcionalidades significativas: colunas derivadas para extração automática de componentes de datas, horas e métricas de texto; um sistema de log de operações para rastreabilidade e replay futuro; controlo granular de visibilidade e ordenação de colunas via columns_visible; produto cartesiano para expansão de relações aninhadas; remoção de duplicados; e operações de Row Number, Rank e Dense Rank para classificação de registos.'));

  // 2. Data Structure
  sections.push(heading1('2. Estrutura de Dados e Modelo Relacional'));
  sections.push(heading2('2.1 Formato da Relação'));
  sections.push(para('Cada relação é um objeto JSON com a seguinte estrutura:'));
  sections.push(bullet('columns: Objeto chave-valor onde as chaves são nomes de colunas e os valores são tipos (id, string, int, float, boolean, textarea, relation, date, datetime, time, select).'));
  sections.push(bullet('items: Array de arrays, onde cada sub-array representa uma linha com valores nas posições correspondentes às colunas.'));
  sections.push(bullet('options: Objeto com mapeamentos de valores para labels de apresentação (usado em colunas select e para formatação).'));
  sections.push(bullet('rel_options: Objeto com configurações globais da relação (editável, visibilidade de colunas, vistas disponíveis, etc.).'));
  sections.push(bullet('saved: Array de snapshots guardados da relação.'));
  sections.push(heading2('2.2 Tipos de Coluna Suportados'));
  sections.push(boldPara('id: ', 'Identificador único auto-gerado. Não editável pelo utilizador.'));
  sections.push(boldPara('string: ', 'Texto curto (input de linha única).'));
  sections.push(boldPara('int: ', 'Número inteiro.'));
  sections.push(boldPara('float: ', 'Número decimal.'));
  sections.push(boldPara('boolean: ', 'Valor verdadeiro/falso (checkbox).'));
  sections.push(boldPara('textarea: ', 'Texto longo multi-linha.'));
  sections.push(boldPara('relation: ', 'Relação aninhada (sub-tabela completa).'));
  sections.push(boldPara('date: ', 'Data (YYYY-MM-DD).'));
  sections.push(boldPara('datetime: ', 'Data e hora.'));
  sections.push(boldPara('time: ', 'Hora.'));
  sections.push(boldPara('select: ', 'Seleção de valor pré-definido com opções configuráveis.'));
  sections.push(heading2('2.3 Justificação'));
  sections.push(para('A diversidade de tipos garante que o sistema pode representar qualquer estrutura de dados do mundo real, desde registos simples até hierarquias complexas com relações aninhadas. O tipo "relation" permite profundidade ilimitada de aninhamento.'));

  // 3. State Management
  sections.push(heading1('3. Gestão de Estado e Instâncias'));
  sections.push(heading2('3.1 Estado Centralizado'));
  sections.push(para('O sistema utiliza um relationsRegistry e funções accessor para estado isolado e serializável (uiState) por instância. Cada instância de relação possui o seu próprio estado independente, incluindo:'));
  sections.push(bullet('filteredIndices: Índices após aplicação de filtros.'));
  sections.push(bullet('sortedIndices: Índices após aplicação de ordenação.'));
  sections.push(bullet('sortCriteria: Critérios de ordenação multi-coluna.'));
  sections.push(bullet('filters: Filtros ativos por coluna.'));
  sections.push(bullet('formatting: Regras de formatação condicional.'));
  sections.push(bullet('selectedRows: Conjunto de linhas selecionadas.'));
  sections.push(bullet('selectedColumns: Conjunto de colunas selecionadas.'));
  sections.push(bullet('currentPage, pageSize: Estado de paginação.'));
  sections.push(bullet('groupByColumns: Colunas de agrupamento.'));
  sections.push(bullet('pivotConfig: Configuração da tabela pivot.'));
  sections.push(bullet('quickSearch: Termo de pesquisa rápida.'));
  sections.push(heading2('3.2 Instâncias Parametrizadas'));
  sections.push(para('Todas as instâncias utilizam a mesma função initRelationInstance(container, relationData, options), recebendo um container DOM, os dados da relação e opções de configuração. Isto garante que:'));
  sections.push(bullet('O código é reutilizado para relações principais e aninhadas.'));
  sections.push(bullet('Cada instância tem estado completamente isolado.'));
  sections.push(bullet('Operações numa tabela aninhada não afetam a tabela pai.'));
  sections.push(heading2('3.3 Justificação'));
  sections.push(para('A arquitetura de estado isolado por instância é fundamental para suportar aninhamento ilimitado de relações sem conflitos. A serialização do uiState permite persistência de configurações entre sessões.'));

  // 4. Table View
  sections.push(heading1('4. Visualização em Tabela'));
  sections.push(heading2('4.1 Funcionalidades'));
  sections.push(bullet('Renderização completa de dados tabulares com cabeçalhos clicáveis para ordenação.'));
  sections.push(bullet('Edição inline de células quando a relação é editável.'));
  sections.push(bullet('Checkboxes de seleção multi-linha (configurável via show_multicheck).'));
  sections.push(bullet('Indicadores visuais de ordenação (▲/▼) com posição em ordenação multi-coluna.'));
  sections.push(bullet('Menu de contexto por coluna (clique direito) com acesso a todas as operações.'));
  sections.push(bullet('Menu de operações por linha (botão ⋯) com ações individuais e multi.'));
  sections.push(bullet('Estatísticas por coluna na linha de rodapé.'));
  sections.push(bullet('Formatação condicional visual (cores de fundo, texto, barras, ícones).'));
  sections.push(bullet('Suporte para tipos especiais: relações aninhadas como botões clicáveis, selects com opções, booleanos como checkboxes.'));
  sections.push(bullet('Linha de estatísticas configurável (show_stats) com count, min, max, mean, std dev, quartis.'));
  sections.push(bullet('Coluna de ordem natural (show_natural_order) mostrando índice original.'));
  sections.push(bullet('Coluna de tipo (show_column_kind) mostrando o tipo de cada coluna.'));
  sections.push(bullet('Container redimensionável com resize handle.'));
  sections.push(heading2('4.2 Justificação'));
  sections.push(para('A tabela é a vista mais importante para manipulação direta de dados. A edição inline reduz fricção. Os menus contextuais organizam operações avançadas sem sobrecarregar a interface principal.'));

  // 5. Cards View
  sections.push(heading1('5. Vista de Cartões'));
  sections.push(heading2('5.1 Funcionalidades'));
  sections.push(bullet('Apresentação em grelha de cartões individuais por registo.'));
  sections.push(bullet('Cada cartão mostra todos os campos com labels e valores.'));
  sections.push(bullet('Suporte para seleção multi-registo via checkboxes.'));
  sections.push(bullet('Navegação paginada com os mesmos controlos da tabela.'));
  sections.push(bullet('Ações multi-registo disponíveis via dropdown na navegação.'));
  sections.push(bullet('Duplo-clique para aceder a operações de linha.'));
  sections.push(heading2('5.2 Justificação'));
  sections.push(para('A vista de cartões oferece uma perspetiva visual alternativa, especialmente útil para registos com muitos campos ou quando o utilizador prefere ver cada registo como uma entidade completa em vez de uma linha numa tabela.'));

  // 6. Pivot View
  sections.push(heading1('6. Vista Pivot'));
  sections.push(heading2('6.1 Funcionalidades'));
  sections.push(bullet('Tabulação cruzada com seleção de dimensões (linhas e colunas).'));
  sections.push(bullet('Configuração de múltiplos valores com diferentes agregações.'));
  sections.push(bullet('Agregações suportadas: Count, Sum, Average, Median, Std Dev, % Total, % Row, % Col.'));
  sections.push(bullet('Totais por linha, por coluna e total geral.'));
  sections.push(bullet('Formatação de valores de dimensão usando options (labels).'));
  sections.push(bullet('Interface de configuração intuitiva com botão "Add Value" para múltiplas métricas.'));
  sections.push(heading2('6.2 Pivot Chart'));
  sections.push(para('Painel de gráfico integrado abaixo da tabela pivot, com as seguintes funcionalidades:'));
  sections.push(bullet('5 tipos de gráfico: barras verticais, barras horizontais, linhas, área, circular (pie).'));
  sections.push(bullet('Modos agrupado e empilhado para gráficos de barras.'));
  sections.push(bullet('Opções de gráfico tipo Excel: título, títulos de eixos, formatação de eixos com rotação de labels, labels de dados, barras de erro (±stddev), gridlines, legenda com posição configurável.'));
  sections.push(bullet('Linhas de tendência (trendlines) com ajuste automático ou manual: linear, polinomial 2.º e 3.º grau, exponencial, logarítmica. Seleção automática por melhor R² (coeficiente de determinação).'));
  sections.push(bullet('Apresentação opcional do R² e/ou da equação da linha de tendência no gráfico, cada uma controlada por checkbox independente.'));
  sections.push(bullet('Botões toggle para mostrar/ocultar independentemente a tabela e o painel do gráfico.'));
  sections.push(bullet('Download do gráfico em formato PNG (via canvas.toDataURL) e GIF (codificador LZW personalizado com quantização a 256 cores).'));
  sections.push(heading2('6.3 Justificação'));
  sections.push(para('Tabelas pivot são essenciais para análise de dados categóricos. A capacidade de configurar múltiplas agregações simultaneamente e visualizar percentagens permite análise multidimensional sem ferramentas externas. O Pivot Chart complementa a tabela com representação visual imediata, e as linhas de tendência com R² e equação permitem identificar e quantificar padrões nos dados diretamente no gráfico.'));

  // 7. Analysis View (unified from Correlation + Diagram)
  sections.push(heading1('7. Vista de Análise'));
  sections.push(para('A vista de Análise unifica todas as funcionalidades de análise estatística num único separador com 4 sub-separadores: Pairwise, Matrix, Clustering e Multivariate.'));
  sections.push(heading2('7.1 Pairwise (Análise por Pares)'));
  sections.push(para('Análise de correlação/associação entre pares de colunas com 24 métodos disponíveis:'));
  sections.push(bullet('Correlações paramétricas: Pearson (dados contínuos normais), Polyserial (contínuo × ordinal), Polychoric (dois ordinais), Biserial (contínuo × binário).'));
  sections.push(bullet('Correlações não-paramétricas: Spearman (rank), Kendall Tau-b (concordância), Point-Biserial (contínuo × binário natural), Rank-Biserial (ordinal × binário).'));
  sections.push(bullet('Associação categórica: Phi (2×2), Cramér\'s V (tabelas maiores), Tetrachoric (2 binários latentes), Lambda (redução proporcional do erro), Uncertainty Coefficient (entropia).'));
  sections.push(bullet('Concordância ordinal: Somers\' D (assimétrico), Gamma (pares concordantes/discordantes), Tau-c (tabelas retangulares), Blomqvist\'s Beta (concordância mediana).'));
  sections.push(bullet('Medidas de dependência: Eta² (variância explicada), Mutual Information (teoria da informação), Distance Correlation (dependência não-linear), Hoeffding\'s D (distribuição conjunta), Chatterjee\'s Xi (dependência funcional).'));
  sections.push(bullet('Similaridade: Cosine Similarity (ângulo entre vetores), Jaccard Index (conjuntos binários).'));
  sections.push(bullet('Auto-deteção do método mais apropriado baseado nos tipos de dados.'));
  sections.push(bullet('Análise de todos os pares simultaneamente ("Analyze All Pairs") com resultados tabulados.'));
  sections.push(bullet('Classificação de força: desprezável, fraca, moderada, forte, muito forte.'));
  sections.push(bullet('Scatter plot interativo para pares numéricos.'));
  sections.push(heading2('7.2 Matrix (Matrizes de Correlação)'));
  sections.push(bullet('Correlation Matrix: heatmap com todas as colunas numéricas, métodos Pearson/Spearman/Kendall selecionáveis.'));
  sections.push(bullet('Mutual Information Matrix: heatmap de informação mútua entre todas as colunas.'));
  sections.push(bullet('Escala de cores: azul(-1) → branco(0) → vermelho(+1) para correlações; branco(0) → vermelho(max) para MI.'));
  sections.push(bullet('Valores numéricos sobrepostos nas células.'));
  sections.push(heading2('7.3 Clustering (Agrupamento)'));
  sections.push(bullet('Visualização de similaridade usando t-SNE (t-Distributed Stochastic Neighbor Embedding).'));
  sections.push(bullet('Clustering automático por k-means com número configurável de clusters (2-20).'));
  sections.push(bullet('Parâmetros ajustáveis: perplexidade (5-100), iterações (100-2000).'));
  sections.push(bullet('Renderização em canvas HTML5 com cores distintas por cluster.'));
  sections.push(bullet('Popup de detalhes ao clicar num ponto do diagrama.'));
  sections.push(bullet('"Clusters as Column": exporta 3 colunas (cluster, cluster_x, cluster_y) para a relação.'));
  sections.push(heading2('7.4 Multivariate (Análise Multivariada)'));
  sections.push(bullet('PCA (Principal Component Analysis): eigenvalues, scree plot, loading matrix, scatter plot 2D dos dois primeiros componentes. Número de componentes configurável.'));
  sections.push(bullet('Factor Analysis: extração por eixos principais (principal axis factoring), comunalidades, loading matrix. Número de fatores configurável.'));
  sections.push(bullet('Canonical Correlation: seleção dual de grupos de colunas (X e Y), correlações canónicas e R² canónico.'));
  sections.push(bullet('MANOVA (Multivariate ANOVA): seleção de variáveis dependentes e fator de agrupamento, Wilks\' Lambda e Pillai\'s Trace com estatísticas F aproximadas.'));
  sections.push(heading2('7.5 Persistência de Resultados'));
  sections.push(para('Todos os resultados de análise são armazenados em uiState.analysisResult, permitindo que a Vista de IA aceda aos últimos resultados para fornecer interpretações e recomendações contextualizadas.'));
  sections.push(heading2('7.6 Justificação'));
  sections.push(para('A unificação das vistas de correlação e diagrama numa única vista de Análise com sub-separadores simplifica a navegação e agrupa logicamente todas as funcionalidades analíticas. Os 24 métodos pairwise cobrem todas as combinações possíveis de tipos de dados (contínuo, ordinal, nominal, binário). As matrizes permitem visão global das relações. O clustering revela padrões em dados multidimensionais. As análises multivariadas (PCA, Factor Analysis, Canonical Correlation, MANOVA) completam o toolkit estatístico para utilizadores avançados, sem necessidade de ferramentas externas.'));

  // 9. AI View
  sections.push(heading1('8. Vista de IA'));
  sections.push(heading2('8.1 Funcionalidades'));
  sections.push(bullet('Consultas em linguagem natural sobre os dados da relação.'));
  sections.push(bullet('Sugestões de filtros baseadas em IA com aplicação automática.'));
  sections.push(bullet('Entrada por voz com suporte para 16 idiomas.'));
  sections.push(bullet('Integração com backend via API /api/ai/analyze.'));
  sections.push(bullet('Seleção de idioma para reconhecimento de voz.'));
  sections.push(heading2('8.2 Justificação'));
  sections.push(para('A integração de IA democratiza a análise de dados, permitindo que utilizadores sem conhecimento técnico façam perguntas sobre os seus dados em linguagem natural. A entrada por voz adiciona acessibilidade e conveniência.'));

  // 10. Saved Views
  sections.push(heading1('9. Vistas Guardadas'));
  sections.push(heading2('9.1 Funcionalidades'));
  sections.push(bullet('Gravação de snapshots da relação com nome personalizável.'));
  sections.push(bullet('Quatro tipos de gravação: Formato (uiState + colunas), Registos (items), Ambos, Log de Operações (sequência de operações para replay).'));
  sections.push(bullet('Âmbito: Para Ti ou Para Todos.'));
  sections.push(bullet('Validação de nomes duplicados com confirmação de substituição.'));
  sections.push(bullet('Restauro via duplo-clique ou botão dedicado.'));
  sections.push(bullet('Eliminação com confirmação.'));
  sections.push(bullet('Metadados: data/hora de criação, tipo, âmbito.'));
  sections.push(bullet('Armazenamento no array saved do objeto relação.'));
  sections.push(heading2('9.2 Justificação'));
  sections.push(para('Vistas guardadas permitem preservar configurações complexas (filtros, ordenações, formatação) para reutilização futura, evitando a necessidade de reconfigurar a interface repetidamente. A distinção entre formato e registos dá flexibilidade.'));

  // 11. Filtering
  sections.push(heading1('10. Filtragem'));
  sections.push(heading2('10.1 Tipos de Filtro'));
  sections.push(boldPara('Filtro por Valores: ', 'Seleção/desseleção de valores individuais com checkboxes, pesquisa dentro dos valores, seleção total/nenhuma.'));
  sections.push(boldPara('Filtro por Comparação: ', 'Operadores de comparação (=, !=, >, <, >=, <=, entre, contém, começa com, termina com, regex) com suporte para tipos numéricos, texto e datas.'));
  sections.push(boldPara('Filtro por Texto: ', 'Critérios textuais avançados incluindo contém, não contém, começa com, termina com, expressão regular, maiúsculas/minúsculas.'));
  sections.push(boldPara('Filtro por Posição: ', 'Top N, Bottom N, Middle N registos baseado em valores numéricos. Disponível em dois modos: contagem absoluta (especificar número de registos) e percentagem (especificar percentagem do total, de 1% a 100%). No modo percentagem, o sistema calcula automaticamente o número de registos correspondente à percentagem indicada.'));
  sections.push(boldPara('Filtro por Outliers: ', 'Detecção e filtragem de outliers usando método IQR ou Z-score. Opções renomeadas na v1.1: "Choose Outliers" (anteriormente "Keep Outliers") e "Choose Not Outliers" (anteriormente "Remove Outliers") para maior clareza semântica.'));
  sections.push(boldPara('Filtro por Nulos: ', 'Mostrar apenas valores nulos ou não-nulos.'));
  sections.push(heading2('10.2 Funcionalidades Transversais'));
  sections.push(bullet('Indicadores visuais de colunas filtradas nos cabeçalhos.'));
  sections.push(bullet('Limpar filtros individualmente ou globalmente.'));
  sections.push(bullet('Diálogo de filtro com abas para cada tipo.'));
  sections.push(heading2('10.3 Justificação'));
  sections.push(para('A diversidade de métodos de filtragem permite abordar qualquer critério de seleção de dados. Filtros por posição e outliers são particularmente úteis para análise exploratória de dados, permitindo isolar rapidamente padrões extremos.'));

  // 12. Sorting
  sections.push(heading1('11. Ordenação'));
  sections.push(heading2('11.1 Funcionalidades'));
  sections.push(bullet('Ordenação por clique no cabeçalho da coluna (ascendente → descendente → sem ordenação).'));
  sections.push(bullet('Ordenação multi-coluna com Shift+clique para adicionar critérios.'));
  sections.push(bullet('Indicadores visuais de direção (▲/▼) com número de posição para multi-coluna.'));
  sections.push(bullet('Suporte para todos os tipos de dados com comparação adequada (numérica, textual, data).'));
  sections.push(bullet('Tratamento consistente de valores nulos (colocados no final).'));
  sections.push(heading2('11.2 Sort Panel'));
  sections.push(para('O Sort Panel é um diálogo dedicado acessível como primeira opção na secção Sort do menu de contexto da coluna (right-click no cabeçalho). Permite gestão completa dos critérios de ordenação:'));
  sections.push(bullet('Lista ordenada de critérios de ordenação com seleção de coluna e direção (ASC/DESC).'));
  sections.push(bullet('Acrescentar novos critérios no fundo da lista.'));
  sections.push(bullet('Remover critérios individuais ou limpar todos.'));
  sections.push(bullet('Reordenação de critérios via drag & drop.'));
  sections.push(bullet('Opções de ordenação por coluna com checkboxes (todas assinaladas por omissão):'));
  sections.push(bullet('  • Case Insensitive: ignora diferenças maiúsculas/minúsculas.'));
  sections.push(bullet('  • Accent Insensitive: ignora diferenças de acentuação.'));
  sections.push(bullet('  • Punctuation Insensitive: ignora pontuação na comparação.'));
  sections.push(bullet('  • Parse Numbers: trata sequências numéricas como números (file2 antes de file10).'));
  sections.push(heading2('11.3 Motor de Ordenação'));
  sections.push(para('A ordenação utiliza Intl.Collator com locale \'und\' (undetermined/neutro), que aplica as regras padrão do Unicode Collation Algorithm (UCA) sem viés para nenhuma língua específica. As opções por coluna mapeiam para os parâmetros do Intl.Collator:'));
  sections.push(bullet('sensitivity: \'base\' (case+accent insensitive), \'accent\' (case insensitive), \'case\' (accent insensitive), \'variant\' (tudo sensível).'));
  sections.push(bullet('numeric: true/false para ordenação natural de números em strings.'));
  sections.push(bullet('ignorePunctuation: true/false para ignorar pontuação.'));
  sections.push(heading2('11.4 Justificação'));
  sections.push(para('A ordenação multi-coluna é essencial para análise de dados complexos. A interação via Shift+clique segue padrões de interface conhecidos (Excel, bases de dados), reduzindo a curva de aprendizagem. O Sort Panel complementa esta funcionalidade com uma interface visual para gestão avançada de critérios, incluindo opções de comparação Unicode que permitem ordenação correta de textos multilíngues.'));

  // 13. Grouping
  sections.push(heading1('12. Agrupamento'));
  sections.push(heading2('12.1 Funcionalidades'));
  sections.push(bullet('Agrupamento por uma ou mais colunas.'));
  sections.push(bullet('Painel de grupo com breadcrumbs de navegação.'));
  sections.push(bullet('Drill-down interativo: clicar num grupo filtra para mostrar apenas esses registos.'));
  sections.push(bullet('Contagem de registos por grupo.'));
  sections.push(bullet('Suporte para agrupamento hierárquico (múltiplos níveis).'));
  sections.push(bullet('Navegação de volta via breadcrumbs.'));
  sections.push(heading2('12.2 Group by ALL Columns'));
  sections.push(para('Para além do agrupamento individual por coluna ("Group by this column"), existe a opção "Group by ALL columns" que agrupa simultaneamente por todas as colunas da relação, excluindo as colunas do kind id.'));
  sections.push(bullet('Diferença principal: O agrupamento individual ("Group by this column") remove a coluna agrupada das colunas visíveis na tabela. O "Group by ALL columns" mantém todas as colunas visíveis, servindo como uma agregação de valores únicos.'));
  sections.push(bullet('Colunas do kind id são excluídas do agrupamento por serem identificadores únicos, tornando o agrupamento por elas sem significado analítico.'));
  sections.push(heading2('12.3 Restrições'));
  sections.push(bullet('A opção Group By está desativada no menu de contexto para colunas do kind id, pois sendo valores únicos por definição, o agrupamento por estas colunas não produz resultados úteis.'));
  sections.push(heading2('12.4 Justificação'));
  sections.push(para('O agrupamento permite exploração top-down de grandes conjuntos de dados, facilitando a compreensão da distribuição e estrutura dos dados sem filtros complexos. A opção "Group by ALL" é particularmente útil para identificar registos duplicados ou padrões de combinações de valores, funcionando como um DISTINCT sobre todas as colunas.'));

  // 14. Statistics
  sections.push(heading1('13. Estatísticas por Coluna'));
  sections.push(heading2('13.1 Funcionalidades'));
  sections.push(bullet('Painel de estatísticas com: contagem, valores únicos, nulos, mínimo, máximo, média, desvio padrão.'));
  sections.push(bullet('Quartis (Q1, mediana, Q3) e intervalo interquartil (IQR).'));
  sections.push(bullet('Box plot visual com deteção de outliers.'));
  sections.push(bullet('Histograma de distribuição de valores.'));
  sections.push(bullet('Testes de normalidade: Shapiro-Wilk, D\'Agostino-Pearson, Anderson-Darling, Kolmogorov-Smirnov, Jarque-Bera.'));
  sections.push(bullet('Indicação de p-valor e decisão sobre normalidade.'));
  sections.push(bullet('Estatísticas sumárias na linha de rodapé da tabela (configurável).'));
  sections.push(heading2('13.2 Violin Plot'));
  sections.push(para('Complementarmente ao box plot, o sistema oferece um violin plot que pode ser ativado/desativado por checkbox (ativo por omissão). O violin plot sobrepõe-se ao box plot, combinando a informação dos quartis com a distribuição completa dos dados.'));
  sections.push(boldPara('O que é um Violin Plot: ', 'Um violin plot é uma visualização estatística que combina um box plot com uma estimação de densidade por kernel (KDE). A largura da forma ("violino") em cada ponto vertical representa a densidade de dados nesse valor — zonas mais largas indicam maior concentração de valores, zonas mais estreitas indicam valores raros.'));
  sections.push(boldPara('Como ler: ', 'A forma simétrica do violino mostra a distribuição dos dados: uma forma larga e achatada indica distribuição uniforme; uma forma estreita com pico central indica forte concentração; múltiplos "bicos" (distribuição bimodal ou multimodal) indicam subgrupos nos dados.'));
  sections.push(boldPara('Vantagem sobre o box plot isolado: ', 'O box plot mostra apenas quartis e outliers, perdendo informação sobre a forma da distribuição. Dois conjuntos de dados com quartis idênticos podem ter distribuições completamente diferentes (normal vs. bimodal, por exemplo). O violin plot revela estas diferenças.'));
  sections.push(boldPara('Estimação por Kernel (KDE): ', 'A curva é calculada usando uma estimação de densidade por kernel gaussiano. O bandwidth (largura de banda) é calculado automaticamente pela regra de Silverman, que equilibra suavização e detalhe. Valores extremos terão menor densidade, enquanto concentrações de dados criam picos visíveis.'));
  sections.push(boldPara('Badge informativo (i): ', 'Um ícone (i) junto à checkbox fornece uma explicação interativa do violin plot, incluindo como interpretá-lo e a sua relação com o box plot.'));
  sections.push(heading2('13.3 Justificação'));
  sections.push(para('Estatísticas descritivas completas são essenciais para análise exploratória. Os testes de normalidade informam a escolha de métodos estatísticos adequados (paramétricos vs. não-paramétricos). Box plots e histogramas fornecem compreensão visual imediata da distribuição. O violin plot complementa o box plot revelando a forma completa da distribuição, sendo particularmente útil para identificar distribuições multimodais, assimetrias e concentrações que não são visíveis nos quartis isolados.'));

  // 15. Conditional Formatting
  sections.push(heading1('14. Formatação Condicional'));
  sections.push(heading2('14.1 Funcionalidades'));
  sections.push(bullet('Escala de cores com legenda visual e 8 paletas: Blue-Red, Green-Yellow, Purple-Orange, Cool, Warm, Rainbow, Grayscale, Viridis.'));
  sections.push(bullet('Barras de dados sobrepostas na célula.'));
  sections.push(bullet('Ícones condicionais (setas, círculos, flags, estrelas, etc.).'));
  sections.push(bullet('Colorir resultados atuais (filtrados) com escala de cores.'));
  sections.push(bullet('Legenda de escala de cores com valores min/max.'));
  sections.push(bullet('Limpar formatação por coluna.'));
  sections.push(heading2('14.2 Paletas de Cores e Contraste'));
  sections.push(para('As 8 paletas de cores foram criadas com uma lógica de design intencional:'));
  sections.push(bullet('Pastel: cores suaves de baixa saturação para fundos não-intrusivos. Todas usam texto preto (contraste elevado sobre fundo claro).'));
  sections.push(bullet('Vivid: cores saturadas e vibrantes para destaque visual forte. Combinação de texto preto e branco conforme a luminância de cada cor.'));
  sections.push(bullet('Dark: cores profundas de baixa luminosidade para temas escuros. Todas usam texto branco (contraste elevado sobre fundo escuro).'));
  sections.push(bullet('Neutral: escala de cinzentos, do claro ao escuro, para informação hierárquica sem distração cromática.'));
  sections.push(bullet('Warm: gradiente de amarelo a vermelho, representando escalas de intensidade/calor/urgência.'));
  sections.push(bullet('Cool: gradiente de ciano claro a azul-escuro, representando escalas de frescura/calma/profundidade.'));
  sections.push(bullet('Danger: gradiente de amarelo a púrpura, passando por laranja e vermelho, para escalas de severidade/alerta.'));
  sections.push(bullet('Highlight: espectro cromático completo (vermelho → violeta) para codificação categórica com máxima distinção.'));
  sections.push(para('Cálculo de contraste: O contraste entre a cor de fundo e a cor de texto (preto ou branco) é calculado segundo a norma WCAG 2.1 (Web Content Accessibility Guidelines). A métrica utilizada é o Contrast Ratio, definido como (L1 + 0.05) / (L2 + 0.05), onde L1 e L2 são as luminâncias relativas da cor mais clara e da cor mais escura, respetivamente. A luminância relativa é calculada linearizando os canais sRGB (se C ≤ 0.04045: C/12.92, caso contrário: ((C+0.055)/1.055)^2.4) e aplicando os coeficientes ITU-R BT.709: L = 0.2126×R + 0.7152×G + 0.0722×B.'));
  sections.push(para('Níveis de contraste WCAG:'));
  sections.push(bullet('AA Large Text (mínimo aceitável): Contrast Ratio ≥ 3:1 — para texto de tamanho grande (≥ 18pt ou ≥ 14pt negrito).'));
  sections.push(bullet('AA Normal Text (mínimo recomendado): Contrast Ratio ≥ 4.5:1 — para texto de tamanho normal.'));
  sections.push(bullet('AAA Large Text: Contrast Ratio ≥ 4.5:1 — nível elevado para texto grande.'));
  sections.push(bullet('AAA Normal Text (ideal): Contrast Ratio ≥ 7:1 — nível máximo de acessibilidade para texto normal.'));
  sections.push(para('Cada cor nas paletas apresenta, via tooltip, o seu Contrast Ratio e o nível WCAG correspondente. O indicador "T" (branco) nas amostras de cor identifica as cores escuras onde será usado texto branco. Esta informação está igualmente acessível através do badge (ⓘ) nos diálogos de seleção de cor.'));
  sections.push(heading2('14.3 Justificação'));
  sections.push(para('A formatação condicional transforma dados numéricos em informação visual imediata. As 8 paletas suportam diferentes necessidades de contraste e acessibilidade, desde cores suaves (Pastel) até cores de alto impacto (Vivid, Highlight). A conformidade com WCAG 2.1 garante que o texto permanece legível sobre qualquer cor de fundo, atendendo critérios de acessibilidade internacionais. Barras de dados e ícones complementam a escala de cores para diferentes tipos de visualização.'));

  // 16. Binning / Bucketing
  sections.push(heading1('15. Binning / Bucketing (Discretização)'));
  sections.push(heading2('15.1 Funcionalidades de Binning'));
  sections.push(bullet('Discretização de colunas numéricas em intervalos.'));
  sections.push(bullet('Número de bins configurável.'));
  sections.push(bullet('Apresentação como intervalos (ex: "10-20") nos valores da tabela.'));
  sections.push(bullet('Interação com filtros por valores (filtragem por bin).'));
  
  sections.push(bullet('Menu renomeado na v1.1: "Binning / Bucketing" para maior clareza terminológica.'));
  sections.push(heading2('15.2 Row Number / Rank / Dense Rank (v1.1)'));
  sections.push(para('A secção Binning / Bucketing inclui agora três operações de classificação de registos:'));
  sections.push(boldPara('Row Number: ', 'Adiciona uma nova coluna inteira com numeração sequencial (1, 2, 3, ...) baseada na ordem de ordenação atual. Cada linha recebe um número único.'));
  sections.push(boldPara('Rank: ', 'Adiciona uma nova coluna inteira que classifica as linhas pelo valor da coluna de contexto. Empates recebem o mesmo rank, com gaps subsequentes (ex: 1, 2, 2, 4).'));
  sections.push(boldPara('Dense Rank: ', 'Similar ao Rank mas sem gaps entre classificações. Empates recebem o mesmo rank e o próximo rank distinto é consecutivo (ex: 1, 2, 2, 3).'));
  sections.push(heading2('15.3 Justificação'));
  sections.push(para('O binning simplifica a análise de dados contínuos, permitindo agrupamento e filtragem por intervalos. As operações de Row Number, Rank e Dense Rank permitem classificação e numeração de registos sem necessidade de cálculos manuais, seguindo padrões SQL standard que os utilizadores analíticos conhecem.'));

  // 17. Row Operations
  sections.push(heading1('16. Operações sobre Linhas'));
  sections.push(heading2('16.1 Operações Individuais'));
  sections.push(boldPara('Ver (View): ', 'Visualização formatada de todos os campos do registo em modo só-leitura.'));
  sections.push(boldPara('Editar (Edit): ', 'Formulário de edição com inputs tipados para cada campo.'));
  sections.push(boldPara('Copiar (Copy): ', 'Duplicação do registo com novo ID auto-gerado.'));
  sections.push(boldPara('Novo (New): ', 'Criação de registo vazio com ID auto-gerado.'));
  sections.push(boldPara('Eliminar (Delete): ', 'Remoção com confirmação.'));
  sections.push(boldPara('Formulário Papel (Paper Form): ', 'Visualização do registo em formato imprimível com campos e valores.'));
  
  sections.push(heading2('16.2 Justificação'));
  sections.push(para('As operações sobre linhas cobrem todo o ciclo de vida de um registo. O formulário em papel (Paper Form) serve para ser pré-impresso, permitindo que a organização continue a operar e a recolher dados temporariamente em papel caso o sistema informático não esteja disponível. Esta funcionalidade aumenta a resiliência da organização a falhas de eletricidade ou falhas do sistema informático, garantindo a continuidade operacional independentemente da disponibilidade tecnológica.'));

  // 18. Multi-Record Operations
  sections.push(heading1('17. Operações Multi-Registo'));
  sections.push(heading2('17.1 Operações'));
  sections.push(boldPara('Multi View: ', 'Visualização simultânea de múltiplos registos selecionados.'));
  sections.push(boldPara('Multi Edit: ', 'Edição simultânea de múltiplos registos com painel sincronizado.'));
  sections.push(boldPara('Multi Copy: ', 'Duplicação de todos os registos selecionados.'));
  sections.push(boldPara('Multi Delete: ', 'Eliminação em massa com confirmação e contagem.'));
  sections.push(boldPara('Group Edit: ', 'Aplicação de um valor a um campo específico em todos os registos selecionados.'));
  sections.push(boldPara('Merge: ', 'Fusão de múltiplos registos num único com controlo campo-a-campo sobre qual valor manter.'));
  sections.push(boldPara('Scrolling Multi-Panel: ', 'Visualização lado-a-lado com scroll sincronizado para comparação de registos.'));
  sections.push(heading2('17.2 Justificação'));
  sections.push(para('Operações multi-registo são essenciais para eficiência em conjuntos de dados grandes. O merge com controlo campo-a-campo resolve o problema comum de dados duplicados. O scroll sincronizado facilita a comparação visual.'));

  // 19. Selection Dialogs
  sections.push(heading1('18. Diálogos de Seleção'));
  sections.push(heading2('18.1 Select One'));
  sections.push(para('Abre um diálogo com cópia da relação (uiState limpo). Duplo-clique numa linha retorna o ID. O resultado é enviado para console.log, textarea.output_textarea_json e div.output_div_json.'));
  sections.push(heading2('18.2 Select Many'));
  sections.push(para('Similar a Select One mas com multicheck ativado. Ao fechar retorna array de IDs das linhas selecionadas.'));
  sections.push(heading2('18.3 Choose Many'));
  sections.push(para('Duas cópias da relação empilhadas: fonte (todos os itens) e alvo (vazio). Duplo-clique na fonte copia para alvo. Duplo-clique no alvo remove. Ao fechar retorna array de IDs do alvo. Inclui pesquisa integrada.'));
  sections.push(heading2('18.4 Justificação'));
  sections.push(para('Os diálogos de seleção permitem integração com sistemas externos, funcionando como componentes reutilizáveis de escolha. A abordagem de Choose Many com duas listas é particularmente intuitiva para seleção de subconjuntos.'));

  // 20. Export
  sections.push(heading1('19. Exportação'));
  sections.push(heading2('19.1 Funcionalidades'));
  sections.push(bullet('Âmbito: todos os registos, selecionados (checked), ou linha selecionada.'));
  sections.push(bullet('A opção "Linha selecionada" apenas é mostrada quando existe efetivamente uma linha selecionada/highlighted na relação.'));
  sections.push(bullet('A ação "Export to File" está inativa (mostra aviso) quando a relação tem zero linhas.'));
  sections.push(bullet('Formatos: CSV, Excel XML, XML, Word/HTML, PDF/HTML.'));
  sections.push(bullet('Templates server-side com interpolação de variáveis.'));
  sections.push(bullet('Templates armazenados em client/public/export/ organizados por nome de relação e formato.'));
  sections.push(bullet('API endpoints: /api/export/templates (lista) e /api/export/template/:path (conteúdo).'));
  sections.push(bullet('Proteção contra path traversal na API.'));
  sections.push(bullet('Download direto ou abertura em nova aba.'));
  sections.push(heading2('19.2 Justificação'));
  sections.push(para('A exportação multi-formato garante interoperabilidade com outras ferramentas. O sistema de templates permite personalização de formatos de saída sem alteração de código. A proteção contra path traversal é uma medida de segurança essencial.'));

  // 21. Import
  sections.push(heading1('20. Importação'));
  sections.push(heading2('20.1 Funcionalidades'));
  sections.push(bullet('Upload via drag-and-drop ou clique.'));
  sections.push(bullet('Auto-deteção de formato: CSV, TSV, JSON, XML, HTML, Excel XML.'));
  sections.push(bullet('Suporte multi-tabela com dropdown de seleção.'));
  sections.push(bullet('Preview dos dados importados antes de confirmação.'));
  sections.push(bullet('Mapeamento inteligente de colunas por similaridade de nomes.'));
  sections.push(bullet('Conversão automática de tipos (int, float, boolean).'));
  sections.push(bullet('Modo de edição de texto com valores tab-separated.'));
  sections.push(bullet('Atribuição automática de IDs.'));
  sections.push(bullet('Mensagem de erro clara para formato .xlsx binário (não suportado).'));
  sections.push(heading2('20.2 Justificação'));
  sections.push(para('A importação flexível permite integrar dados de diversas fontes. A auto-deteção e mapeamento inteligente reduzem o esforço manual. O preview previne importações incorretas.'));

  // 22. Integrity Check
  sections.push(heading1('21. Verificação de Integridade'));
  sections.push(heading2('21.1 Funcionalidades'));
  sections.push(bullet('Validação do campo "pot" da relação.'));
  sections.push(bullet('Verificação de chaves de atributos conhecidas.'));
  sections.push(bullet('Validação de tipos de coluna contra KNOWN_COLUMN_KINDS.'));
  sections.push(bullet('Verificação de comprimentos de arrays de items.'));
  sections.push(bullet('Consistência de tipos de valores (validação int, float, boolean).'));
  sections.push(bullet('Deteção de IDs duplicados.'));
  sections.push(bullet('Validação de propriedades rel_options.'));
  sections.push(bullet('Verificação recursiva de relações aninhadas.'));
  sections.push(bullet('Resultados em diálogo estilizado com categorias: erro, aviso, info.'));
  sections.push(heading2('21.2 Justificação'));
  sections.push(para('A verificação de integridade é uma salvaguarda contra corrupção de dados. A verificação recursiva garante consistência em toda a hierarquia de relações. A categorização de resultados permite priorizar correções.'));

  // 23. Hierarchical Navigation
  sections.push(heading1('22. Navegação Hierárquica'));
  sections.push(heading2('22.1 Funcionalidades'));
  sections.push(bullet('Ativação via rel_options.show_hierarchy com especificação de hierarchy_column.'));
  sections.push(bullet('Navegação em árvore baseada em relações pai-filho.'));
  sections.push(bullet('Filtragem automática ao navegar para um nó: mostra apenas os filhos diretos do nó atual.'));
  sections.push(bullet('Valor raiz configurável (hierarchy_root_value): define o topo da hierarquia acima do qual não é permitido navegar.'));
  sections.push(heading2('22.2 Breadcrumb de Navegação'));
  sections.push(para('À medida que se desce na hierarquia, é apresentado um breadcrumb que mostra o caminho percorrido desde a raiz até um nível acima da posição atual. Cada elemento do breadcrumb é clicável, permitindo saltar diretamente para ter como pai o elemento escolhido.'));
  sections.push(bullet('Formato de cada elemento: nome do elemento seguido de contadores (#N1 >> #N2), onde N1 é o número de filhos diretos (nível imediatamente abaixo) e N2 é o total de descendentes em todos os níveis.'));
  sections.push(bullet('Badge informativo (i): Um único ícone explicativo descreve o significado dos números e como funciona o painel de navegação hierárquica.'));
  sections.push(heading2('22.3 Visualização de Descendentes'));
  sections.push(para('Por omissão, a navegação hierárquica mostra apenas os elementos imediatamente abaixo do nó atual (filhos diretos). Existe uma opção para alternar e ver todos os descendentes a partir do elemento atual, independentemente da profundidade.'));
  sections.push(bullet('Quando ativada a visualização de todos os descendentes, a coluna parent (hierarchy_column) torna-se automaticamente visível na tabela, permitindo identificar a relação pai-filho de cada registo.'));
  sections.push(heading2('22.4 Configuração de Inicialização'));
  sections.push(boldPara('hierarchy_root_value: ', 'Define o topo absoluto da hierarquia. O utilizador não pode navegar acima deste valor. Se vazio, considera como raiz os elementos com parent vazio ou null.'));
  sections.push(boldPara('hierarchy_initial_value: ', 'Define o ponto de entrada inicial na hierarquia ao carregar a relação. Não precisa de ser o mesmo que hierarchy_root_value — pode ser qualquer descendente. Se vazio, assume hierarchy_root_value como ponto inicial. Se ambos forem vazios, mostra todos os elementos com parent vazio ou null.'));
  sections.push(heading2('22.5 Colunas Derivadas de Hierarquia'));
  sections.push(para('No menu de contexto do cabeçalho da coluna designada como hierarchy_column, na secção Column, estão disponíveis três operações para gerar novas colunas baseadas na estrutura hierárquica:'));
  sections.push(boldPara('hierarchy_ascendants: ', 'Nova coluna do kind relation contendo, para cada registo, uma sub-relação com as colunas id e parent preenchidas com todos os ascendentes até ao hierarchy_root_value. Permite aceder rapidamente à linhagem completa de qualquer elemento.'));
  sections.push(boldPara('hierarchy_descendants: ', 'Nova coluna do kind relation contendo, para cada registo, uma sub-relação com as colunas id e parent preenchidas com todos os descendentes do elemento. Permite visualizar toda a sub-árvore de qualquer nó.'));
  sections.push(boldPara('hierarchy_path: ', 'Nova coluna do kind string contendo o caminho concatenado desde o elemento até ao hierarchy_root_value. Um input permite configurar o separador entre cada valor (por omissão " > "). Exemplo: "Raiz > Categoria > Subcategoria > Elemento".'));
  sections.push(heading2('22.6 Justificação'));
  sections.push(para('A navegação hierárquica é essencial para dados com estrutura em árvore (categorias, organogramas, taxonomias). O breadcrumb com contadores oferece orientação espacial e dimensionamento rápido da sub-árvore. A visualização de todos os descendentes complementa a navegação nível-a-nível para casos em que se pretende uma visão global. As colunas derivadas permitem materializar relações hierárquicas como dados manipuláveis, facilitando análises e exportações.'));

  // 24. Nested Relations
  sections.push(heading1('23. Relações Aninhadas'));
  sections.push(heading2('23.1 Funcionalidades'));
  sections.push(bullet('Colunas do tipo "relation" contêm sub-relações completas.'));
  sections.push(bullet('Abertura em diálogo modal ou painel lateral/inferior (conforme single_item_mode).'));
  sections.push(bullet('Cada sub-relação é uma instância completa com todas as funcionalidades.'));
  sections.push(bullet('Profundidade ilimitada de aninhamento.'));
  sections.push(bullet('Cleanup automático de instâncias ao fechar diálogos.'));
  sections.push(bullet('Opções por defeito aplicadas automaticamente a sub-relações.'));
  sections.push(heading2('23.2 Justificação'));
  sections.push(para('O aninhamento ilimitado de relações permite modelar estruturas de dados arbitrariamente complexas. A utilização do mesmo código parametrizado garante consistência e reduz manutenção.'));

  // 25. Quick Search
  sections.push(heading1('24. Pesquisa Rápida'));
  sections.push(heading2('24.1 Funcionalidades'));
  sections.push(bullet('Campo de pesquisa na barra de vistas.'));
  sections.push(bullet('Filtragem em tempo real enquanto o utilizador digita.'));
  sections.push(bullet('Pesquisa em todos os campos de cada registo.'));
  sections.push(bullet('Botão de limpar pesquisa.'));
  sections.push(bullet('Disponível nas vistas de tabela e cartões.'));
  sections.push(heading2('24.2 Justificação'));
  sections.push(para('A pesquisa rápida é a forma mais imediata de encontrar registos específicos, complementando os filtros avançados para casos de uso simples.'));

  // 26. Pagination
  sections.push(heading1('25. Paginação'));
  sections.push(heading2('25.1 Funcionalidades'));
  sections.push(bullet('Tamanhos de página: 10, 20, 50, 100, All.'));
  sections.push(bullet('Navegação: primeira, anterior, próxima, última.'));
  sections.push(bullet('Indicador de página atual e total.'));
  sections.push(bullet('Contagem de linhas totais e selecionadas.'));
  sections.push(bullet('Desativação automática de botões em limites.'));
  sections.push(heading2('25.2 Justificação'));
  sections.push(para('A paginação é essencial para performance e usabilidade com grandes conjuntos de dados, evitando renderização de milhares de linhas simultaneamente.'));

  // 27. Display Modes
  sections.push(heading1('26. Modos de Apresentação'));
  sections.push(heading2('26.1 Funcionalidades'));
  sections.push(bullet('Dialog (modal): Conteúdo de detalhe abre em popup sobre a tabela.'));
  sections.push(bullet('Right (painel lateral): Conteúdo abre em painel à direita da tabela.'));
  sections.push(bullet('Bottom (painel inferior): Conteúdo abre em painel abaixo da tabela.'));
  sections.push(bullet('Configurável via rel_options.single_item_mode.'));
  sections.push(bullet('Transição suave com scroll automático para o painel inferior.'));
  sections.push(heading2('26.2 Justificação'));
  sections.push(para('Diferentes modos de apresentação acomodam diferentes preferências de trabalho e tamanhos de ecrã. O painel lateral permite comparação simultânea com a tabela; o modal foca atenção num único registo.'));

  // 28. rel_options
  sections.push(heading1('27. Opções Configuráveis (rel_options)'));
  sections.push(heading2('27.1 Lista Completa'));
  sections.push(boldPara('editable: ', 'Ativa/desativa edição inline de células.'));
  sections.push(boldPara('show_multicheck: ', 'Mostra/oculta checkboxes de seleção multi-linha.'));
  sections.push(boldPara('show_natural_order: ', 'Mostra/oculta coluna de ordem natural.'));
  sections.push(boldPara('show_id: ', 'Mostra/oculta coluna de ID.'));
  sections.push(boldPara('show_column_kind: ', 'Mostra/oculta indicador de tipo de coluna.'));
  sections.push(boldPara('show_stats: ', 'Mostra/oculta linha de estatísticas no rodapé.'));
  sections.push(boldPara('show_hierarchy: ', 'Ativa/desativa navegação hierárquica.'));
  sections.push(boldPara('hierarchy_column: ', 'Coluna usada para relações pai-filho na hierarquia.'));
  sections.push(boldPara('hierarchy_root_value: ', 'Valor que identifica os nós raiz na navegação hierárquica (valor do campo pai para elementos de topo).'));
  sections.push(boldPara('single_item_mode: ', 'Modo de apresentação de detalhe (dialog, right, bottom).'));
  sections.push(boldPara('label_field_top_down: ', 'Campo usado como label em breadcrumbs e títulos.'));
  sections.push(boldPara('OnDoubleClickAction: ', 'Ação ao duplo-clicar numa linha (view, edit).'));
  sections.push(boldPara('general_view_options: ', 'Array de vistas disponíveis (Table, Cards, Pivot, Correlation, Diagram, AI, Saved, Structure).'));
  sections.push(boldPara('general_always_visible_options: ', 'Array de ações sempre visíveis na barra de vistas.'));
  sections.push(boldPara('general_line_options: ', 'Array de operações disponíveis no menu de linha.'));
  sections.push(boldPara('general_multi_options: ', 'Array de operações multi-registo disponíveis.'));
  sections.push(heading2('27.2 Justificação'));
  sections.push(para('A configurabilidade granular permite adaptar a interface a diferentes casos de uso sem alterar código. Um formulário de entrada simples pode ocultar vistas avançadas; uma aplicação de análise pode ativar todas as funcionalidades.'));

  // 29. Keyboard Shortcuts
  sections.push(heading1('28. Atalhos de Teclado'));
  sections.push(heading2('28.1 Funcionalidades'));
  sections.push(bullet('Badge informativo (ℹ) na barra de vistas com tooltip de atalhos.'));
  sections.push(bullet('Ctrl+clique para seleção de colunas.'));
  sections.push(bullet('Shift+clique para ordenação multi-coluna.'));
  sections.push(bullet('Navegação por teclado nos menus.'));
  sections.push(heading2('28.2 Justificação'));
  sections.push(para('Atalhos de teclado aumentam a produtividade de utilizadores avançados, reduzindo a dependência do rato para operações frequentes.'));

  // 30. Responsiveness
  sections.push(heading1('29. Responsividade e Interface'));
  sections.push(heading2('29.1 Funcionalidades'));
  sections.push(bullet('Design responsivo com CSS media queries.'));
  sections.push(bullet('Design tokens via CSS custom properties (variáveis).'));
  sections.push(bullet('Toast notifications para feedback de ações.'));
  sections.push(bullet('Diálogos modais com overlay para operações complexas.'));
  sections.push(bullet('Container redimensionável para a tabela.'));
  sections.push(bullet('Indicadores visuais de estado (filtros ativos, ordenação, seleção).'));
  sections.push(heading2('29.2 Justificação'));
  sections.push(para('Uma interface responsiva e informativa melhora a experiência do utilizador em diferentes dispositivos. O feedback visual constante garante que o utilizador compreende o estado atual dos dados e das operações aplicadas.'));

  // 31. Derived Columns
  sections.push(heading1('30. Colunas Derivadas'));
  sections.push(heading2('30.1 Descrição'));
  sections.push(para('O sistema de colunas derivadas (v1.1) permite extrair automaticamente componentes de valores existentes, criando novas colunas com dados calculados. As extrações são organizadas por tipo de dados de origem.'));
  sections.push(heading2('30.2 Extrações de Data'));
  sections.push(bullet('Year: Extrai o ano (ex: 2025).'));
  sections.push(bullet('Month: Extrai o mês (1-12).'));
  sections.push(bullet('Day: Extrai o dia do mês (1-31).'));
  sections.push(bullet('Weekday: Extrai o dia da semana (0=Domingo, 6=Sábado).'));
  sections.push(bullet('Quarter: Extrai o trimestre (1-4).'));
  sections.push(bullet('Semester: Extrai o semestre (1-2).'));
  sections.push(bullet('Day of Year: Extrai o dia do ano (1-366).'));
  sections.push(bullet('Week of Year: Extrai a semana do ano (1-53).'));
  sections.push(bullet('ISO Week: Extrai a semana ISO do ano.'));
  sections.push(heading2('30.3 Extrações de Hora'));
  sections.push(bullet('Hour: Extrai a hora (0-23).'));
  sections.push(bullet('Minute: Extrai o minuto (0-59).'));
  sections.push(bullet('Second: Extrai o segundo (0-59).'));
  sections.push(bullet('AM/PM: Extrai indicador AM ou PM.'));
  sections.push(bullet('Hour12: Extrai a hora em formato 12h (1-12).'));
  sections.push(heading2('30.4 Arredondamento de Float'));
  sections.push(bullet('Round: Arredonda valores float para um número especificado de casas decimais.'));
  sections.push(heading2('30.5 Métricas de String'));
  sections.push(bullet('Length: Número de caracteres do texto.'));
  sections.push(bullet('Bytes: Tamanho em bytes (codificação UTF-8).'));
  sections.push(bullet('Flesch Reading Ease: Índice de legibilidade Flesch (0-100, quanto maior mais fácil de ler).'));
  sections.push(bullet('Flesch-Kincaid Grade Level: Nível escolar estimado para compreensão do texto.'));
  sections.push(bullet('Sentence Count: Número de frases no texto.'));
  sections.push(heading2('30.6 Justificação'));
  sections.push(para('As colunas derivadas eliminam a necessidade de cálculos manuais ou fórmulas para extrações comuns. A organização por tipo de dados (data, hora, float, string) facilita a descoberta de funcionalidades. As métricas de legibilidade (Flesch) são um diferenciador para análise de conteúdo textual.'));

  // 32. Operation Log
  sections.push(heading1('31. Log de Operações'));
  sections.push(heading2('31.1 Descrição'));
  sections.push(para('Todas as operações mutantes sobre a relação são registadas no array relation.log[] como objetos declarativos com a estrutura {pot: "relation_op", timestamp, op, ...params}. Este sistema permite rastreabilidade completa e prepara o caminho para funcionalidades futuras de replay e undo.'));
  sections.push(heading2('31.2 Funcionalidades'));
  sections.push(bullet('Registo automático de mais de 40 tipos de operações.'));
  sections.push(bullet('Cada entrada inclui timestamp ISO para auditoria temporal.'));
  sections.push(bullet('Parâmetros completos da operação são preservados para replay futuro.'));
  sections.push(bullet('O log é serializado como parte da relação e pode ser guardado/restaurado via Vistas Guardadas (tipo "Log de Operações").'));
  sections.push(bullet('Operações registadas incluem: adição/remoção de linhas, edição de células, ordenação, filtragem, binning, merge, group edit, formatação condicional, entre outras.'));
  sections.push(heading2('31.3 Justificação'));
  sections.push(para('O log de operações é fundamental para auditoria e rastreabilidade. A estrutura declarativa dos registos permite que no futuro se implementem funcionalidades de undo/redo e replay de sequências de operações, transformando o Relation Builder numa ferramenta com histórico completo de transformações.'));

  // 33. Columns Visible
  sections.push(heading1('32. Visibilidade de Colunas (columns_visible)'));
  sections.push(heading2('32.1 Descrição'));
  sections.push(para('O objeto columns_visible no uiState controla a visibilidade, largura e ordem de apresentação das colunas na tabela. Este sistema substitui a abordagem anterior de mostrar todas as colunas por defeito.'));
  sections.push(heading2('32.2 Funcionalidades'));
  sections.push(bullet('Visibilidade: uma chave presente no objeto significa coluna visível; chave ausente significa coluna oculta.'));
  sections.push(bullet('Largura: o valor de cada chave representa a largura em pixels (0 = largura automática).'));
  sections.push(bullet('Ordem: a ordem das chaves no objeto determina a ordem de apresentação das colunas.'));
  sections.push(bullet('Diálogo Show/Hide Columns com checkboxes para cada coluna, inputs de largura e drag & drop para reordenação.'));
  sections.push(bullet('Ações "Hide Column" e "Hide Selected Columns" no submenu Column do menu de contexto.'));
  sections.push(bullet('Redimensionamento de colunas via bordas arrastáveis nos cabeçalhos da tabela.'));
  sections.push(bullet('Reordenação de colunas via drag & drop diretamente nos cabeçalhos da tabela.'));
  sections.push(bullet('O submenu Column reorganiza as operações anteriormente em "Column Selection", incluindo as ações de remover colunas.'));
  sections.push(heading2('32.3 Justificação'));
  sections.push(para('O controlo granular de visibilidade de colunas é essencial para relações com muitas colunas. A combinação de diálogo dedicado, ações no menu de contexto e interação direta nos cabeçalhos (resize e reorder) oferece múltiplos caminhos de interação para diferentes preferências de utilizador. A persistência via uiState garante que as configurações são mantidas entre sessões.'));

  // 34. Cartesian Product
  sections.push(heading1('33. Produto Cartesiano'));
  sections.push(heading2('33.1 Descrição'));
  sections.push(para('O produto cartesiano permite expandir relações aninhadas, fazendo cross-join dos registos da sub-relação com os registos da relação principal.'));
  sections.push(heading2('33.2 Variantes'));
  sections.push(boldPara('Cartesian Product (THIS): ', 'Realiza cross-join entre a coluna de relação aninhada selecionada e a relação atual. Cada linha da relação principal é multiplicada pelo número de linhas da sub-relação correspondente, com as colunas da sub-relação adicionadas como novas colunas.'));
  sections.push(boldPara('Cartesian Product (ALL): ', 'Realiza cross-join de TODAS as colunas do tipo relation na relação atual, expandindo todas as sub-relações simultaneamente.'));
  sections.push(heading2('33.3 Justificação'));
  sections.push(para('O produto cartesiano é uma operação fundamental em álgebra relacional. Permite "achatamento" (flattening) de estruturas aninhadas para análise tabular, facilitando operações como filtragem, ordenação e pivot sobre dados que estavam em sub-relações.'));

  // 35. Remove Duplicates
  sections.push(heading1('34. Remoção de Duplicados'));
  sections.push(heading2('34.1 Descrição'));
  sections.push(para('A operação de remoção de duplicados identifica e remove linhas exatamente iguais da relação, mantendo apenas uma instância de cada combinação única de valores.'));
  sections.push(heading2('34.2 Funcionalidades'));
  sections.push(bullet('Comparação exata de todos os campos (exceto ID) para identificar duplicados.'));
  sections.push(bullet('Preservação da primeira ocorrência de cada grupo de duplicados.'));
  sections.push(bullet('Feedback ao utilizador com contagem de linhas removidas.'));
  sections.push(bullet('Operação registada no log de operações.'));
  sections.push(heading2('34.3 Justificação'));
  sections.push(para('Dados duplicados são um problema frequente em conjuntos de dados importados ou resultantes de operações como produto cartesiano. A remoção automática de duplicados complementa o merge manual para casos mais simples onde os registos são exatamente iguais.'));

  return new Document({
    sections: [{ children: sections }],
  });
}

// ============================================================
// DOCUMENT 2: USAGE TESTS
// ============================================================
function generateTestsDoc() {
  const sections = [];

  sections.push(
    new Paragraph({ spacing: { before: 2000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'RELATION BUILDER', bold: true, font: FONT, size: 52, color: HEADING_COLOR })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'Testes de Utilização', font: FONT, size: 36, color: ACCENT_COLOR })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: `Versão 1.1 — ${new Date().toLocaleDateString('pt-PT')}`, font: FONT, size: 22, color: '999999' })],
    }),
    emptyLine(),
  );

  function testCase(id, title, precondition, steps, expected) {
    const items = [];
    items.push(heading3(`TC-${id}: ${title}`));
    items.push(boldPara('Pré-condição: ', precondition));
    items.push(para('Passos:', { bold: true }));
    steps.forEach((s, i) => items.push(bullet(`${i + 1}. ${s}`)));
    items.push(boldPara('Resultado Esperado: ', expected));
    items.push(emptyLine());
    return items;
  }

  // Section 1: Data Structure
  sections.push(heading1('1. Estrutura de Dados'));
  sections.push(...testCase('001', 'Carregamento de Relação JSON',
    'Aplicação aberta na página Relation Builder com dados demo carregados.',
    ['Verificar que a textarea JSON mostra uma estrutura com "columns", "items", "options" e "rel_options".', 'Verificar que a tabela é renderizada com cabeçalhos correspondentes às chaves de "columns".', 'Verificar que o número de linhas na tabela corresponde ao comprimento de "items".'],
    'A relação é carregada e apresentada corretamente com todos os campos visíveis.'
  ));
  sections.push(...testCase('002', 'Tipos de Coluna',
    'Relação carregada com colunas de tipos variados (id, string, int, float, boolean, select, date).',
    ['Verificar que colunas "id" mostram valores numéricos não editáveis.', 'Verificar que colunas "boolean" mostram checkboxes.', 'Verificar que colunas "select" mostram dropdowns com opções configuradas.', 'Verificar que colunas "int" e "float" aceitam apenas valores numéricos.', 'Verificar que colunas "date" mostram input de data.'],
    'Cada tipo de coluna é renderizado com o input adequado e validação correta.'
  ));

  // Section 2: State Management
  sections.push(heading1('2. Gestão de Estado'));
  sections.push(...testCase('003', 'Isolamento de Estado entre Instâncias',
    'Relação com uma coluna do tipo "relation" contendo sub-relação.',
    ['Abrir a sub-relação clicando no botão da célula.', 'Aplicar um filtro na sub-relação.', 'Verificar que a tabela principal não foi afetada pelo filtro.', 'Fechar a sub-relação.', 'Verificar que a tabela principal mantém o seu estado original.'],
    'Os filtros da sub-relação não afetam a tabela principal. O estado é completamente isolado.'
  ));

  // Section 3: Table View
  sections.push(heading1('3. Vista de Tabela'));
  sections.push(...testCase('004', 'Renderização da Tabela',
    'Relação carregada com dados.',
    ['Verificar que todos os cabeçalhos de coluna são visíveis.', 'Verificar que as linhas de dados são apresentadas com valores corretos.', 'Verificar que a paginação mostra o número correto de linhas.'],
    'Tabela renderizada com todos os dados, cabeçalhos e paginação corretos.'
  ));
  sections.push(...testCase('005', 'Edição Inline',
    'Relação com editable=true.',
    ['Clicar num campo de texto numa célula.', 'Alterar o valor.', 'Clicar fora da célula (blur).', 'Verificar que o valor foi atualizado na textarea JSON.'],
    'O valor é atualizado tanto na célula como no JSON da relação.'
  ));
  sections.push(...testCase('006', 'Menu de Contexto de Coluna',
    'Vista de tabela ativa.',
    ['Clicar com o botão direito num cabeçalho de coluna.', 'Verificar que o menu aparece com opções: Sort, Filter, Format, Statistics, Binning, Group By.', 'Selecionar uma opção e verificar que a funcionalidade correspondente é ativada.'],
    'Menu de contexto aparece com todas as opções e cada uma funciona corretamente.'
  ));
  sections.push(...testCase('007', 'Seleção de Linhas com Checkboxes',
    'Relação com show_multicheck=true.',
    ['Verificar que checkboxes aparecem na primeira coluna.', 'Selecionar 3 linhas usando checkboxes.', 'Verificar que o contador na paginação atualiza para "3 checked".', 'Clicar no checkbox do cabeçalho para selecionar todas.', 'Verificar que todas as linhas da página ficam selecionadas.'],
    'Seleção funciona individualmente e em massa, com contadores atualizados.'
  ));

  // Section 4: Cards View
  sections.push(heading1('4. Vista de Cartões'));
  sections.push(...testCase('008', 'Apresentação em Cartões',
    'Relação carregada com dados.',
    ['Clicar no separador "Cards" na barra de vistas.', 'Verificar que cada registo é apresentado como um cartão individual.', 'Verificar que cada cartão mostra todos os campos com labels e valores.', 'Verificar que a navegação paginada funciona.'],
    'Registos apresentados como cartões com todos os campos visíveis e navegação funcional.'
  ));

  // Section 5: Pivot View
  sections.push(heading1('5. Vista Pivot'));
  sections.push(...testCase('009', 'Geração de Tabela Pivot',
    'Relação carregada com dados numéricos e categóricos.',
    ['Clicar no separador "Pivot".', 'Selecionar uma coluna para linhas (ex: categoria).', 'Selecionar uma coluna para colunas (ex: região).', 'Clicar "Generate Pivot".', 'Verificar que a tabela pivot é gerada com totais por linha e coluna.'],
    'Tabela pivot gerada com tabulação cruzada correta e totais.'
  ));
  sections.push(...testCase('010', 'Múltiplas Agregações Pivot',
    'Vista Pivot ativa com dimensões selecionadas.',
    ['Clicar "+ Add" para adicionar um valor.', 'Selecionar uma coluna numérica e agregação "Sum".', 'Adicionar outro valor com agregação "Average".', 'Clicar "Generate Pivot".', 'Verificar que ambas as métricas aparecem para cada célula.'],
    'Tabela pivot mostra múltiplas métricas por célula conforme configurado.'
  ));

  // Section 6: Correlation View
  sections.push(heading1('6. Vista de Correlação'));
  sections.push(...testCase('011', 'Análise de Correlação entre Par',
    'Relação com pelo menos 2 colunas numéricas.',
    ['Clicar no separador "Correlation".', 'Selecionar Column X (ex: idade).', 'Selecionar Column Y (ex: salário).', 'Deixar método em "Auto-detect".', 'Clicar "Calculate".', 'Verificar que o resultado mostra coeficiente, método usado, força e p-valor.'],
    'Resultado de correlação apresentado com todos os detalhes estatísticos.'
  ));
  sections.push(...testCase('012', 'Análise de Todos os Pares',
    'Relação com múltiplas colunas numéricas e categóricas.',
    ['Na vista Correlation, clicar "Analyze All Pairs".', 'Verificar que uma matriz de correlação é gerada.', 'Verificar que diferentes métodos são usados conforme os tipos de dados.'],
    'Matriz de correlação completa com métodos auto-detetados apropriados.'
  ));

  // Section 7: Diagram View
  sections.push(heading1('7. Vista de Diagrama'));
  sections.push(...testCase('013', 'Visualização t-SNE',
    'Relação com dados numéricos.',
    ['Clicar no separador "Diagram".', 'Definir número de clusters (ex: 5).', 'Clicar "Run t-SNE".', 'Aguardar o cálculo (indicador de progresso visível).', 'Verificar que o canvas mostra pontos coloridos agrupados.'],
    'Diagrama t-SNE renderizado com pontos coloridos por cluster.'
  ));
  sections.push(...testCase('014', 'Popup de Detalhes no Diagrama',
    'Diagrama t-SNE renderizado com dados.',
    ['Clicar num ponto do diagrama.', 'Verificar que um popup aparece com os dados do registo correspondente.', 'Clicar fora do popup para fechar.'],
    'Popup com detalhes do registo aparece e fecha corretamente.'
  ));

  // Section 8: AI View
  sections.push(heading1('8. Vista de IA'));
  sections.push(...testCase('015', 'Consulta em Linguagem Natural',
    'Relação carregada com dados e API de IA configurada.',
    ['Clicar no separador "AI".', 'Digitar uma pergunta (ex: "Qual é a média de salários?").', 'Clicar no botão enviar.', 'Aguardar resposta.', 'Verificar que a resposta é apresentada na área de resposta.'],
    'Resposta da IA apresentada com informação relevante sobre os dados.'
  ));
  sections.push(...testCase('016', 'Entrada por Voz',
    'Vista AI ativa, browser com suporte a SpeechRecognition.',
    ['Selecionar o idioma desejado no dropdown.', 'Clicar no botão de microfone.', 'Verificar que o botão indica gravação (classe "recording").', 'Falar a pergunta.', 'Verificar que o texto é transcrito no campo de input.'],
    'Voz transcrita para texto no campo de pergunta.'
  ));

  // Section 9: Saved Views
  sections.push(heading1('9. Vistas Guardadas'));
  sections.push(...testCase('017', 'Guardar Vista',
    'Relação com filtros e ordenação aplicados.',
    ['Clicar no separador "Saved".', 'Escrever um nome (ex: "Minha Vista").', 'Selecionar tipo "Formato".', 'Selecionar âmbito "Para Ti".', 'Clicar "Guardar".', 'Verificar que a vista aparece na lista com nome, tipo, âmbito e data.'],
    'Vista guardada aparece na lista com metadados corretos.'
  ));
  sections.push(...testCase('018', 'Restaurar Vista Guardada',
    'Pelo menos uma vista guardada existente.',
    ['Na lista de vistas guardadas, fazer duplo-clique na vista.', 'Verificar que os filtros e ordenação são restaurados.', 'Verificar que a tabela é atualizada conforme o snapshot.'],
    'Estado da relação restaurado conforme o snapshot guardado.'
  ));
  sections.push(...testCase('019', 'Eliminar Vista Guardada',
    'Pelo menos uma vista guardada existente.',
    ['Clicar no botão de eliminar ao lado da vista.', 'Confirmar a eliminação no diálogo de confirmação.', 'Verificar que a vista desaparece da lista.'],
    'Vista eliminada com sucesso após confirmação.'
  ));
  sections.push(...testCase('020', 'Validação de Nome Duplicado',
    'Uma vista guardada com nome "Teste" existente.',
    ['Tentar guardar outra vista com o nome "Teste".', 'Verificar que aparece diálogo de confirmação sobre substituição.', 'Confirmar substituição.', 'Verificar que a lista tem apenas uma vista "Teste" com dados atualizados.'],
    'Diálogo de confirmação apresentado; vista substituída após confirmação.'
  ));

  // Section 10: Filtering
  sections.push(heading1('10. Filtragem'));
  sections.push(...testCase('021', 'Filtro por Valores',
    'Vista de tabela com dados.',
    ['Clicar direito num cabeçalho de coluna string.', 'Selecionar "Filter" no menu.', 'Na aba "Values", desselecionar alguns valores.', 'Clicar "Apply Filter".', 'Verificar que apenas as linhas com valores selecionados são visíveis.', 'Verificar que o indicador de filtro aparece no cabeçalho.'],
    'Tabela filtrada mostrando apenas valores selecionados com indicador visual.'
  ));
  sections.push(...testCase('022', 'Filtro por Comparação',
    'Vista de tabela com coluna numérica.',
    ['Abrir filtro para uma coluna numérica.', 'Selecionar aba "Comparison".', 'Escolher operador ">" e valor "50".', 'Aplicar filtro.', 'Verificar que apenas linhas com valor > 50 são visíveis.'],
    'Filtro de comparação aplicado corretamente com resultados filtrados.'
  ));
  sections.push(...testCase('023', 'Filtro por Posição (Top/Bottom N)',
    'Vista de tabela com coluna numérica.',
    ['Abrir filtro para uma coluna numérica.', 'Selecionar aba "Position".', 'Escolher "Top" e valor "5".', 'Aplicar filtro.', 'Verificar que apenas os 5 maiores valores são visíveis.'],
    'Top 5 registos por valor numérico apresentados.'
  ));
  sections.push(...testCase('024', 'Filtro por Outliers',
    'Vista de tabela com coluna numérica com distribuição variada.',
    ['Abrir filtro para uma coluna numérica.', 'Selecionar aba "Outliers".', 'Escolher método IQR.', 'Aplicar filtro.', 'Verificar que apenas outliers (valores além de Q1-1.5*IQR ou Q3+1.5*IQR) são visíveis.'],
    'Outliers detetados e filtrados corretamente pelo método IQR.'
  ));
  sections.push(...testCase('025', 'Filtro por Texto com Regex',
    'Vista de tabela com coluna de texto.',
    ['Abrir filtro para coluna de texto.', 'Selecionar aba "Text".', 'Escolher critério "Regex".', 'Inserir padrão (ex: "^A.*o$").', 'Aplicar filtro.', 'Verificar que apenas textos que correspondem ao regex são visíveis.'],
    'Filtro regex aplicado com resultados corretos.'
  ));
  sections.push(...testCase('026', 'Limpar Todos os Filtros',
    'Relação com múltiplos filtros aplicados.',
    ['Verificar que múltiplos cabeçalhos mostram indicador de filtro.', 'Utilizar a opção "Clear Filters" (via menu de coluna ou ação).', 'Verificar que todos os filtros são removidos.', 'Verificar que todos os registos são novamente visíveis.'],
    'Todos os filtros removidos e dados completos restaurados.'
  ));

  // Section 11: Sorting
  sections.push(heading1('11. Ordenação'));
  sections.push(...testCase('027', 'Ordenação Simples',
    'Vista de tabela com dados.',
    ['Clicar no cabeçalho de uma coluna.', 'Verificar que os dados são ordenados ascendentemente (▲ visível).', 'Clicar novamente no mesmo cabeçalho.', 'Verificar que os dados são ordenados descendentemente (▼ visível).', 'Clicar uma terceira vez.', 'Verificar que a ordenação é removida.'],
    'Ciclo de ordenação: ascendente → descendente → sem ordenação funciona corretamente.'
  ));
  sections.push(...testCase('028', 'Ordenação Multi-Coluna',
    'Vista de tabela com dados.',
    ['Clicar no cabeçalho da coluna A (ordena por A).', 'Shift+clicar no cabeçalho da coluna B.', 'Verificar que os dados são ordenados por A e depois por B.', 'Verificar que os indicadores mostram ▲₁ e ▲₂ respetivamente.'],
    'Ordenação multi-coluna aplicada com indicadores de posição.'
  ));
  sections.push(...testCase('028b', 'Sort Panel',
    'Vista de tabela com dados.',
    ['Right-click no cabeçalho de uma coluna.', 'Expandir secção Sort.', 'Verificar que "Sort Panel" é a primeira opção.', 'Clicar em "Sort Panel".', 'Verificar que o diálogo Sort Panel abre.', 'Clicar em "+ Acrescentar critério" para adicionar um critério.', 'Verificar que aparece uma linha com seleção de coluna, direção (ASC/DESC), e 4 checkboxes (Case Insensitive, Accent Insensitive, Punctuation Insensitive, Parse Numbers) todas assinaladas.', 'Adicionar um segundo critério.', 'Arrastar o segundo critério para cima do primeiro (drag & drop).', 'Verificar que a ordem é trocada.', 'Mudar a direção de um critério para DESC.', 'Desmarcar checkbox "Case Insensitive" num critério.', 'Clicar "Aplicar".', 'Verificar que a tabela é reordenada conforme os critérios definidos.', 'Verificar que os indicadores de ordenação multi-coluna aparecem nos cabeçalhos.'],
    'Sort Panel permite gestão completa de critérios de ordenação multi-coluna com opções avançadas de comparação Unicode via Intl.Collator.'
  ));

  // Section 12: Grouping
  sections.push(heading1('12. Agrupamento'));
  sections.push(...testCase('029', 'Agrupamento por Coluna',
    'Vista de tabela com coluna categórica.',
    ['Clicar direito no cabeçalho da coluna categórica.', 'Selecionar "Group By".', 'Verificar que um painel de grupos aparece com valores distintos.', 'Clicar num grupo.', 'Verificar que a tabela mostra apenas registos desse grupo.', 'Verificar que breadcrumbs permitem voltar ao nível anterior.'],
    'Agrupamento funcional com drill-down e navegação por breadcrumbs.'
  ));

  // Section 13: Statistics
  sections.push(heading1('13. Estatísticas'));
  sections.push(...testCase('030', 'Painel de Estatísticas',
    'Vista de tabela com coluna numérica.',
    ['Clicar no botão de estatísticas (📊) na coluna ou via menu de contexto.', 'Verificar que o painel mostra: contagem, min, max, média, desvio padrão.', 'Verificar que quartis (Q1, mediana, Q3) são apresentados.', 'Verificar que o box plot é renderizado graficamente.', 'Verificar que o histograma de distribuição é apresentado.'],
    'Painel de estatísticas completo com todos os indicadores e visualizações.'
  ));
  sections.push(...testCase('031', 'Testes de Normalidade',
    'Painel de estatísticas aberto para coluna numérica.',
    ['Verificar que os testes de normalidade são apresentados: Shapiro-Wilk, D\'Agostino-Pearson, Anderson-Darling, Kolmogorov-Smirnov, Jarque-Bera.', 'Verificar que cada teste mostra estatística, p-valor e conclusão.', 'Verificar que a conclusão indica se a distribuição é normal ou não.'],
    'Testes de normalidade apresentados com todos os detalhes e conclusões.'
  ));

  // Section 14: Conditional Formatting
  sections.push(heading1('14. Formatação Condicional'));
  sections.push(...testCase('032', 'Escala de Cores',
    'Vista de tabela com coluna numérica.',
    ['Clicar direito no cabeçalho da coluna → Format → Color Scale.', 'Selecionar paleta (ex: Blue-Red).', 'Verificar que as células são coloridas de azul (min) a vermelho (max).', 'Verificar que a legenda de escala aparece.'],
    'Escala de cores aplicada com gradiente correto e legenda visível.'
  ));
  sections.push(...testCase('033', 'Barras de Dados',
    'Vista de tabela com coluna numérica.',
    ['Via menu de formatação, selecionar "Data Bars".', 'Verificar que barras horizontais proporcionais aparecem nas células.', 'Verificar que o valor máximo tem barra completa e o mínimo tem barra mínima.'],
    'Barras de dados renderizadas proporcionalmente aos valores.'
  ));
  sections.push(...testCase('034', 'Ícones Condicionais',
    'Vista de tabela com coluna numérica.',
    ['Via menu de formatação, selecionar "Icons".', 'Verificar que ícones (setas, círculos ou flags) aparecem nas células.', 'Verificar que ícones diferentes correspondem a intervalos de valores diferentes.'],
    'Ícones condicionais aplicados com diferenciação visual por valor.'
  ));

  // Section 15: Row Operations
  sections.push(heading1('15. Operações sobre Linhas'));
  sections.push(...testCase('035', 'Ver Registo',
    'Vista de tabela com dados.',
    ['Clicar no botão ⋯ de uma linha.', 'Selecionar "View".', 'Verificar que o registo é apresentado em formato legível com todos os campos.', 'Verificar botão de imprimir disponível.'],
    'Registo apresentado em modo só-leitura com todos os campos.'
  ));
  sections.push(...testCase('036', 'Editar Registo',
    'Relação editável.',
    ['Clicar no botão ⋯ de uma linha → "Edit".', 'Modificar valores nos campos do formulário.', 'Clicar "Gravar".', 'Verificar que os valores são atualizados na tabela e no JSON.'],
    'Registo editado e gravado com sucesso.'
  ));
  sections.push(...testCase('037', 'Copiar Registo',
    'Vista de tabela com dados.',
    ['Clicar no botão ⋯ de uma linha → "Copy".', 'Verificar que uma nova linha é adicionada com os mesmos valores mas ID diferente.', 'Verificar que a contagem de registos incrementou.'],
    'Registo duplicado com novo ID e valores idênticos.'
  ));
  sections.push(...testCase('038', 'Eliminar Registo',
    'Vista de tabela com dados.',
    ['Clicar no botão ⋯ de uma linha → "Delete".', 'Confirmar a eliminação.', 'Verificar que a linha desapareceu da tabela.', 'Verificar que a contagem de registos decrementou.'],
    'Registo eliminado após confirmação.'
  ));
  sections.push(...testCase('039', 'Novo Registo',
    'Vista de tabela.',
    ['Clicar no botão ⋯ de qualquer linha → "New".', 'Verificar que uma nova linha vazia é adicionada com ID auto-gerado.', 'Verificar que campos numéricos têm valor 0 e texto vazio.'],
    'Novo registo criado com valores por defeito e ID único.'
  ));

  // Section 16: Multi-Record Operations
  sections.push(heading1('16. Operações Multi-Registo'));
  sections.push(...testCase('040', 'Multi View',
    'Múltiplas linhas selecionadas via checkboxes.',
    ['Selecionar 3 linhas.', 'Escolher ação "Multi View" no dropdown de ações.', 'Verificar que os 3 registos são apresentados simultaneamente.'],
    'Visualização simultânea de múltiplos registos selecionados.'
  ));
  sections.push(...testCase('041', 'Multi Delete',
    'Múltiplas linhas selecionadas.',
    ['Selecionar 3 linhas.', 'Escolher ação "Multi Delete".', 'Confirmar eliminação no diálogo.', 'Verificar que as 3 linhas foram removidas.', 'Verificar que a contagem decrementou por 3.'],
    'Eliminação em massa com confirmação e atualização correta.'
  ));
  sections.push(...testCase('042', 'Group Edit',
    'Múltiplas linhas selecionadas.',
    ['Selecionar 5 linhas.', 'Escolher ação "Group Edit".', 'Selecionar coluna e definir novo valor.', 'Confirmar.', 'Verificar que todas as 5 linhas têm o novo valor nessa coluna.'],
    'Valor aplicado uniformemente a todas as linhas selecionadas.'
  ));
  sections.push(...testCase('043', 'Merge de Registos',
    'Múltiplas linhas selecionadas (mínimo 2).',
    ['Selecionar 2 linhas.', 'Escolher ação "Merge".', 'No diálogo de merge, escolher campo-a-campo qual valor manter.', 'Confirmar merge.', 'Verificar que resta apenas 1 registo com os valores escolhidos.'],
    'Merge realizado com controlo campo-a-campo e resultado correto.'
  ));

  // Section 17: Selection Dialogs
  sections.push(heading1('17. Diálogos de Seleção'));
  sections.push(...testCase('044', 'Select One',
    'Ação "Select One" disponível.',
    ['Clicar em "Select One" nas ações visíveis.', 'Verificar que o diálogo abre com a relação completa.', 'Fazer duplo-clique numa linha.', 'Verificar que o diálogo fecha e o ID é retornado (console.log e outputs).'],
    'ID da linha selecionada retornado corretamente.'
  ));
  sections.push(...testCase('045', 'Select Many',
    'Ação "Select Many" disponível.',
    ['Clicar em "Select Many".', 'Selecionar múltiplas linhas via checkboxes.', 'Fechar o diálogo.', 'Verificar que array de IDs é retornado.'],
    'Array de IDs das linhas selecionadas retornado.'
  ));
  sections.push(...testCase('046', 'Choose Many',
    'Ação "Choose Many" disponível.',
    ['Clicar em "Choose Many".', 'Verificar dois painéis: fonte (com todos os itens) e alvo (vazio).', 'Duplo-clicar em 3 itens na fonte.', 'Verificar que aparecem no alvo.', 'Duplo-clicar num item no alvo para remover.', 'Fechar o diálogo.', 'Verificar que array com 2 IDs é retornado.'],
    'Choose Many funciona com drag entre listas e retorna IDs corretos.'
  ));

  // Section 18: Export
  sections.push(heading1('18. Exportação'));
  sections.push(...testCase('047', 'Exportação CSV',
    'Relação com dados.',
    ['Abrir diálogo de exportação via ação.', 'Selecionar âmbito "All".', 'Selecionar formato "CSV".', 'Clicar "Download".', 'Verificar que o ficheiro CSV é descarregado com dados corretos.'],
    'Ficheiro CSV gerado com cabeçalhos e dados correspondentes à relação.'
  ));
  sections.push(...testCase('048', 'Exportação com Template',
    'Templates disponíveis para a relação.',
    ['Abrir diálogo de exportação.', 'Verificar que templates disponíveis são listados.', 'Selecionar um template.', 'Exportar.', 'Verificar que o ficheiro segue o formato do template com dados interpolados.'],
    'Exportação com template server-side funciona com interpolação correta.'
  ));

  // Section 19: Import
  sections.push(heading1('19. Importação'));
  sections.push(...testCase('049', 'Importação CSV',
    'Relação existente.',
    ['Abrir diálogo de importação.', 'Arrastar ficheiro CSV para a zona de drop.', 'Verificar que o preview mostra os dados importados.', 'Verificar que o mapeamento de colunas foi detetado automaticamente.', 'Confirmar importação.', 'Verificar que os dados aparecem na tabela.'],
    'Dados CSV importados com mapeamento automático e preview correto.'
  ));
  sections.push(...testCase('050', 'Importação JSON',
    'Relação existente.',
    ['Abrir diálogo de importação.', 'Selecionar ficheiro JSON.', 'Verificar preview com dados.', 'Confirmar importação.', 'Verificar que os dados são adicionados à relação.'],
    'Dados JSON importados corretamente.'
  ));
  sections.push(...testCase('051', 'Importação Multi-Tabela',
    'Ficheiro com múltiplas tabelas (ex: HTML com várias <table>).',
    ['Importar ficheiro HTML com múltiplas tabelas.', 'Verificar que dropdown de seleção de tabela aparece.', 'Selecionar a tabela desejada.', 'Verificar preview.', 'Confirmar importação.'],
    'Seleção entre múltiplas tabelas funciona com preview individual.'
  ));

  // Section 20: Integrity Check
  sections.push(heading1('20. Verificação de Integridade'));
  sections.push(...testCase('052', 'Verificação de Integridade',
    'Relação carregada.',
    ['Executar verificação de integridade via ação.', 'Verificar que o diálogo de resultados aparece.', 'Verificar categorização: erros (vermelho), avisos (amarelo), informação (azul).', 'Corrigir um erro reportado e re-executar.', 'Verificar que o erro desapareceu dos resultados.'],
    'Verificação identifica problemas, categoriza-os e re-verifica após correção.'
  ));

  // Section 21: Hierarchical Navigation
  sections.push(heading1('21. Navegação Hierárquica'));
  sections.push(...testCase('053', 'Navegação em Árvore',
    'Relação com show_hierarchy=true e hierarchy_column configurada.',
    ['Verificar que a navegação hierárquica é apresentada.', 'Clicar num nó pai.', 'Verificar que a tabela filtra para mostrar filhos desse nó.', 'Verificar breadcrumbs atualizados.', 'Clicar num breadcrumb para voltar a nível anterior.'],
    'Navegação hierárquica funciona com drill-down e breadcrumbs.'
  ));

  // Section 22: Nested Relations
  sections.push(heading1('22. Relações Aninhadas'));
  sections.push(...testCase('054', 'Abertura de Sub-Relação',
    'Relação com coluna do tipo "relation".',
    ['Clicar no botão de sub-relação numa célula.', 'Verificar que abre (diálogo/painel conforme modo).', 'Verificar que a sub-relação tem todas as funcionalidades (filtrar, ordenar, paginar).', 'Fechar a sub-relação.'],
    'Sub-relação abre como instância completa com funcionalidades independentes.'
  ));
  sections.push(...testCase('055', 'Aninhamento Múltiplo',
    'Sub-relação que contém outra coluna do tipo "relation".',
    ['Abrir sub-relação de nível 1.', 'Dentro dela, abrir sub-relação de nível 2.', 'Verificar que nível 2 funciona independentemente.', 'Fechar nível 2 e verificar que nível 1 mantém estado.'],
    'Aninhamento multi-nível funciona com isolamento de estado.'
  ));

  // Section 23: Display Modes
  sections.push(heading1('23. Modos de Apresentação'));
  sections.push(...testCase('056', 'Modo Dialog',
    'Relação com single_item_mode="dialog".',
    ['Clicar para ver detalhes de um registo.', 'Verificar que abre em popup modal com overlay.', 'Verificar botões "Fechar" no diálogo.', 'Fechar clicando no overlay ou no botão.'],
    'Conteúdo apresentado em popup modal com fecho funcional.'
  ));
  sections.push(...testCase('057', 'Modo Right Panel',
    'Relação com single_item_mode="right".',
    ['Clicar para ver detalhes de um registo.', 'Verificar que abre em painel à direita da tabela.', 'Verificar que a tabela e o painel são visíveis simultaneamente.', 'Fechar o painel e verificar que a tabela volta ao tamanho completo.'],
    'Painel lateral abre ao lado da tabela com coexistência visual.'
  ));
  sections.push(...testCase('058', 'Modo Bottom Panel',
    'Relação com single_item_mode="bottom".',
    ['Clicar para ver detalhes de um registo.', 'Verificar que abre em painel abaixo da tabela.', 'Verificar scroll automático para o painel.', 'Fechar o painel.'],
    'Painel inferior aparece com scroll automático.'
  ));

  // Section 24: Pagination
  sections.push(heading1('24. Paginação'));
  sections.push(...testCase('059', 'Navegação de Páginas',
    'Relação com mais de 10 registos.',
    ['Verificar paginação com "10" registos por página por defeito.', 'Clicar "›" (próxima) e verificar mudança de página.', 'Clicar "»" (última) e verificar última página.', 'Clicar "«" (primeira) e verificar primeira página.', 'Alterar tamanho da página para "50" e verificar atualização.'],
    'Navegação de páginas funciona em todas as direções com tamanhos variáveis.'
  ));

  // Section 25: Quick Search
  sections.push(heading1('25. Pesquisa Rápida'));
  sections.push(...testCase('060', 'Pesquisa em Tempo Real',
    'Vista de tabela com dados.',
    ['Digitar texto no campo de pesquisa.', 'Verificar que a tabela filtra em tempo real.', 'Verificar que a pesquisa abrange todos os campos.', 'Clicar no botão ✕ para limpar.', 'Verificar que todos os registos são restaurados.'],
    'Pesquisa rápida filtra em tempo real e limpa corretamente.'
  ));

  // Section 26: Binning
  sections.push(heading1('26. Binning'));
  sections.push(...testCase('061', 'Discretização Numérica',
    'Vista de tabela com coluna numérica.',
    ['Via menu de coluna, selecionar "Binning".', 'Definir número de bins (ex: 5).', 'Aplicar binning.', 'Verificar que os valores numéricos são substituídos por intervalos (ex: "10-20").', 'Verificar que filtros por valores funcionam com os intervalos.', 'Remover binning e verificar restauração dos valores originais.'],
    'Binning aplicado e revertido corretamente com interação de filtros.'
  ));

  // Section 27: Keyboard Shortcuts
  sections.push(heading1('27. Atalhos de Teclado'));
  sections.push(...testCase('062', 'Help Badge',
    'Vista de tabela ativa.',
    ['Passar o cursor sobre o badge ℹ na barra de vistas.', 'Verificar que tooltip de atalhos aparece.', 'Mover cursor para fora.', 'Verificar que tooltip desaparece.'],
    'Tooltip de atalhos de teclado aparece e desaparece corretamente.'
  ));

  // Section 28: v1.1 Features
  sections.push(heading1('28. Funcionalidades v1.1'));

  sections.push(heading2('28.1 Row Number / Rank / Dense Rank'));
  sections.push(...testCase('063', 'Row Number',
    'Vista de tabela com dados e ordenação aplicada.',
    ['Clicar direito no cabeçalho de uma coluna numérica.', 'Selecionar "Binning / Bucketing" → "Row Number".', 'Verificar que uma nova coluna inteira é adicionada com numeração sequencial (1, 2, 3, ...).', 'Verificar que a numeração respeita a ordem de ordenação atual.'],
    'Nova coluna com numeração sequencial adicionada conforme a ordem de ordenação.'
  ));
  sections.push(...testCase('064', 'Rank',
    'Vista de tabela com coluna numérica contendo valores repetidos.',
    ['Clicar direito no cabeçalho da coluna numérica.', 'Selecionar "Binning / Bucketing" → "Rank".', 'Verificar que uma nova coluna inteira é adicionada com classificação.', 'Verificar que valores iguais recebem o mesmo rank.', 'Verificar que existem gaps após empates (ex: 1, 2, 2, 4).'],
    'Classificação Rank aplicada com empates e gaps corretos.'
  ));
  sections.push(...testCase('065', 'Dense Rank',
    'Vista de tabela com coluna numérica contendo valores repetidos.',
    ['Clicar direito no cabeçalho da coluna numérica.', 'Selecionar "Binning / Bucketing" → "Dense Rank".', 'Verificar que uma nova coluna inteira é adicionada com classificação densa.', 'Verificar que valores iguais recebem o mesmo rank.', 'Verificar que NÃO existem gaps (ex: 1, 2, 2, 3).'],
    'Classificação Dense Rank aplicada sem gaps entre ranks.'
  ));

  sections.push(heading2('28.2 Produto Cartesiano'));
  sections.push(...testCase('066', 'Cartesian Product (THIS)',
    'Relação com pelo menos uma coluna do tipo "relation" com sub-registos.',
    ['Clicar direito no cabeçalho da coluna de relação.', 'Selecionar "Cartesian Product (THIS)".', 'Verificar que cada linha é multiplicada pelo número de sub-registos da sua sub-relação.', 'Verificar que as colunas da sub-relação aparecem como novas colunas na tabela principal.', 'Verificar que o número total de linhas aumentou conforme esperado.'],
    'Cross-join realizado com expansão correta de linhas e adição de colunas da sub-relação.'
  ));
  sections.push(...testCase('067', 'Cartesian Product (ALL)',
    'Relação com múltiplas colunas do tipo "relation".',
    ['Aceder à operação "Cartesian Product (ALL)" via menu.', 'Verificar que TODAS as colunas de relação são expandidas simultaneamente.', 'Verificar que o resultado contém as colunas de todas as sub-relações.'],
    'Todas as sub-relações expandidas num único passo com resultado correto.'
  ));

  sections.push(heading2('28.3 Remoção de Duplicados'));
  sections.push(...testCase('068', 'Remove Duplicates',
    'Relação com linhas duplicadas (valores idênticos exceto ID).',
    ['Aceder à operação "Remove Duplicates" via menu de ações.', 'Verificar que as linhas duplicadas são removidas.', 'Verificar que apenas uma instância de cada combinação de valores é mantida.', 'Verificar mensagem de feedback com contagem de linhas removidas.'],
    'Duplicados removidos com preservação da primeira ocorrência e feedback ao utilizador.'
  ));

  sections.push(heading2('28.4 Colunas Derivadas'));
  sections.push(...testCase('069', 'Colunas Derivadas - Extrações de Data',
    'Relação com coluna do tipo date ou datetime com valores preenchidos.',
    ['Clicar direito no cabeçalho da coluna de data.', 'Selecionar "Derived Columns" no menu.', 'Selecionar extração "Year".', 'Verificar que nova coluna inteira é criada com o ano extraído.', 'Repetir para Month, Day, Weekday, Quarter, Semester, Day of Year, Week of Year e ISO Week.', 'Verificar que todos os valores extraídos estão corretos.'],
    'Novas colunas criadas com valores de data extraídos corretamente para cada componente.'
  ));
  sections.push(...testCase('070', 'Colunas Derivadas - Extrações de Hora',
    'Relação com coluna do tipo time ou datetime com valores de hora.',
    ['Clicar direito no cabeçalho da coluna de hora.', 'Selecionar "Derived Columns" → "Hour".', 'Verificar que nova coluna inteira é criada com a hora extraída.', 'Repetir para Minute, Second, AM/PM e Hour12.', 'Verificar que AM/PM retorna string "AM" ou "PM" e Hour12 retorna valor 1-12.'],
    'Componentes de hora extraídos corretamente incluindo formato 12h e AM/PM.'
  ));
  sections.push(...testCase('071', 'Colunas Derivadas - Arredondamento Float',
    'Relação com coluna do tipo float com valores decimais.',
    ['Clicar direito no cabeçalho da coluna float.', 'Selecionar "Derived Columns" → "Round".', 'Especificar número de casas decimais (ex: 2).', 'Verificar que nova coluna é criada com valores arredondados.'],
    'Valores float arredondados ao número de casas decimais especificado.'
  ));
  sections.push(...testCase('072', 'Colunas Derivadas - Métricas de String',
    'Relação com coluna do tipo string ou textarea com texto.',
    ['Clicar direito no cabeçalho da coluna de texto.', 'Selecionar "Derived Columns" → "Length".', 'Verificar que nova coluna inteira mostra o comprimento do texto.', 'Repetir para Bytes, Flesch Reading Ease, Flesch-Kincaid Grade Level e Sentence Count.', 'Verificar que Flesch Reading Ease retorna valor numérico entre 0-100.', 'Verificar que Sentence Count retorna contagem correta de frases.'],
    'Métricas de string calculadas corretamente para cada tipo de métrica.'
  ));

  sections.push(heading2('28.5 Log de Operações'));
  sections.push(...testCase('073', 'Registo de Operações no Log',
    'Relação carregada com dados.',
    ['Executar uma operação mutante (ex: adicionar linha).', 'Verificar no JSON da relação que relation.log contém uma entrada.', 'Verificar que a entrada tem formato {pot: "relation_op", timestamp, op, ...params}.', 'Executar mais operações (editar célula, eliminar linha, aplicar binning).', 'Verificar que cada operação adiciona nova entrada ao log com timestamp e parâmetros corretos.'],
    'Todas as operações mutantes são registadas no log com estrutura declarativa correta.'
  ));

  sections.push(heading2('28.6 Visibilidade de Colunas'));
  sections.push(...testCase('074', 'Diálogo Show/Hide Columns',
    'Vista de tabela com múltiplas colunas.',
    ['Aceder ao diálogo "Show/Hide Columns" via menu de coluna.', 'Verificar que todas as colunas são listadas com checkboxes.', 'Desmarcar uma coluna.', 'Verificar que o input de largura está disponível para cada coluna.', 'Alterar a largura de uma coluna no input.', 'Usar drag & drop para reordenar colunas no diálogo.', 'Confirmar alterações.', 'Verificar que a tabela reflete as alterações (coluna oculta, largura alterada, nova ordem).'],
    'Diálogo permite controlar visibilidade, largura e ordem, com reflexo imediato na tabela.'
  ));
  sections.push(...testCase('075', 'Hide Column via Menu',
    'Vista de tabela com múltiplas colunas visíveis.',
    ['Clicar direito no cabeçalho de uma coluna.', 'Selecionar "Column" → "Hide Column".', 'Verificar que a coluna desaparece da tabela.', 'Verificar que a coluna pode ser restaurada via diálogo Show/Hide Columns.'],
    'Coluna ocultada via menu e restaurável via diálogo.'
  ));
  sections.push(...testCase('076', 'Redimensionamento de Coluna via Drag',
    'Vista de tabela com colunas visíveis.',
    ['Posicionar o cursor na borda direita de um cabeçalho de coluna.', 'Verificar que o cursor muda para indicador de resize.', 'Arrastar a borda para redimensionar a coluna.', 'Verificar que a largura da coluna é atualizada em tempo real.', 'Verificar que o valor de largura é persistido no columns_visible do uiState.'],
    'Coluna redimensionada via drag com persistência no estado.'
  ));
  sections.push(...testCase('077', 'Reordenação de Colunas via Drag & Drop',
    'Vista de tabela com múltiplas colunas.',
    ['Clicar e arrastar um cabeçalho de coluna para outra posição.', 'Verificar feedback visual durante o drag (indicador de posição).', 'Largar a coluna na nova posição.', 'Verificar que a ordem das colunas é atualizada na tabela.', 'Verificar que a nova ordem é persistida no columns_visible do uiState.'],
    'Colunas reordenadas via drag & drop com persistência no estado.'
  ));

  sections.push(heading2('28.7 Vistas Guardadas com Log'));
  sections.push(...testCase('078', 'Guardar e Restaurar Vista de Log',
    'Relação com operações executadas (log não vazio).',
    ['Abrir separador "Saved".', 'Selecionar tipo "Log de Operações".', 'Escrever nome e guardar.', 'Verificar que a vista aparece na lista com tipo "Log".', 'Limpar os dados da relação.', 'Restaurar a vista de log guardada.', 'Verificar que a sequência de operações é restaurada no relation.log.'],
    'Vista de Log guardada e restaurada com sequência de operações preservada.'
  ));

  sections.push(heading2('28.8 Renomeações de Menu'));
  sections.push(...testCase('079', 'Menu Binning / Bucketing Renomeado',
    'Vista de tabela com coluna numérica.',
    ['Clicar direito no cabeçalho de uma coluna numérica.', 'Verificar que o item de menu mostra "Binning / Bucketing" (não apenas "Binning").', 'Verificar que o submenu contém as opções: Binning, Row Number, Rank, Dense Rank.'],
    'Menu renomeado para "Binning / Bucketing" com novas opções visíveis.'
  ));
  sections.push(...testCase('080', 'Opções de Filtro de Outliers Renomeadas',
    'Vista de tabela com coluna numérica.',
    ['Abrir filtro para uma coluna numérica.', 'Selecionar aba "Outliers".', 'Verificar que as opções mostram "Choose Outliers" (não "Keep Outliers").', 'Verificar que a opção alternativa mostra "Choose Not Outliers" (não "Remove Outliers").'],
    'Opções de filtro de outliers com nomes atualizados v1.1.'
  ));

  return new Document({
    sections: [{ children: sections }],
  });
}

// ============================================================
// DOCUMENT 3: REFLECTIVE ANALYSIS
// ============================================================
function generateReflectionDoc() {
  const sections = [];

  sections.push(
    new Paragraph({ spacing: { before: 2000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'RELATION BUILDER', bold: true, font: FONT, size: 52, color: HEADING_COLOR })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'Análise Reflexiva de Requisitos', font: FONT, size: 36, color: ACCENT_COLOR })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'Alternativas, Usabilidade, Modelos Mentais, Custo/Benefício e Evolução', font: FONT, size: 28, color: '666666' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: `Versão 1.1 — ${new Date().toLocaleDateString('pt-PT')}`, font: FONT, size: 22, color: '999999' })],
    }),
    emptyLine(),
  );

  function reflectionBlock(area, necessity, alternatives, usability, mentalModel, costBenefit, evolution) {
    const items = [];
    items.push(heading2(area));
    items.push(boldPara('Necessidade: ', necessity));
    items.push(boldPara('Alternativas Consideradas: ', alternatives));
    items.push(boldPara('Usabilidade: ', usability));
    items.push(boldPara('Modelo Mental do Utilizador: ', mentalModel));
    items.push(boldPara('Custo/Benefício: ', costBenefit));
    items.push(boldPara('Evolução Futura: ', evolution));
    items.push(emptyLine());
    return items;
  }

  // Introduction
  sections.push(heading1('Introdução'));
  sections.push(para('Este documento analisa reflexivamente cada área funcional do Relation Builder, avaliando a necessidade de cada funcionalidade, alternativas possíveis, impacto na usabilidade, adequação ao modelo mental do utilizador, relação custo/benefício da implementação e caminhos de evolução futura. A análise visa informar decisões de desenvolvimento e priorização.'));

  // 1. Data Model
  sections.push(heading1('1. Modelo de Dados'));
  sections.push(...reflectionBlock(
    '1.1 Estrutura JSON Relacional',
    'Fundamental. Um formato de dados flexível e auto-descritivo é o alicerce de toda a aplicação. O JSON foi escolhido pela sua universalidade, legibilidade humana e compatibilidade nativa com JavaScript.',
    'XML (mais verboso, melhor validação com schema), Protocol Buffers (binário, mais eficiente mas ilegível), SQLite em browser (WebSQL descontinuado, SQL.js possível mas pesado). CSV plano seria demasiado limitado para tipos complexos e aninhamento.',
    'A estrutura columns/items/options é intuitiva para programadores mas opaca para utilizadores finais. A textarea JSON serve como ferramenta de debug mais que de interação direta. A separação de tipos é clara e previsível.',
    'O utilizador pensa em "tabela com colunas e linhas", que é exatamente o que a estrutura oferece. O conceito de "opções de coluna" (mapeamentos select) pode requerer explicação. Relações aninhadas são intuitivas como "tabela dentro de tabela".',
    'Custo de implementação: baixo (JSON nativo em JS). Benefício: muito alto (flexibilidade para todos os cenários). O aninhamento ilimitado adiciona complexidade de gestão de estado mas o benefício em expressividade justifica o investimento.',
    'Migração para armazenamento persistente (PostgreSQL com Drizzle ORM está preparado). Suporte para tipos adicionais (imagem, ficheiro, URL rich preview). Schema validation com JSON Schema. Versionamento de estrutura para migrações.'
  ));
  sections.push(...reflectionBlock(
    '1.2 Diversidade de Tipos de Coluna',
    'Elevada. Os 12 tipos cobrem a grande maioria dos cenários de dados do mundo real. O tipo "relation" é diferenciador face a folhas de cálculo tradicionais.',
    'Reduzir a 4-5 tipos básicos (string, number, boolean, object) com casting automático. Seria mais simples mas perderia validação e rendering específico.',
    'Cada tipo tem um input HTML nativo adequado (date picker, checkbox, number input), o que reduz fricção. O tipo "select" com options pré-definidas previne erros de entrada.',
    'Utilizadores estão habituados a "escolher de uma lista" (select), "marcar sim/não" (boolean), "escrever data" (date picker). Os tipos mapeiam para interações comuns.',
    'Custo moderado (cada tipo requer lógica de rendering, validação e comparação). Benefício alto (dados limpos e consistentes, melhor UX).',
    'Tipos calculados (fórmulas). Tipo "ficheiro" com upload. Tipo "referência" para foreign keys entre relações. Validação customizável por coluna.'
  ));

  // 2. Views
  sections.push(heading1('2. Sistema de Vistas'));
  sections.push(...reflectionBlock(
    '2.1 Vista de Tabela',
    'Essencial. É a interface primária e mais familiar para dados tabulares. Sem tabela, o sistema perderia a sua identidade funcional.',
    'Data grid com virtualização (ag-Grid, Handsontable) ofereceria melhor performance para >10k linhas mas introduziria dependência externa contra a filosofia vanilla JS. Spreadsheet embedding (Google Sheets API) seria dependência externa.',
    'Excelente para utilizadores familiarizados com folhas de cálculo. Menu de contexto por coluna organiza funcionalidades avançadas sem poluir a interface. Edição inline é esperada e natural.',
    'O modelo mental é "folha de cálculo" — clicar num cabeçalho ordena, clicar direito dá opções, editar na célula é possível. Isto está perfeitamente alinhado.',
    'Custo de implementação: alto (renderização, paginação, sorting, editing, menus). Benefício: máximo (funcionalidade core). A decisão de implementação vanilla versus biblioteca justifica-se pela ausência de dependências e controlo total.',
    'Virtualização para grandes conjuntos de dados. Congelamento de colunas/linhas (freeze panes). Redimensionamento de colunas. Drag-and-drop para reordenação. Copy/paste de múltiplas células.'
  ));
  sections.push(...reflectionBlock(
    '2.2 Vista de Cartões',
    'Importante. Oferece perspetiva complementar à tabela, especialmente para dados com muitos campos onde linhas de tabela se tornam ilegíveis.',
    'Lista vertical (como email). Kanban board (agrupado por estado). Timeline view para dados temporais. Gallery view para dados com imagens.',
    'Cartões são visualmente apelativos e fáceis de digitalizar. Cada cartão como unidade atómica é compreensível. A paginação idêntica à tabela reduz curva de aprendizagem.',
    'Utilizadores pensam em "fichas" ou "registos individuais", que é exatamente o que os cartões apresentam. A transição tabela-cartões é intuitiva.',
    'Custo moderado. Benefício moderado-alto (alternativa visual valiosa para determinados tipos de dados).',
    'Layout de cartões configurável (campos visíveis, tamanho). Imagem de capa por cartão. Drag-and-drop para reordenação. Preview de relações aninhadas no cartão.'
  ));
  sections.push(...reflectionBlock(
    '2.3 Vista Pivot',
    'Importante para análise. Tabelas pivot são uma ferramenta clássica de business intelligence que utilizadores de Excel conhecem bem.',
    'Integração com ferramentas externas (Power BI, Looker). Gráficos de barras empilhados como alternativa visual. Cross-tabs simples sem múltiplas agregações.',
    'A interface de configuração com selects para linhas, colunas e valores é standard e compreensível. O botão "Generate" dá controlo explícito ao utilizador. Múltiplas agregações simultâneas são um poder avançado.',
    'Utilizadores de Excel conhecem pivot tables. A terminologia "Rows", "Columns", "Values" é familiar. A diferença é que aqui a configuração é mais explícita (selects em vez de drag-and-drop).',
    'Custo alto (lógica de agregação complexa). Benefício alto para utilizadores analíticos (substituição de Excel para análises ad-hoc).',
    'Drag-and-drop para configuração. Drill-down nos valores. Pivot charts (gráficos derivados da pivot). Formatação condicional na pivot. Exportação da pivot.'
  ));
  sections.push(...reflectionBlock(
    '2.4 Vista de Correlação',
    'Especializada. Importante para análise estatística rigorosa. A auto-deteção de método é um diferenciador significativo.',
    'Apenas Pearson (o mais simples). Integração com R/Python via backend. Gráfico scatter simples sem coeficiente.',
    'A diversidade de métodos pode intimidar utilizadores não-estatísticos, mas a auto-deteção mitiga isto. O painel de ajuda é essencial para educação. A análise de todos os pares é uma funcionalidade de produtividade.',
    'Utilizadores estatísticos pensam em "este valor está correlacionado com aquele?" e querem um número. A auto-deteção alinha-se com "deixa o sistema escolher o método certo".',
    'Custo alto (implementação de 6 métodos + testes de normalidade). Benefício alto para o público-alvo analítico. Pode ser visto como over-engineering para usos simples.',
    'Gráficos scatter integrados. Regressão linear/não-linear. Análise de causalidade (Granger). Exportação de resultados estatísticos.'
  ));
  sections.push(...reflectionBlock(
    '2.5 Vista de Diagrama (t-SNE)',
    'Avançada. t-SNE é poderoso para descoberta de padrões mas requer compreensão estatística. Os parâmetros configuráveis dão controlo mas adicionam complexidade.',
    'PCA (mais rápido, linear). UMAP (mais recente, melhor preservação de estrutura global). Dendrograma hierárquico. Coordenadas paralelas.',
    'A configuração com 3 parâmetros (clusters, perplexidade, iterações) é o mínimo necessário mas pode confundir utilizadores não-técnicos. As tooltips de ajuda por campo são essenciais.',
    'O modelo mental é "quero ver quais registos são parecidos". O diagrama satisfaz isto visualmente. A coloração por cluster torna padrões imediatamente visíveis.',
    'Custo muito alto (algoritmo t-SNE + k-means + rendering canvas). Benefício específico para análise exploratória avançada. Justifica-se pela diferenciação do produto.',
    'UMAP como alternativa. Animação da convergência. Seleção de features para inclusão. Labels nos pontos. Zoom e pan interativo.'
  ));
  sections.push(...reflectionBlock(
    '2.6 Vista de IA',
    'Diferenciadora. A integração de IA para análise de dados em linguagem natural é uma funcionalidade moderna e competitiva.',
    'Chat embebido com GPT genérico. Análise estatística automática sem IA (regras pré-definidas). Apenas sugestões de filtros sem Q&A.',
    'A interface de chat é universalmente compreensível (pergunta-resposta). A entrada por voz adiciona conveniência. O suporte multi-idioma é inclusivo.',
    'O utilizador pensa "quero perguntar algo sobre os meus dados" — o chat satisfaz isto diretamente. A aplicação automática de filtros sugeridos fecha o ciclo análise→ação.',
    'Custo moderado (integração API). Benefício alto (democratiza análise avançada). Custo recorrente de API deve ser considerado.',
    'Histórico de conversação. Geração de gráficos via IA. Sugestões proativas de insights. Fine-tuning para domínio específico.'
  ));
  sections.push(...reflectionBlock(
    '2.7 Vistas Guardadas',
    'Muito importante para produtividade. Evita reconfiguração repetitiva de filtros, ordenações e formatação.',
    'Apenas guardar filtros (mais simples). URL com query parameters para estado. Export/import de configuração como ficheiro.',
    'A interface é simples: nome, tipo, guardar. A distinção formato/registos/ambos pode ser confusa sem explicação. Labels "Para Ti" / "Para Todos" são claros.',
    'O utilizador pensa em "voltar à configuração que tinha antes" — vistas guardadas satisfazem diretamente isto. O duplo-clique para restaurar é rápido.',
    'Custo baixo (serialização/deserialização de estado). Benefício alto (eficiência de workflow).',
    'Vistas partilhadas entre utilizadores via servidor. Tags/categorias para organização. Agendamento de vistas (relatórios automáticos). Vistas como dashboards.'
  ));

  // 3. Data Operations
  sections.push(heading1('3. Operações sobre Dados'));
  sections.push(...reflectionBlock(
    '3.1 Sistema de Filtragem',
    'Essencial. 6 tipos de filtro cobrem todos os cenários imagináveis, desde seleção simples até análise estatística de outliers.',
    'Apenas filtro por valores (como Excel AutoFilter). Query builder visual (tipo SQL WHERE). Filtro por exemplo (mostrar registo similar). Natural language filtering (via IA).',
    'A organização por abas no diálogo de filtro é clara. Cada tipo de filtro tem UI adequada. O indicador visual de filtros ativos é importante para o utilizador saber o que está a ver.',
    'O modelo principal é "quero ver apenas X" — filtro por valores. Os filtros avançados (posição, outliers) são para utilizadores analíticos que pensam em termos estatísticos.',
    'Custo alto (6 tipos × lógica de aplicação + UI). Benefício máximo (funcionalidade core). Os filtros avançados (outliers, posição) custam pouco incrementalmente mas diferenciam significativamente.',
    'Combinação de filtros com lógica OR (atualmente AND implícito). Filtros salvos como presets. Filtros temporários vs. persistentes. Historial de filtros aplicados.'
  ));
  sections.push(...reflectionBlock(
    '3.2 Ordenação Multi-Coluna e Sort Panel',
    'Essencial. Ordenação é a operação mais básica de manipulação de dados tabulares. O Sort Panel eleva a funcionalidade com gestão visual completa de critérios.',
    'Apenas ordenação simples (sem multi-coluna). Apenas clique no cabeçalho (sem diálogo). Ordenação natural/smart sorting (deteção automática de padrões).',
    'O paradigma clique/shift+clique é standard e eficiente para uso rápido. O Sort Panel complementa com uma interface visual para cenários avançados: drag & drop para reordenar prioridades, opções por coluna (Case/Accent/Punctuation Insensitive, Parse Numbers). O motor de ordenação usa Intl.Collator com locale \'und\' para máxima compatibilidade multilíngue.',
    'Utilizadores esperam "clicar no cabeçalho ordena" para uso rápido. Para cenários complexos (multi-coluna com opções), o Sort Panel oferece controlo granular sem sacrificar a simplicidade da interação básica.',
    'Custo moderado. Benefício alto. O Sort Panel adiciona valor significativo para utilizadores avançados. A integração com Intl.Collator garante ordenação correta para textos em qualquer idioma.',
    'Ordenação custom (funções de comparação definidas pelo utilizador). Ordenação agrupada (manter grupos juntos). Presets de ordenação salvos. Ordenação por expressão calculada.'
  ));
  sections.push(...reflectionBlock(
    '3.3 Agrupamento com Drill-Down',
    'Importante para exploração de dados. Combina funcionalidade de tabela pivot simplificada com navegação intuitiva.',
    'Apenas agrupamento visual (sem drill-down). Árvore lateral com contagens. Gráfico treemap. Breadcrumbs sem filtragem automática.',
    'A interação de drill-down é natural: clicar num grupo "entra" nesse grupo. Breadcrumbs permitem voltar. A contagem de registos por grupo dá contexto.',
    'O modelo é "estas coisas estão juntas" — agrupamento satisfaz isto. O drill-down mimetiza navegação em pastas, que é universalmente compreendido.',
    'Custo moderado. Benefício moderado-alto para dados categóricos.',
    'Multi-level grouping com collapse/expand (estilo árvore). Sumários por grupo (totais, médias). Agrupamento visual com cores. Drag-and-drop para reordenar grupos.'
  ));

  // 4. Statistics and Analysis
  sections.push(heading1('4. Estatísticas e Análise'));
  sections.push(...reflectionBlock(
    '4.1 Painel de Estatísticas por Coluna',
    'Muito importante. Estatísticas descritivas são o primeiro passo de qualquer análise de dados.',
    'Apenas contagem e média (mínimo). Integração com biblioteca de estatísticas (jStat, simple-statistics). Painel de estatísticas global (não por coluna).',
    'O painel é rico mas bem organizado. Box plots e histogramas são visualizações standard e compreensíveis para o público-alvo. Os 5 testes de normalidade são exaustivos.',
    'O utilizador pensa "como estão distribuídos estes valores?" — o painel responde visualmente (histograma, box plot) e numericamente (min, max, média, quartis).',
    'Custo alto (implementação de múltiplos testes e visualizações). Benefício alto para análise. Os testes de normalidade são um diferenciador que poucos ferramentas web oferecem.',
    'Comparação de distribuições entre colunas. Testes de hipótese (t-test, chi-square). Análise temporal (tendências). Deteção de anomalias automática.'
  ));
  sections.push(...reflectionBlock(
    '4.2 Formatação Condicional',
    'Importante para comunicação visual de dados. Transforma números em informação visual imediata.',
    'Apenas uma paleta de cores. Sem barras de dados (apenas cores de fundo). Heatmap separado (vista dedicada). Formatação manual por regra.',
    'As 8 paletas cobrem diferentes necessidades de acessibilidade e preferência. A aplicação é imediata (via menu de coluna). A legenda garante interpretabilidade.',
    'Utilizadores de Excel conhecem formatação condicional. "Verde é bom, vermelho é mau" é universal. Barras de dados são intuitivas como "maior barra = maior valor".',
    'Custo moderado. Benefício alto para comunicação de dados. As paletas são reutilizáveis.',
    'Formatação baseada em regras customizáveis. Formatação cruzada (cor baseada em outra coluna). Animação de transição. Temas de cores para toda a tabela.'
  ));

  // 5. Row Operations
  sections.push(heading1('5. Operações sobre Registos'));
  sections.push(...reflectionBlock(
    '5.1 Operações Individuais (CRUD)',
    'Essenciais. View, Edit, Copy, New, Delete são as operações fundamentais de gestão de dados.',
    'Edição apenas inline (sem formulário dedicado). Modal de confirmação para todas as ações (mais seguro mas mais lento). Undo em vez de confirmação de delete.',
    'O menu ⋯ é compacto e contextual. O formulário de edição com inputs tipados é mais estruturado que edição inline. O formulário em papel (Paper Form) aumenta a resiliência organizacional, permitindo recolha de dados em papel durante falhas do sistema.',
    'O modelo CRUD é universalmente compreendido. "Ver", "Editar", "Copiar", "Eliminar" são ações atómicas e previsíveis.',
    'Custo baixo-moderado. Benefício máximo (funcionalidade core). O formulário em papel é um custo adicional baixo com benefício significativo para a resiliência organizacional.',
    'Undo/redo para operações. Histórico de alterações por registo (audit trail). Aprovações/workflow para alterações. Templates de formulário.'
  ));
  sections.push(...reflectionBlock(
    '5.2 Operações Multi-Registo',
    'Muito importantes para eficiência. Multi Edit, Multi Delete, Group Edit e Merge resolvem problemas reais de gestão de dados em volume.',
    'Apenas operação-a-operação (sem multi). Bulk operations via importação/exportação. Script/macro para operações em massa.',
    'O dropdown de ações multi-registo é eficiente. O merge com controlo campo-a-campo é sofisticado. O scroll sincronizado para comparação é inovador.',
    'O utilizador pensa "quero fazer isto a vários registos de uma vez" — multi-operações satisfazem diretamente. O merge mimetiza a resolução de conflitos em controlo de versões.',
    'Custo alto (especialmente merge e multi-edit). Benefício muito alto para eficiência em datasets grandes. O merge é um diferenciador significativo.',
    'Operações em background com progress bar. Multi-edit com preview de alterações. Merge automático com resolução por regras. Bulk import com merge.'
  ));

  // 6. Selection Dialogs
  sections.push(heading1('6. Diálogos de Seleção'));
  sections.push(...reflectionBlock(
    '6.1 Select One / Select Many / Choose Many',
    'Importantes para integração. Permitem usar o Relation Builder como componente de seleção reutilizável.',
    'Dropdown simples (para poucos itens). Autocomplete com pesquisa (para muitos itens). Modal de seleção sem funcionalidades de tabela.',
    'Select One é direto (duplo-clique → resultado). Select Many adiciona checkboxes. Choose Many com duas listas é intuitivo para "mover itens entre conjuntos".',
    'O modelo de Choose Many (lista fonte → lista alvo) é familiar de interfaces como transferência de ficheiros, atribuição de permissões, ou seleção de opções em IDEs.',
    'Custo moderado (reutiliza componente de relação). Benefício alto para integração com sistemas externos.',
    'Filtros e pesquisa na seleção. Drag-and-drop entre listas (Choose Many). Preview do item selecionado. Seleção recente/favoritos.'
  ));

  // 7. Import/Export
  sections.push(heading1('7. Importação e Exportação'));
  sections.push(...reflectionBlock(
    '7.1 Exportação Multi-Formato',
    'Essencial para interoperabilidade. A exportação é a ponte entre o Relation Builder e o ecossistema de ferramentas externas.',
    'Apenas CSV (o mais universal). Apenas clipboard (copy-paste). Exportação via API em vez de download.',
    'O diálogo de exportação com seleção de âmbito e formato é completo. O sistema de templates server-side permite personalização avançada.',
    'O utilizador pensa "quero levar estes dados para Excel/Word" — a exportação direta satisfaz isto sem passos intermédios.',
    'Custo moderado. Benefício alto (interoperabilidade é frequentemente citada como requisito prioritário).',
    'Exportação agendada (automática). Integração direta com Google Sheets/Drive. API de exportação para integração programática. Formatos adicionais (Parquet, SPSS).'
  ));
  sections.push(...reflectionBlock(
    '7.2 Importação com Auto-Deteção',
    'Essencial para onboarding de dados. A auto-deteção e mapeamento inteligente reduzem drasticamente a barreira de entrada.',
    'Apenas importação manual (cola de texto). Apenas CSV (sem outros formatos). Importação via URL/API.',
    'O drag-and-drop é natural. O preview antes de confirmação dá confiança. O mapeamento automático poupa tempo. A mensagem de erro para .xlsx é uma boa prática de UX.',
    'O utilizador pensa "quero usar os dados que já tenho" — importação satisfaz isto. A auto-deteção alinha-se com "o sistema deve ser inteligente".',
    'Custo moderado-alto (múltiplos parsers). Benefício muito alto (reduz barreira de adoção).',
    'Importação de .xlsx binário (via SheetJS). Importação de URLs/APIs externas. Importação incremental (merge com dados existentes). Importação agendada.'
  ));

  // 8. Integrity and Quality
  sections.push(heading1('8. Integridade e Qualidade'));
  sections.push(...reflectionBlock(
    '8.1 Verificação de Integridade',
    'Importante como salvaguarda. Previne corrupção silenciosa de dados e ajuda a diagnosticar problemas.',
    'Validação apenas na entrada (importação/edição). Validação por schema JSON formal. Verificação contínua em background.',
    'O diálogo categorizado (erro/aviso/info) prioriza a atenção do utilizador. A verificação recursiva de relações aninhadas é completa.',
    'O utilizador pensa "os meus dados estão corretos?" — a verificação responde com detalhes acionáveis.',
    'Custo moderado. Benefício moderado (salvaguarda contra problemas raros mas graves).',
    'Auto-correção de problemas simples. Validação em tempo real (ao editar). Relatório de qualidade de dados com score. Sugestões de limpeza de dados.'
  ));

  // 9. Navigation and Structure
  sections.push(heading1('9. Navegação e Estrutura'));
  sections.push(...reflectionBlock(
    '9.1 Navegação Hierárquica',
    'Específica mas valiosa para dados hierárquicos. Ativa apenas quando configurada, não polui a interface para dados planos.',
    'Árvore lateral sempre visível. Breadcrumbs sem filtragem automática. Vista de árvore dedicada (expandir/colapsar nós).',
    'A ativação condicional via rel_options é uma boa prática. Breadcrumbs são universalmente compreendidos como navegação hierárquica.',
    'O utilizador de dados hierárquicos pensa em "pai/filho" ou "categoria/subcategoria" — a navegação mapeia diretamente para isto.',
    'Custo moderado. Benefício alto para o subconjunto de utilizadores com dados hierárquicos.',
    'Vista de árvore visual com expand/collapse. Drag-and-drop para mover na hierarquia. Multiple root support. Hierarquia com contagens e sumários.'
  ));
  sections.push(...reflectionBlock(
    '9.2 Relações Aninhadas',
    'Diferenciador fundamental. Permite modelar dados do mundo real com complexidade arbitrária sem limitações estruturais.',
    'Foreign keys com tabelas separadas (mais relacional puro). Links/referências entre relações (mais leve). Apenas 1-2 níveis de aninhamento (mais simples).',
    'O botão na célula para abrir sub-relação é discreto mas acessível. A instância completa da sub-relação garante funcionalidade total. O cleanup automático previne memory leaks.',
    'O utilizador pensa em "esta coisa tem uma lista de sub-coisas" — colunas relation satisfazem isto diretamente. É o equivalente visual de "abrir uma pasta dentro de outra".',
    'Custo alto (gestão de instâncias, isolamento de estado, cleanup). Benefício muito alto (expressividade e flexibilidade únicas).',
    'Editor visual de schema. Preview de sub-relações na tabela principal. Aggregação cross-relação (contar sub-registos). Drag-and-drop entre relações.'
  ));

  // 10. Configuration
  sections.push(heading1('10. Configurabilidade'));
  sections.push(...reflectionBlock(
    '10.1 rel_options e UI Configurável',
    'Muito importante. A configurabilidade granular permite adaptar a mesma ferramenta a cenários desde formulários simples até dashboards analíticos.',
    'Configuração via ficheiro separado. Configuração via UI (settings panel). Perfis pré-definidos (simples, avançado, analítico).',
    'A quantidade de opções pode ser overwhelming. A organização em categorias (vistas, ações, display) ajuda. Valores por defeito sensatos reduzem necessidade de configuração.',
    'O utilizador não-técnico prefere "funciona sem configurar". O utilizador avançado valoriza "posso controlar tudo". rel_options serve ambos com defaults razoáveis.',
    'Custo moderado (propagação de opções por todo o código). Benefício alto (versatilidade do produto).',
    'UI de configuração visual (em vez de JSON). Perfis de configuração pré-definidos. Herança de configuração (relação pai → filha). Configuração por utilizador/role.'
  ));

  // 11. Display Modes
  sections.push(heading1('11. Modos de Apresentação'));
  sections.push(...reflectionBlock(
    '11.1 Dialog / Right Panel / Bottom Panel',
    'Importante para adaptação a diferentes workflows. Cada modo serve um estilo de trabalho diferente.',
    'Apenas modal (mais simples). Drawer lateral (como apps mobile). Painel flutuante reposicionável. Inline expansion (expandir linha na tabela).',
    'Os três modos cobrem os padrões de layout mais comuns. O scroll automático no modo bottom é um detalhe de UX positivo. A configuração via single_item_mode é simples.',
    'Utilizadores de IDEs estão habituados a painéis laterais. Utilizadores de apps web estão habituados a modais. O modo bottom é natural para "detalhes abaixo da lista".',
    'Custo moderado (3 implementações de layout). Benefício moderado (personalização de workflow).',
    'Painel destacável (pop-out para janela separada). Modo split-screen (tabela + detalhe fixo). Modo full-screen para detalhe. Transição animada entre modos.'
  ));

  // 12. Evolution to v1.1
  sections.push(heading1('12. Evolução para Versão 1.1'));
  sections.push(para('A versão 1.1 do Relation Builder representa uma evolução significativa que adiciona capacidades sem comprometer a arquitetura existente. Esta secção analisa as principais adições e as suas implicações arquiteturais.'));

  sections.push(heading2('12.1 Sistema columns_visible como Evolução do Modelo de Apresentação'));
  sections.push(boldPara('Necessidade: ', 'Na v1.0, todas as colunas eram sempre visíveis e a largura era determinada automaticamente pelo browser. Em relações com muitas colunas, a tabela tornava-se ilegível. O columns_visible resolve isto com controlo granular.'));
  sections.push(boldPara('Impacto Arquitetural: ', 'O columns_visible é um objeto no uiState que codifica três dimensões num único artefacto: presença da chave = visibilidade, valor = largura, ordem das chaves = ordem de apresentação. Esta codificação é elegante mas requer que a ordem de propriedades do objeto JavaScript seja preservada, o que é garantido nas especificações modernas de JS.'));
  sections.push(boldPara('Usabilidade: ', 'A oferta de múltiplos caminhos de interação (diálogo, menu, drag resize, drag reorder) segue o princípio de acomodar diferentes estilos de trabalho. A reorganização do menu de coluna (Column Selection → submenu Column) agrupa logicamente as operações relacionadas.'));
  sections.push(boldPara('Evolução Futura: ', 'Perfis de visibilidade por tipo de tarefa. Herança de configuração de colunas entre vistas. Responsividade automática que oculta colunas conforme o tamanho do ecrã.'));

  sections.push(heading2('12.2 Log de Operações como Base para Replay/Undo'));
  sections.push(boldPara('Necessidade: ', 'A rastreabilidade de operações é fundamental para auditoria e reversibilidade. O log de operações regista mais de 40 tipos de operações mutantes com estrutura declarativa {pot: "relation_op", timestamp, op, ...params}.'));
  sections.push(boldPara('Impacto Arquitetural: ', 'O log transforma o Relation Builder de uma ferramenta de manipulação direta para uma que mantém histórico completo de transformações. A estrutura declarativa dos registos é fundamental: cada entrada contém toda a informação necessária para reproduzir a operação, permitindo futuramente replay de sequências e undo/redo. A integração com Vistas Guardadas (novo tipo "Log de Operações") permite persistir e partilhar pipelines de transformação.'));
  sections.push(boldPara('Custo/Benefício: ', 'O custo de instrumentar 40+ operações é moderado mas o benefício é muito alto: auditoria completa, replay, e fundação para funcionalidades avançadas de versionamento de dados.'));
  sections.push(boldPara('Evolução Futura: ', 'Undo/redo baseado no log. Replay de sequências de operações sobre novos dados. Partilha de pipelines de transformação entre utilizadores. Visualização temporal do log.'));

  sections.push(heading2('12.3 Colunas Derivadas como Extensão do Pipeline de Transformação'));
  sections.push(boldPara('Necessidade: ', 'Utilizadores frequentemente necessitam de componentes extraídos de dados existentes (ano de uma data, comprimento de um texto). Antes da v1.1, estas transformações requeriam ferramentas externas.'));
  sections.push(boldPara('Impacto Arquitetural: ', 'O sistema de colunas derivadas é organizado por tipo de dados de origem (date, time, float, string), o que facilita a descoberta e a extensibilidade. A inclusão de métricas de legibilidade (Flesch Reading Ease, Flesch-Kincaid Grade Level) diferencia o Relation Builder de ferramentas concorrentes na análise de conteúdo textual. A extração cria colunas genuínas na relação, que podem depois ser usadas em filtros, pivot, correlação e outras funcionalidades existentes.'));
  sections.push(boldPara('Custo/Benefício: ', 'Custo moderado de implementação (extrações simples + algoritmos de legibilidade). Benefício alto pois elimina a necessidade de ferramentas externas para transformações comuns.'));
  sections.push(boldPara('Evolução Futura: ', 'Fórmulas customizáveis pelo utilizador. Colunas derivadas por expressão regular. Transformações em cadeia (pipeline visual). Colunas calculadas que se atualizam automaticamente.'));

  sections.push(heading2('12.4 Padrão de Evolução Progressiva'));
  sections.push(para('A v1.1 demonstra um padrão de evolução progressiva: todas as funcionalidades novas foram adicionadas sem quebrar funcionalidades existentes. Os menus foram reorganizados (Column Selection → Column) mas as operações mantiveram o seu comportamento. As renomeações (Binning → Binning / Bucketing, Keep Outliers → Choose Outliers) melhoram a clareza sem alterar a semântica.'));
  sections.push(para('O produto cartesiano e a remoção de duplicados complementam o ecossistema existente de operações sobre relações, e as operações Row Number/Rank/Dense Rank estendem a secção de binning com funcionalidades de classificação que seguem padrões SQL bem conhecidos.'));
  sections.push(para('A adopção de operações baseadas em índice de posição (em vez de depender de coluna id) torna o sistema mais robusto e flexível, permitindo operações sobre relações sem coluna id.'));
  sections.push(para('Este padrão de evolução sem ruptura é essencial para a manutenibilidade a longo prazo e a confiança dos utilizadores na estabilidade da ferramenta.'));
  sections.push(emptyLine());

  // Conclusion
  sections.push(heading1('Conclusão'));
  sections.push(para('O Relation Builder demonstra um equilíbrio cuidadoso entre funcionalidade avançada e complexidade gerível. As decisões de design seguem princípios sólidos:'));
  sections.push(bullet('Progressividade: Funcionalidades avançadas estão disponíveis mas não intrusivas.'));
  sections.push(bullet('Consistência: O mesmo código parametrizado serve todas as instâncias.'));
  sections.push(bullet('Autonomia: Sem dependências de frameworks, mantendo controlo total.'));
  sections.push(bullet('Extensibilidade: A arquitetura permite evolução sem reescrita.'));
  sections.push(emptyLine());
  sections.push(para('As áreas com maior potencial de evolução são: (1) persistência de dados via base de dados, (2) colaboração multi-utilizador, (3) visualizações gráficas avançadas, (4) automação via scripting/macros, e (5) replay e undo baseado no log de operações introduzido na v1.1. Estas evoluções devem ser priorizadas conforme feedback real de utilizadores.'));

  return new Document({
    sections: [{ children: sections }],
  });
}

// ============================================================
// MAIN: Generate all 3 documents
// ============================================================
async function main() {
  console.log('Generating Document 1: Requirements...');
  const doc1 = generateRequirementsDoc();
  const buf1 = await Packer.toBuffer(doc1);
  fs.writeFileSync('docs/01_Requisitos_RelationBuilder.docx', buf1);
  console.log('  → docs/01_Requisitos_RelationBuilder.docx');

  console.log('Generating Document 2: Usage Tests...');
  const doc2 = generateTestsDoc();
  const buf2 = await Packer.toBuffer(doc2);
  fs.writeFileSync('docs/02_Testes_Utilizacao_RelationBuilder.docx', buf2);
  console.log('  → docs/02_Testes_Utilizacao_RelationBuilder.docx');

  console.log('Generating Document 3: Reflective Analysis...');
  const doc3 = generateReflectionDoc();
  const buf3 = await Packer.toBuffer(doc3);
  fs.writeFileSync('docs/03_Analise_Reflexiva_RelationBuilder.docx', buf3);
  console.log('  → docs/03_Analise_Reflexiva_RelationBuilder.docx');

  console.log('\nAll 3 documents generated successfully in docs/ folder.');
}

main().catch(err => {
  console.error('Error generating documents:', err);
  process.exit(1);
});
