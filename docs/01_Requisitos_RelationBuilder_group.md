# Requisitos - Atributo Group (Kind: group)

## Definição

O atributo "group" é um tipo de campo que serve para **agrupar visualmente** outros atributos na interface, utilizando layout flex horizontal ou vertical. O kind "group" não armazena dados em si — funciona apenas como contentor visual. Os valores dos atributos agrupados continuam a ser guardados **na raiz do item**, com os seus nomes originais.

## Configuração

Os campos group usam `"group"` como nome único no `attribute_kind`:

```json
{
  "attribute_kind": ["group"],
  "name": "Dados Pessoais",
  "group": {
    "direction": "horizontal",
    "order": 1
  }
}
```

### Propriedades da configuração `group`

| Propriedade | Tipo   | Valor por omissão | Descrição                                                       |
|-------------|--------|-------------------|-----------------------------------------------------------------|
| `direction` | string | `"vertical"`      | Direção do layout flex: `"horizontal"` ou `"vertical"`          |
| `order`     | number | `0`               | Ordem de apresentação do grupo em relação a outros elementos    |

## Propriedade geral do att: `belongs_to_bundle_or_group`

Para indicar que um atributo pertence a um grupo, cada att possui uma propriedade geral:

| Propriedade                  | Tipo   | Valor por omissão | Descrição                                                                   |
|------------------------------|--------|-------------------|-----------------------------------------------------------------------------|
| `belongs_to_bundle_or_group` | string | `""`              | Nome do atributo group a que este atributo pertence. Vazio = não pertence a nenhum grupo. |

Esta propriedade é definida **em cada att individual** (nas suas opções gerais), e o seu valor corresponde ao **nome do atributo do kind "group"** ao qual pertence.

### Exemplo

```json
{
  "columns": {
    "id": "id",
    "dados_pessoais": {
      "attribute_kind": ["group"],
      "name": "Dados Pessoais",
      "group": {
        "direction": "horizontal",
        "order": 1
      }
    },
    "nome": {
      "attribute_kind": [],
      "name": "Nome",
      "belongs_to_bundle_or_group": "dados_pessoais"
    },
    "apelido": {
      "attribute_kind": [],
      "name": "Apelido",
      "belongs_to_bundle_or_group": "dados_pessoais"
    }
  }
}
```

## Comportamento

### Renderização

1. Os atributos que pertencem a um grupo (via `belongs_to_bundle_or_group`) são renderizados **dentro** do contentor visual do grupo, em vez de serem renderizados na posição normal.
2. Dentro do grupo, os atributos são **ordenados pela propriedade `order`** de cada att.
3. O grupo aplica layout **flex** na direção configurada (`horizontal` ou `vertical`).

### Label visível

Se o grupo tem a **label visível** (conforme as opções gerais do att, como `show_label` ou equivalente), isso significa que existirá uma forma de agrupar visualmente os componentes — por exemplo, com um título, bordas, ou fundo diferenciado que identifique o agrupamento.

### Grupos aninhados

Um atributo só pode pertencer a **um único grupo** (um valor em `belongs_to_bundle_or_group`). No entanto, como um grupo também é um att, é possível que um grupo pertença a outro grupo, permitindo na prática ter **grupos dentro de grupos** (aninhamento).

```json
{
  "grupo_principal": {
    "attribute_kind": ["group"],
    "name": "Informação Geral",
    "group": { "direction": "vertical", "order": 1 }
  },
  "sub_grupo": {
    "attribute_kind": ["group"],
    "name": "Contactos",
    "belongs_to_bundle_or_group": "grupo_principal",
    "group": { "direction": "horizontal", "order": 2 }
  },
  "telefone": {
    "name": "Telefone",
    "belongs_to_bundle_or_group": "sub_grupo"
  },
  "email": {
    "name": "Email",
    "belongs_to_bundle_or_group": "sub_grupo"
  }
}
```

## Armazenamento

O kind "group" **não armazena dados**. Os valores dos atributos contidos no grupo continuam a ser guardados na **raiz do item**, com os seus nomes originais.

### Exemplo de dados

Para a configuração acima, um item é guardado como:

```json
{
  "id": 1,
  "nome": "João",
  "apelido": "Silva",
  "telefone": "912345678",
  "email": "joao@email.com"
}
```

Os campos `nome`, `apelido`, `telefone` e `email` ficam todos na raiz — o agrupamento é puramente visual.

## Comparação com Kind "object"

| Aspecto                     | Group                               | Object                                  |
|-----------------------------|--------------------------------------|-----------------------------------------|
| Armazenamento dos dados     | Na **raiz** do item, com nome original | Dentro de um **subobjeto** com o nome do att object |
| Efeito visual               | Agrupamento visual                   | Agrupamento visual                      |
| Grupos dentro deste kind    | Permitido (grupos dentro de grupos)  | **Não permitido** (grupos dentro de objects) |
| Este kind dentro de grupos  | Permitido (grupos dentro de grupos)  | **Permitido** (objects dentro de grupos) |

## Estado de Implementação

Este kind está em fase de **requisitos** — a implementação com a propriedade `belongs_to_bundle_or_group` e o layout flex ainda não foi realizada no código atual. O presente documento define o comportamento esperado para a futura implementação.

## Regras de Negócio

1. O kind "group" não gera nenhuma coluna de dados — é puramente visual e organizacional.
2. Um atributo só pode pertencer a um único grupo (um valor em `belongs_to_bundle_or_group`).
3. Grupos podem conter outros grupos (aninhamento), desde que cada grupo pertença a no máximo um grupo pai.
4. Os atributos dentro de um grupo são ordenados pela propriedade `order`.
5. Se o grupo tem label visível, deve existir uma delimitação visual clara dos componentes agrupados.
6. Os dados dos atributos contidos num grupo ficam sempre na raiz do item, nunca dentro de um subobjeto.
