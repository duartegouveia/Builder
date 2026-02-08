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
      children: [new TextRun({ text: `Versão 1.0 — ${new Date().toLocaleDateString('pt-PT')}`, font: FONT, size: 22, color: '999999' })],
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
  sections.push(para('7. Vista de Correlação'));
  sections.push(para('8. Vista de Diagrama (t-SNE)'));
  sections.push(para('9. Vista de IA'));
  sections.push(para('10. Vistas Guardadas'));
  sections.push(para('11. Filtragem'));
  sections.push(para('12. Ordenação'));
  sections.push(para('13. Agrupamento'));
  sections.push(para('14. Estatísticas por Coluna'));
  sections.push(para('15. Formatação Condicional'));
  sections.push(para('16. Binning (Discretização)'));
  sections.push(para('17. Operações sobre Linhas'));
  sections.push(para('18. Operações Multi-Registo'));
  sections.push(para('19. Diálogos de Seleção'));
  sections.push(para('20. Exportação'));
  sections.push(para('21. Importação'));
  sections.push(para('22. Verificação de Integridade'));
  sections.push(para('23. Navegação Hierárquica'));
  sections.push(para('24. Relações Aninhadas'));
  sections.push(para('25. Pesquisa Rápida'));
  sections.push(para('26. Paginação'));
  sections.push(para('27. Modos de Apresentação'));
  sections.push(para('28. Opções Configuráveis (rel_options)'));
  sections.push(para('29. Atalhos de Teclado'));
  sections.push(para('30. Responsividade e Interface'));

  // 1. Introduction
  sections.push(heading1('1. Introdução'));
  sections.push(para('O Relation Builder é uma ferramenta avançada de gestão de dados relacionais construída como aplicação web com HTML, JavaScript vanilla e CSS standard. O seu objetivo principal é permitir a criação, manipulação, análise e visualização de dados tabulares com funcionalidades comparáveis a folhas de cálculo profissionais, mas integradas numa interface web leve e sem dependências de frameworks.'));
  sections.push(boldPara('Público-alvo: ', 'Utilizadores que necessitam de controlo preciso sobre relações de dados, desde analistas de dados até gestores de informação.'));
  sections.push(boldPara('Filosofia: ', 'Todas as instâncias de relação utilizam código parametrizado idêntico via initRelationInstance(), garantindo consistência e manutenibilidade.'));

  // 2. Data Structure
  sections.push(heading1('2. Estrutura de Dados e Modelo Relacional'));
  sections.push(heading2('2.1 Formato da Relação'));
  sections.push(para('Cada relação é um objeto JSON com a seguinte estrutura:'));
  sections.push(bullet('columns: Objeto chave-valor onde as chaves são nomes de colunas e os valores são tipos (id, string, int, float, boolean, textarea, multilinestring, relation, date, datetime, time, select).'));
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
  sections.push(boldPara('multilinestring: ', 'Texto multi-linha alternativo.'));
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
  sections.push(heading2('6.2 Justificação'));
  sections.push(para('Tabelas pivot são essenciais para análise de dados categóricos. A capacidade de configurar múltiplas agregações simultaneamente e visualizar percentagens permite análise multidimensional sem ferramentas externas.'));

  // 7. Correlation View
  sections.push(heading1('7. Vista de Correlação'));
  sections.push(heading2('7.1 Funcionalidades'));
  sections.push(bullet('Análise de correlação entre pares de colunas.'));
  sections.push(bullet('Métodos suportados: Pearson, Spearman, Kendall Tau, Point-Biserial, Phi, Cramér\'s V.'));
  sections.push(bullet('Auto-deteção do método mais apropriado baseado nos tipos de dados.'));
  sections.push(bullet('Análise de todos os pares de colunas simultaneamente com matriz de correlação.'));
  sections.push(bullet('Painel de ajuda integrado explicando cada método e quando usar.'));
  sections.push(bullet('Classificação de força: desprezável, fraca, moderada, forte, muito forte.'));
  sections.push(bullet('Testes de normalidade (Shapiro-Wilk, D\'Agostino-Pearson, Anderson-Darling, Kolmogorov-Smirnov, Jarque-Bera) integrados na análise.'));
  sections.push(bullet('Box plots e histogramas como visualizações estatísticas auxiliares.'));
  sections.push(heading2('7.2 Justificação'));
  sections.push(para('A análise de correlação é fundamental para compreender relações entre variáveis. A auto-deteção reduz erros de utilizadores que não conhecem as premissas de cada método. A diversidade de métodos cobre desde dados contínuos normais até categóricos.'));

  // 8. Diagram View
  sections.push(heading1('8. Vista de Diagrama (t-SNE)'));
  sections.push(heading2('8.1 Funcionalidades'));
  sections.push(bullet('Visualização de similaridade usando t-SNE (t-Distributed Stochastic Neighbor Embedding).'));
  sections.push(bullet('Clustering automático por k-means com número configurável de clusters (2-20).'));
  sections.push(bullet('Parâmetros ajustáveis: perplexidade (5-100), iterações (100-2000).'));
  sections.push(bullet('Renderização em canvas HTML5 com cores distintas por cluster.'));
  sections.push(bullet('Popup de detalhes ao clicar num ponto do diagrama.'));
  sections.push(bullet('Indicação de progresso durante o cálculo.'));
  sections.push(heading2('8.2 Justificação'));
  sections.push(para('t-SNE é o algoritmo de referência para redução de dimensionalidade não-linear, permitindo descobrir padrões e agrupamentos em dados multidimensionais que não seriam visíveis em tabelas ou gráficos bidimensionais simples.'));

  // 9. AI View
  sections.push(heading1('9. Vista de IA'));
  sections.push(heading2('9.1 Funcionalidades'));
  sections.push(bullet('Consultas em linguagem natural sobre os dados da relação.'));
  sections.push(bullet('Sugestões de filtros baseadas em IA com aplicação automática.'));
  sections.push(bullet('Entrada por voz com suporte para 16 idiomas.'));
  sections.push(bullet('Integração com backend via API /api/ai/analyze.'));
  sections.push(bullet('Seleção de idioma para reconhecimento de voz.'));
  sections.push(heading2('9.2 Justificação'));
  sections.push(para('A integração de IA democratiza a análise de dados, permitindo que utilizadores sem conhecimento técnico façam perguntas sobre os seus dados em linguagem natural. A entrada por voz adiciona acessibilidade e conveniência.'));

  // 10. Saved Views
  sections.push(heading1('10. Vistas Guardadas'));
  sections.push(heading2('10.1 Funcionalidades'));
  sections.push(bullet('Gravação de snapshots da relação com nome personalizável.'));
  sections.push(bullet('Três tipos de gravação: Formato (uiState + colunas), Registos (items), Ambos.'));
  sections.push(bullet('Âmbito: Para Ti ou Para Todos.'));
  sections.push(bullet('Validação de nomes duplicados com confirmação de substituição.'));
  sections.push(bullet('Restauro via duplo-clique ou botão dedicado.'));
  sections.push(bullet('Eliminação com confirmação.'));
  sections.push(bullet('Metadados: data/hora de criação, tipo, âmbito.'));
  sections.push(bullet('Armazenamento no array saved do objeto relação.'));
  sections.push(heading2('10.2 Justificação'));
  sections.push(para('Vistas guardadas permitem preservar configurações complexas (filtros, ordenações, formatação) para reutilização futura, evitando a necessidade de reconfigurar a interface repetidamente. A distinção entre formato e registos dá flexibilidade.'));

  // 11. Filtering
  sections.push(heading1('11. Filtragem'));
  sections.push(heading2('11.1 Tipos de Filtro'));
  sections.push(boldPara('Filtro por Valores: ', 'Seleção/desseleção de valores individuais com checkboxes, pesquisa dentro dos valores, seleção total/nenhuma.'));
  sections.push(boldPara('Filtro por Comparação: ', 'Operadores de comparação (=, !=, >, <, >=, <=, entre, contém, começa com, termina com, regex) com suporte para tipos numéricos, texto e datas.'));
  sections.push(boldPara('Filtro por Texto: ', 'Critérios textuais avançados incluindo contém, não contém, começa com, termina com, expressão regular, maiúsculas/minúsculas.'));
  sections.push(boldPara('Filtro por Posição: ', 'Top N, Bottom N, Middle N registos baseado em valores numéricos.'));
  sections.push(boldPara('Filtro por Outliers: ', 'Detecção e filtragem de outliers usando método IQR ou Z-score.'));
  sections.push(boldPara('Filtro por Nulos: ', 'Mostrar apenas valores nulos ou não-nulos.'));
  sections.push(heading2('11.2 Funcionalidades Transversais'));
  sections.push(bullet('Indicadores visuais de colunas filtradas nos cabeçalhos.'));
  sections.push(bullet('Limpar filtros individualmente ou globalmente.'));
  sections.push(bullet('Diálogo de filtro com abas para cada tipo.'));
  sections.push(bullet('Preview do impacto do filtro antes de aplicar.'));
  sections.push(heading2('11.3 Justificação'));
  sections.push(para('A diversidade de métodos de filtragem permite abordar qualquer critério de seleção de dados. Filtros por posição e outliers são particularmente úteis para análise exploratória de dados, permitindo isolar rapidamente padrões extremos.'));

  // 12. Sorting
  sections.push(heading1('12. Ordenação'));
  sections.push(heading2('12.1 Funcionalidades'));
  sections.push(bullet('Ordenação por clique no cabeçalho da coluna (ascendente → descendente → sem ordenação).'));
  sections.push(bullet('Ordenação multi-coluna com Shift+clique para adicionar critérios.'));
  sections.push(bullet('Indicadores visuais de direção (▲/▼) com número de posição para multi-coluna.'));
  sections.push(bullet('Suporte para todos os tipos de dados com comparação adequada (numérica, textual, data).'));
  sections.push(bullet('Tratamento consistente de valores nulos (colocados no final).'));
  sections.push(heading2('12.2 Justificação'));
  sections.push(para('A ordenação multi-coluna é essencial para análise de dados complexos. A interação via Shift+clique segue padrões de interface conhecidos (Excel, bases de dados), reduzindo a curva de aprendizagem.'));

  // 13. Grouping
  sections.push(heading1('13. Agrupamento'));
  sections.push(heading2('13.1 Funcionalidades'));
  sections.push(bullet('Agrupamento por uma ou mais colunas.'));
  sections.push(bullet('Painel de grupo com breadcrumbs de navegação.'));
  sections.push(bullet('Drill-down interativo: clicar num grupo filtra para mostrar apenas esses registos.'));
  sections.push(bullet('Contagem de registos por grupo.'));
  sections.push(bullet('Suporte para agrupamento hierárquico (múltiplos níveis).'));
  sections.push(bullet('Navegação de volta via breadcrumbs.'));
  sections.push(heading2('13.2 Justificação'));
  sections.push(para('O agrupamento permite exploração top-down de grandes conjuntos de dados, facilitando a compreensão da distribuição e estrutura dos dados sem filtros complexos.'));

  // 14. Statistics
  sections.push(heading1('14. Estatísticas por Coluna'));
  sections.push(heading2('14.1 Funcionalidades'));
  sections.push(bullet('Painel de estatísticas com: contagem, valores únicos, nulos, mínimo, máximo, média, desvio padrão.'));
  sections.push(bullet('Quartis (Q1, mediana, Q3) e intervalo interquartil (IQR).'));
  sections.push(bullet('Box plot visual com deteção de outliers.'));
  sections.push(bullet('Histograma de distribuição de valores.'));
  sections.push(bullet('Testes de normalidade: Shapiro-Wilk, D\'Agostino-Pearson, Anderson-Darling, Kolmogorov-Smirnov, Jarque-Bera.'));
  sections.push(bullet('Indicação de p-valor e decisão sobre normalidade.'));
  sections.push(bullet('Estatísticas sumárias na linha de rodapé da tabela (configurável).'));
  sections.push(heading2('14.2 Justificação'));
  sections.push(para('Estatísticas descritivas completas são essenciais para análise exploratória. Os testes de normalidade informam a escolha de métodos estatísticos adequados (paramétricos vs. não-paramétricos). Box plots e histogramas fornecem compreensão visual imediata da distribuição.'));

  // 15. Conditional Formatting
  sections.push(heading1('15. Formatação Condicional'));
  sections.push(heading2('15.1 Funcionalidades'));
  sections.push(bullet('Escala de cores com legenda visual e 8 paletas: Blue-Red, Green-Yellow, Purple-Orange, Cool, Warm, Rainbow, Grayscale, Viridis.'));
  sections.push(bullet('Barras de dados sobrepostas na célula.'));
  sections.push(bullet('Ícones condicionais (setas, círculos, flags, estrelas, etc.).'));
  sections.push(bullet('Colorir resultados atuais (filtrados) com escala de cores.'));
  sections.push(bullet('Legenda de escala de cores com valores min/max.'));
  sections.push(bullet('Limpar formatação por coluna.'));
  sections.push(heading2('15.2 Justificação'));
  sections.push(para('A formatação condicional transforma dados numéricos em informação visual imediata. As 8 paletas suportam diferentes necessidades de contraste e acessibilidade. Barras de dados e ícones complementam a escala de cores para diferentes tipos de visualização.'));

  // 16. Binning
  sections.push(heading1('16. Binning (Discretização)'));
  sections.push(heading2('16.1 Funcionalidades'));
  sections.push(bullet('Discretização de colunas numéricas em intervalos.'));
  sections.push(bullet('Número de bins configurável.'));
  sections.push(bullet('Apresentação como intervalos (ex: "10-20") nos valores da tabela.'));
  sections.push(bullet('Interação com filtros por valores (filtragem por bin).'));
  sections.push(bullet('Reversão do binning para valores originais.'));
  sections.push(heading2('16.2 Justificação'));
  sections.push(para('O binning simplifica a análise de dados contínuos, permitindo agrupamento e filtragem por intervalos. É especialmente útil em combinação com tabelas pivot e agrupamento.'));

  // 17. Row Operations
  sections.push(heading1('17. Operações sobre Linhas'));
  sections.push(heading2('17.1 Operações Individuais'));
  sections.push(boldPara('Ver (View): ', 'Visualização formatada de todos os campos do registo em modo só-leitura.'));
  sections.push(boldPara('Editar (Edit): ', 'Formulário de edição com inputs tipados para cada campo.'));
  sections.push(boldPara('Copiar (Copy): ', 'Duplicação do registo com novo ID auto-gerado.'));
  sections.push(boldPara('Novo (New): ', 'Criação de registo vazio com ID auto-gerado.'));
  sections.push(boldPara('Eliminar (Delete): ', 'Remoção com confirmação.'));
  sections.push(boldPara('Formulário Papel (Paper Form): ', 'Visualização do registo em formato imprimível com campos e valores.'));
  sections.push(boldPara('Imprimir (Print): ', 'Abertura de janela de impressão com formatação adequada.'));
  sections.push(heading2('17.2 Justificação'));
  sections.push(para('As operações sobre linhas cobrem todo o ciclo de vida de um registo. A vista de formulário em papel é particularmente útil em contextos administrativos onde são necessários documentos físicos.'));

  // 18. Multi-Record Operations
  sections.push(heading1('18. Operações Multi-Registo'));
  sections.push(heading2('18.1 Operações'));
  sections.push(boldPara('Multi View: ', 'Visualização simultânea de múltiplos registos selecionados.'));
  sections.push(boldPara('Multi Edit: ', 'Edição simultânea de múltiplos registos com painel sincronizado.'));
  sections.push(boldPara('Multi Copy: ', 'Duplicação de todos os registos selecionados.'));
  sections.push(boldPara('Multi Delete: ', 'Eliminação em massa com confirmação e contagem.'));
  sections.push(boldPara('Group Edit: ', 'Aplicação de um valor a um campo específico em todos os registos selecionados.'));
  sections.push(boldPara('Merge: ', 'Fusão de múltiplos registos num único com controlo campo-a-campo sobre qual valor manter.'));
  sections.push(boldPara('Scrolling Multi-Panel: ', 'Visualização lado-a-lado com scroll sincronizado para comparação de registos.'));
  sections.push(heading2('18.2 Justificação'));
  sections.push(para('Operações multi-registo são essenciais para eficiência em conjuntos de dados grandes. O merge com controlo campo-a-campo resolve o problema comum de dados duplicados. O scroll sincronizado facilita a comparação visual.'));

  // 19. Selection Dialogs
  sections.push(heading1('19. Diálogos de Seleção'));
  sections.push(heading2('19.1 Select One'));
  sections.push(para('Abre um diálogo com cópia da relação (uiState limpo). Duplo-clique numa linha retorna o ID. O resultado é enviado para console.log, textarea.output_textarea_json e div.output_div_json.'));
  sections.push(heading2('19.2 Select Many'));
  sections.push(para('Similar a Select One mas com multicheck ativado. Ao fechar retorna array de IDs das linhas selecionadas.'));
  sections.push(heading2('19.3 Choose Many'));
  sections.push(para('Duas cópias da relação empilhadas: fonte (todos os itens) e alvo (vazio). Duplo-clique na fonte copia para alvo. Duplo-clique no alvo remove. Ao fechar retorna array de IDs do alvo. Inclui pesquisa integrada.'));
  sections.push(heading2('19.4 Justificação'));
  sections.push(para('Os diálogos de seleção permitem integração com sistemas externos, funcionando como componentes reutilizáveis de escolha. A abordagem de Choose Many com duas listas é particularmente intuitiva para seleção de subconjuntos.'));

  // 20. Export
  sections.push(heading1('20. Exportação'));
  sections.push(heading2('20.1 Funcionalidades'));
  sections.push(bullet('Âmbito: todos os registos, selecionados (checked), ou linha selecionada.'));
  sections.push(bullet('Formatos: CSV, Excel XML, XML, Word/HTML, PDF/HTML.'));
  sections.push(bullet('Templates server-side com interpolação de variáveis.'));
  sections.push(bullet('Templates armazenados em client/public/export/ organizados por nome de relação e formato.'));
  sections.push(bullet('API endpoints: /api/export/templates (lista) e /api/export/template/:path (conteúdo).'));
  sections.push(bullet('Proteção contra path traversal na API.'));
  sections.push(bullet('Download direto ou abertura em nova aba.'));
  sections.push(heading2('20.2 Justificação'));
  sections.push(para('A exportação multi-formato garante interoperabilidade com outras ferramentas. O sistema de templates permite personalização de formatos de saída sem alteração de código. A proteção contra path traversal é uma medida de segurança essencial.'));

  // 21. Import
  sections.push(heading1('21. Importação'));
  sections.push(heading2('21.1 Funcionalidades'));
  sections.push(bullet('Upload via drag-and-drop ou clique.'));
  sections.push(bullet('Auto-deteção de formato: CSV, TSV, JSON, XML, HTML, Excel XML.'));
  sections.push(bullet('Suporte multi-tabela com dropdown de seleção.'));
  sections.push(bullet('Preview dos dados importados antes de confirmação.'));
  sections.push(bullet('Mapeamento inteligente de colunas por similaridade de nomes.'));
  sections.push(bullet('Conversão automática de tipos (int, float, boolean).'));
  sections.push(bullet('Modo de edição de texto com valores tab-separated.'));
  sections.push(bullet('Atribuição automática de IDs.'));
  sections.push(bullet('Mensagem de erro clara para formato .xlsx binário (não suportado).'));
  sections.push(heading2('21.2 Justificação'));
  sections.push(para('A importação flexível permite integrar dados de diversas fontes. A auto-deteção e mapeamento inteligente reduzem o esforço manual. O preview previne importações incorretas.'));

  // 22. Integrity Check
  sections.push(heading1('22. Verificação de Integridade'));
  sections.push(heading2('22.1 Funcionalidades'));
  sections.push(bullet('Validação do campo "pot" da relação.'));
  sections.push(bullet('Verificação de chaves de atributos conhecidas.'));
  sections.push(bullet('Validação de tipos de coluna contra KNOWN_COLUMN_KINDS.'));
  sections.push(bullet('Verificação de comprimentos de arrays de items.'));
  sections.push(bullet('Consistência de tipos de valores (validação int, float, boolean).'));
  sections.push(bullet('Deteção de IDs duplicados.'));
  sections.push(bullet('Validação de propriedades rel_options.'));
  sections.push(bullet('Verificação recursiva de relações aninhadas.'));
  sections.push(bullet('Resultados em diálogo estilizado com categorias: erro, aviso, info.'));
  sections.push(heading2('22.2 Justificação'));
  sections.push(para('A verificação de integridade é uma salvaguarda contra corrupção de dados. A verificação recursiva garante consistência em toda a hierarquia de relações. A categorização de resultados permite priorizar correções.'));

  // 23. Hierarchical Navigation
  sections.push(heading1('23. Navegação Hierárquica'));
  sections.push(heading2('23.1 Funcionalidades'));
  sections.push(bullet('Ativação via rel_options.show_hierarchy com especificação de hierarchy_column.'));
  sections.push(bullet('Navegação em árvore baseada em relações pai-filho.'));
  sections.push(bullet('Breadcrumbs de localização na hierarquia.'));
  sections.push(bullet('Filtragem automática ao navegar para um nó.'));
  sections.push(bullet('Valor raiz configurável (hierarchy_root_value).'));
  sections.push(heading2('23.2 Justificação'));
  sections.push(para('A navegação hierárquica é essencial para dados com estrutura em árvore (categorias, organogramas, taxonomias). Permite exploração natural de relações pai-filho sem configuração complexa.'));

  // 24. Nested Relations
  sections.push(heading1('24. Relações Aninhadas'));
  sections.push(heading2('24.1 Funcionalidades'));
  sections.push(bullet('Colunas do tipo "relation" contêm sub-relações completas.'));
  sections.push(bullet('Abertura em diálogo modal ou painel lateral/inferior (conforme single_item_mode).'));
  sections.push(bullet('Cada sub-relação é uma instância completa com todas as funcionalidades.'));
  sections.push(bullet('Profundidade ilimitada de aninhamento.'));
  sections.push(bullet('Cleanup automático de instâncias ao fechar diálogos.'));
  sections.push(bullet('Opções por defeito aplicadas automaticamente a sub-relações.'));
  sections.push(heading2('24.2 Justificação'));
  sections.push(para('O aninhamento ilimitado de relações permite modelar estruturas de dados arbitrariamente complexas. A utilização do mesmo código parametrizado garante consistência e reduz manutenção.'));

  // 25. Quick Search
  sections.push(heading1('25. Pesquisa Rápida'));
  sections.push(heading2('25.1 Funcionalidades'));
  sections.push(bullet('Campo de pesquisa na barra de vistas.'));
  sections.push(bullet('Filtragem em tempo real enquanto o utilizador digita.'));
  sections.push(bullet('Pesquisa em todos os campos de cada registo.'));
  sections.push(bullet('Botão de limpar pesquisa.'));
  sections.push(bullet('Disponível nas vistas de tabela e cartões.'));
  sections.push(heading2('25.2 Justificação'));
  sections.push(para('A pesquisa rápida é a forma mais imediata de encontrar registos específicos, complementando os filtros avançados para casos de uso simples.'));

  // 26. Pagination
  sections.push(heading1('26. Paginação'));
  sections.push(heading2('26.1 Funcionalidades'));
  sections.push(bullet('Tamanhos de página: 10, 20, 50, 100, All.'));
  sections.push(bullet('Navegação: primeira, anterior, próxima, última.'));
  sections.push(bullet('Indicador de página atual e total.'));
  sections.push(bullet('Contagem de linhas totais e selecionadas.'));
  sections.push(bullet('Desativação automática de botões em limites.'));
  sections.push(heading2('26.2 Justificação'));
  sections.push(para('A paginação é essencial para performance e usabilidade com grandes conjuntos de dados, evitando renderização de milhares de linhas simultaneamente.'));

  // 27. Display Modes
  sections.push(heading1('27. Modos de Apresentação'));
  sections.push(heading2('27.1 Funcionalidades'));
  sections.push(bullet('Dialog (modal): Conteúdo de detalhe abre em popup sobre a tabela.'));
  sections.push(bullet('Right (painel lateral): Conteúdo abre em painel à direita da tabela.'));
  sections.push(bullet('Bottom (painel inferior): Conteúdo abre em painel abaixo da tabela.'));
  sections.push(bullet('Configurável via rel_options.single_item_mode.'));
  sections.push(bullet('Transição suave com scroll automático para o painel inferior.'));
  sections.push(heading2('27.2 Justificação'));
  sections.push(para('Diferentes modos de apresentação acomodam diferentes preferências de trabalho e tamanhos de ecrã. O painel lateral permite comparação simultânea com a tabela; o modal foca atenção num único registo.'));

  // 28. rel_options
  sections.push(heading1('28. Opções Configuráveis (rel_options)'));
  sections.push(heading2('28.1 Lista Completa'));
  sections.push(boldPara('editable: ', 'Ativa/desativa edição inline de células.'));
  sections.push(boldPara('show_multicheck: ', 'Mostra/oculta checkboxes de seleção multi-linha.'));
  sections.push(boldPara('show_natural_order: ', 'Mostra/oculta coluna de ordem natural.'));
  sections.push(boldPara('show_id: ', 'Mostra/oculta coluna de ID.'));
  sections.push(boldPara('show_column_kind: ', 'Mostra/oculta indicador de tipo de coluna.'));
  sections.push(boldPara('show_stats: ', 'Mostra/oculta linha de estatísticas no rodapé.'));
  sections.push(boldPara('show_hierarchy: ', 'Ativa/desativa navegação hierárquica.'));
  sections.push(boldPara('hierarchy_column: ', 'Coluna usada para relações pai-filho na hierarquia.'));
  sections.push(boldPara('single_item_mode: ', 'Modo de apresentação de detalhe (dialog, right, bottom).'));
  sections.push(boldPara('label_field_top_down: ', 'Campo usado como label em breadcrumbs e títulos.'));
  sections.push(boldPara('OnDoubleClickAction: ', 'Ação ao duplo-clicar numa linha (view, edit).'));
  sections.push(boldPara('general_view_options: ', 'Array de vistas disponíveis (Table, Cards, Pivot, Correlation, Diagram, AI, Saved, Structure).'));
  sections.push(boldPara('general_always_visible_options: ', 'Array de ações sempre visíveis na barra de vistas.'));
  sections.push(boldPara('general_line_options: ', 'Array de operações disponíveis no menu de linha.'));
  sections.push(boldPara('general_multi_options: ', 'Array de operações multi-registo disponíveis.'));
  sections.push(heading2('28.2 Justificação'));
  sections.push(para('A configurabilidade granular permite adaptar a interface a diferentes casos de uso sem alterar código. Um formulário de entrada simples pode ocultar vistas avançadas; uma aplicação de análise pode ativar todas as funcionalidades.'));

  // 29. Keyboard Shortcuts
  sections.push(heading1('29. Atalhos de Teclado'));
  sections.push(heading2('29.1 Funcionalidades'));
  sections.push(bullet('Badge informativo (ℹ) na barra de vistas com tooltip de atalhos.'));
  sections.push(bullet('Ctrl+clique para seleção de colunas.'));
  sections.push(bullet('Shift+clique para ordenação multi-coluna.'));
  sections.push(bullet('Navegação por teclado nos menus.'));
  sections.push(heading2('29.2 Justificação'));
  sections.push(para('Atalhos de teclado aumentam a produtividade de utilizadores avançados, reduzindo a dependência do rato para operações frequentes.'));

  // 30. Responsiveness
  sections.push(heading1('30. Responsividade e Interface'));
  sections.push(heading2('30.1 Funcionalidades'));
  sections.push(bullet('Design responsivo com CSS media queries.'));
  sections.push(bullet('Design tokens via CSS custom properties (variáveis).'));
  sections.push(bullet('Toast notifications para feedback de ações.'));
  sections.push(bullet('Diálogos modais com overlay para operações complexas.'));
  sections.push(bullet('Container redimensionável para a tabela.'));
  sections.push(bullet('Indicadores visuais de estado (filtros ativos, ordenação, seleção).'));
  sections.push(heading2('30.2 Justificação'));
  sections.push(para('Uma interface responsiva e informativa melhora a experiência do utilizador em diferentes dispositivos. O feedback visual constante garante que o utilizador compreende o estado atual dos dados e das operações aplicadas.'));

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
      children: [new TextRun({ text: `Versão 1.0 — ${new Date().toLocaleDateString('pt-PT')}`, font: FONT, size: 22, color: '999999' })],
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
      children: [new TextRun({ text: `Versão 1.0 — ${new Date().toLocaleDateString('pt-PT')}`, font: FONT, size: 22, color: '999999' })],
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
    '3.2 Ordenação Multi-Coluna',
    'Essencial. Ordenação é a operação mais básica de manipulação de dados tabulares.',
    'Apenas ordenação simples (sem multi-coluna). Ordenação via diálogo dedicado (em vez de clique no cabeçalho). Ordenação natural/smart sorting (deteção automática de padrões).',
    'O paradigma clique/shift+clique é standard e eficiente. O ciclo ascendente→descendente→sem é previsível. Os indicadores visuais com posição (₁, ₂) são informativos sem serem intrusivos.',
    'Utilizadores esperam "clicar no cabeçalho ordena" — isto está perfeitamente alinhado com Excel e outras ferramentas.',
    'Custo baixo-moderado. Benefício alto. A implementação multi-coluna adiciona pouca complexidade sobre a simples.',
    'Ordenação custom (funções de comparação definidas pelo utilizador). Ordenação agrupada (manter grupos juntos). Natural sort para strings alfanuméricas.'
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
    'O menu ⋯ é compacto e contextual. O formulário de edição com inputs tipados é mais estruturado que edição inline. A impressão em formato papel atende necessidades administrativas.',
    'O modelo CRUD é universalmente compreendido. "Ver", "Editar", "Copiar", "Eliminar" são ações atómicas e previsíveis.',
    'Custo baixo-moderado. Benefício máximo (funcionalidade core). A vista de papel/impressão é um custo adicional baixo com benefício nicho significativo.',
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

  // Conclusion
  sections.push(heading1('Conclusão'));
  sections.push(para('O Relation Builder demonstra um equilíbrio cuidadoso entre funcionalidade avançada e complexidade gerível. As decisões de design seguem princípios sólidos:'));
  sections.push(bullet('Progressividade: Funcionalidades avançadas estão disponíveis mas não intrusivas.'));
  sections.push(bullet('Consistência: O mesmo código parametrizado serve todas as instâncias.'));
  sections.push(bullet('Autonomia: Sem dependências de frameworks, mantendo controlo total.'));
  sections.push(bullet('Extensibilidade: A arquitetura permite evolução sem reescrita.'));
  sections.push(emptyLine());
  sections.push(para('As áreas com maior potencial de evolução são: (1) persistência de dados via base de dados, (2) colaboração multi-utilizador, (3) visualizações gráficas avançadas, e (4) automação via scripting/macros. Estas evoluções devem ser priorizadas conforme feedback real de utilizadores.'));

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
