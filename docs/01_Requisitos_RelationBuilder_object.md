# Requisitos - Atributo Object (Kind: object)

## Definição

O atributo "object" é um tipo de campo que agrupa visualmente outros atributos na interface, tal como o kind "group", mas com uma diferença fundamental no armazenamento: os valores dos atributos contidos dentro de um object são guardados **dentro de um subobjeto**, como subpropriedades, usando o nome do atributo object como chave.

## Diferença fundamental: Group vs Object

| Aspecto                     | Group                               | Object                                  |
|-----------------------------|--------------------------------------|-----------------------------------------|
| Armazenamento dos dados     | Na **raiz** do item, com nome original | Dentro de um **subobjeto** com o nome do att object |
| Efeito visual               | Agrupamento visual                   | Agrupamento visual                      |
| Grupos dentro deste kind    | Permitido (grupos dentro de grupos)  | **Não permitido** (grupos dentro de objects) |
| Este kind dentro de grupos  | Permitido (grupos dentro de grupos)  | **Permitido** (objects dentro de grupos) |

## Configuração

Os campos object usam `"object"` como nome único no `attribute_kind`:

```json
{
  "attribute_kind": ["object"],
  "name": "Morada"
}
```

Os atributos que pertencem a um object utilizam a mesma propriedade geral `belongs_to_bundle_or_group` para indicar a que object pertencem:

```json
{
  "columns": {
    "id": "id",
    "nome": "string",
    "morada": {
      "attribute_kind": ["object"],
      "name": "Morada"
    },
    "rua": {
      "name": "Rua",
      "belongs_to_bundle_or_group": "morada"
    },
    "cidade": {
      "name": "Cidade",
      "belongs_to_bundle_or_group": "morada"
    },
    "codigo_postal": {
      "name": "Código Postal",
      "belongs_to_bundle_or_group": "morada"
    }
  }
}
```

## Armazenamento

Ao contrário do kind "group", o kind "object" **afeta a estrutura dos dados**. Os valores dos atributos contidos dentro de um object são guardados como subpropriedades de um subobjeto cujo nome corresponde ao nome do atributo object.

### Exemplo de dados

Para a configuração acima, um item é guardado como:

```json
{
  "id": 1,
  "nome": "João Silva",
  "morada": {
    "rua": "Rua das Flores, 42",
    "cidade": "Lisboa",
    "codigo_postal": "1200-123"
  }
}
```

Note-se que `rua`, `cidade` e `codigo_postal` ficam dentro do subobjeto `morada`, e não na raiz do item.

## Comportamento

### Renderização

1. Os atributos que pertencem a um object (via `belongs_to_bundle_or_group`) são renderizados **dentro** do contentor visual do object.
2. A interface visual é semelhante à de um group — os componentes são agrupados visualmente.
3. Na operação View, o object mostra todas as subpropriedades com as suas labels e valores.
4. Nas operações Edit/New, o object apresenta os campos editáveis para cada subpropriedade.

### Edição (Editor existente)

O editor de object existente (`buildObjectEditor`) permite:
- Adicionar novas chaves
- Remover chaves existentes
- Editar valores de cada chave
- Visualizar pares chave-valor como lista editável

### Valor por omissão

O valor por omissão para um campo object é `{}` (objeto vazio).

## Restrições de aninhamento

### Não permitido: Grupos dentro de objects

**Não é possível** ter um atributo do kind "group" que pertença a um atributo do kind "object" (via `belongs_to_bundle_or_group`). Isto porque o group espera que os dados fiquem na raiz, o que entra em conflito com o armazenamento em subobjeto do object.

### Permitido: Objects dentro de grupos

**É possível** ter um atributo do kind "object" que pertença a um atributo do kind "group". Neste caso, o group organiza visualmente os elementos, e o object continua a guardar os seus dados num subobjeto.

```json
{
  "info_geral": {
    "attribute_kind": ["group"],
    "name": "Informação Geral",
    "group": { "direction": "vertical" }
  },
  "morada": {
    "attribute_kind": ["object"],
    "name": "Morada",
    "belongs_to_bundle_or_group": "info_geral"
  },
  "rua": {
    "name": "Rua",
    "belongs_to_bundle_or_group": "morada"
  },
  "cidade": {
    "name": "Cidade",
    "belongs_to_bundle_or_group": "morada"
  }
}
```

Dados resultantes:

```json
{
  "id": 1,
  "morada": {
    "rua": "Rua das Flores",
    "cidade": "Lisboa"
  }
}
```

O group `info_geral` é puramente visual; o object `morada` guarda `rua` e `cidade` dentro de si.

## Estado de Implementação

O kind "object" está **parcialmente implementado** no código atual. O editor de objetos (`buildObjectEditor`) e a renderização na tabela e detail view já existem. A propriedade `belongs_to_bundle_or_group` e o agrupamento visual com armazenamento em subobjeto automatizado (atts filhos de um object guardados automaticamente no subobjeto) são requisitos para implementação futura.

## Regras de Negócio

1. O kind "object" gera um subobjeto nos dados com o seu nome como chave.
2. Os atributos contidos no object são guardados como subpropriedades desse subobjeto.
3. Não é permitido ter kinds "group" dentro de um object (`belongs_to_bundle_or_group` de um group não pode apontar para um object).
4. É permitido ter objects dentro de groups (o group organiza visualmente, o object guarda dados em subobjeto).
5. Um atributo só pode pertencer a um único object ou group (um valor em `belongs_to_bundle_or_group`).
6. O valor por omissão é `{}` (objeto vazio).
