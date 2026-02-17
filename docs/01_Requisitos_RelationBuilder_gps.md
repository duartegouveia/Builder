# Requisitos - Atributo GPS (Kind: gps)

## Definição

O atributo "gps" é um tipo de campo que permite armazenar coordenadas geográficas (latitude e longitude) e apresentar a localização num mapa interativo. O mapa utiliza **Leaflet.js** com tiles do **OpenStreetMap**, uma solução totalmente gratuita, sem limites de uso e sem necessidade de API key.

## Configuração

Os campos GPS usam `"gps"` como nome único no `attribute_kind`:

```json
{
  "attribute_kind": ["gps"],
  "name": "Localização",
  "short_name": "Loc"
}
```

## Armazenamento

O valor de um campo GPS é guardado como um **objeto** com as seguintes propriedades:

```json
{
  "latitude": 38.7223,
  "longitude": -9.1393,
  "bounds": {
    "north": 38.7300,
    "south": 38.7150,
    "east": -9.1250,
    "west": -9.1530
  }
}
```

### Propriedades do objeto GPS

| Propriedade        | Tipo   | Obrigatório | Descrição                                                              |
|--------------------|--------|-------------|------------------------------------------------------------------------|
| `latitude`         | number | Sim         | Latitude da localização (coordenada principal)                         |
| `longitude`        | number | Sim         | Longitude da localização (coordenada principal)                        |
| `bounds`           | object | Não         | Coordenadas do retângulo visível do mapa (bounding box)                |
| `bounds.north`     | number | Não         | Latitude do canto superior (norte) do mapa visível                     |
| `bounds.south`     | number | Não         | Latitude do canto inferior (sul) do mapa visível                       |
| `bounds.east`      | number | Não         | Longitude do canto direito (este) do mapa visível                      |
| `bounds.west`      | number | Não         | Longitude do canto esquerdo (oeste) do mapa visível                    |

### Introdução de coordenadas vs seleção no mapa

- **Quando o utilizador introduz coordenadas manualmente** (campos numéricos de latitude e longitude), o objeto guarda apenas `latitude` e `longitude`. O `bounds` fica vazio ou ausente.
- **Quando o utilizador seleciona a localização através do mapa**, as coordenadas `latitude` e `longitude` do pin são guardadas, e adicionalmente o `bounds` regista as coordenadas dos cantos do mapa visível naquele momento. Isto permite reconstituir o nível de zoom e enquadramento exatos que o utilizador escolheu.

O `bounds` fornece informação muito mais rica do que um simples nível de zoom, pois captura o enquadramento visual completo escolhido pelo utilizador.

## Comportamento

### Operação Ver (View)

Na visualização, o mapa é apresentado de forma interativa:

1. **Pin/Marca** — Uma marca (pin) é apresentada nas coordenadas de `latitude` e `longitude`, indicando a localização exata.
2. **Enquadramento** — Se existirem `bounds`, o mapa é inicializado com o enquadramento guardado (zoom e posição deduzidos das coordenadas dos cantos). Se não existirem, centrar no pin com um zoom razoável por omissão.
3. **Interação permitida** — O utilizador pode fazer **pan** (arrastar o mapa) e **zoom-in/zoom-out** para explorar a área. No entanto, estas interações **não alteram os dados guardados** — são apenas para exploração visual. Na próxima vez que o registo for aberto, o mapa volta ao enquadramento original.

### Operação Novo / Editar (New / Edit)

Nas operações de edição, o campo GPS apresenta:

1. **Campos numéricos** — Inputs para `latitude` e `longitude`, permitindo a introdução manual de coordenadas.
2. **Mapa interativo** — Um mapa Leaflet/OpenStreetMap que permite:
   - **Clicar para posicionar o pin** — Ao clicar no mapa, o pin move-se para a posição clicada e os campos de latitude/longitude são atualizados automaticamente.
   - **Arrastar o pin** — O pin pode ser arrastado para ajustar a posição, com atualização automática dos campos numéricos.
   - **Pan e zoom** — O utilizador pode navegar e fazer zoom no mapa para encontrar a localização desejada.
3. **Sincronização bidirecional** — Alterar os campos numéricos de latitude/longitude recentra o mapa e reposiciona o pin. Mover o pin atualiza os campos numéricos.
4. **Gravação do bounds** — Ao guardar, as coordenadas dos cantos visíveis do mapa (bounding box) são registadas no campo `bounds`, preservando o enquadramento exato escolhido pelo utilizador.

### Layout visual (Edit)

```
  Latitude:  [ 38.7223    ]   Longitude: [ -9.1393    ]

  ┌─────────────────────────────────────┐
  │                                     │
  │           OpenStreetMap             │
  │              📍                     │
  │           (pin/marca)               │
  │                                     │
  └─────────────────────────────────────┘
```

## Tabela (célula)

Na célula da tabela, o valor GPS pode ser apresentado de forma compacta:
- Formato: `📍 38.7223, -9.1393` (coordenadas abreviadas)
- Caso o valor seja nulo ou vazio: `—`

## Tecnologia

### Leaflet.js + OpenStreetMap

- **Leaflet.js** — Biblioteca JavaScript leve e open-source para mapas interativos.
- **OpenStreetMap** — Tiles de mapa gratuitos, sem limites de uso, sem API key.
- **Sem custos** — Ao contrário do Google Maps (que cobra a partir de um certo volume), esta combinação é totalmente gratuita.

### Tile URL

```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Atribuição obrigatória

Ao usar tiles do OpenStreetMap, é obrigatório incluir a atribuição:

```
© OpenStreetMap contributors
```

## Estado de Implementação

Este kind está em fase de **requisitos** — a implementação com Leaflet.js e OpenStreetMap ainda não foi realizada no código atual. O presente documento define o comportamento esperado para a futura implementação.

## Regras de Negócio

1. O campo GPS guarda sempre `latitude` e `longitude` como propriedades obrigatórias do objeto.
2. O campo `bounds` é opcional — é preenchido quando o utilizador posiciona a localização através do mapa (não quando introduz coordenadas manualmente).
3. Na operação View, o pan e zoom são interativos mas **não alteram os dados guardados**.
4. Na operação Edit/New, o bounds é atualizado ao guardar, capturando o enquadramento visual atual do mapa.
5. A sincronização entre campos numéricos e mapa deve ser bidirecional e imediata.
6. O mapa deve usar Leaflet.js com tiles OpenStreetMap para evitar custos de licenciamento.
