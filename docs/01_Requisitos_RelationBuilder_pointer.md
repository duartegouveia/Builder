# Requisitos - Atributo Pointer (Kind: pointer)

## Definição

O atributo "pointer" é um tipo de campo que permite referenciar entidades de outras relações de forma **unidirecional**. Visualmente, nas operações View, New, Edit (e similares), é idêntico a uma associação. No entanto, ao contrário das associações, as referências são guardadas apenas num dos lados — não existem atributos contrapartes no lado referenciado.

## Comparação com Association

| Aspecto | Association | Pointer |
|---------|-------------|---------|
| Direcionalidade | Bidirecional | Unidirecional |
| Contrapartes | `counterparts` — definem atributos no lado oposto | Não existem |
| Entidades alvo | Definidas indiretamente via `counterparts` | Definidas diretamente via `targets` |
| `cardinality_max` por omissão | `null` (ilimitado) | `1` |
| Sincronização ao gravar | Grava dos dois lados (bidirecional) | Grava apenas no lado do pointer |
| Validação de contrapartes | Verifica existência da entidade, atributo e referência recíproca | Não se aplica — não existem contrapartes |
| Referências duplicadas | Não permite | Não permite |
| Armazenamento de dados | Relation com colunas `{id, entity, foreign_key}` | Relation com colunas `{id, entity, foreign_key}` |
| Display atts | `counterpart_display_atts` (por implementar) | `target_display_atts` (por implementar, baseado em lookups) |
| Operações de seleção | SelectOne, SelectMany | SelectOne, SelectMany (adaptados) |

## Configuração

Os campos pointer usam `"pointer"` como nome único no `attribute_kind`:

```json
{
  "attribute_kind": ["pointer"],
  "name": "Projeto Associado",
  "short_name": "Projeto",
  "pointer": {
    "targets": [
      {
        "target_entity": "projects",
        "target_display_atts": []
      },
      {
        "target_entity": "tasks",
        "target_display_atts": []
      }
    ],
    "cardinality_min": 0,
    "cardinality_max": 1
  }
}
```

### Propriedades da configuração `pointer`

| Propriedade | Tipo | Valor por omissão | Descrição |
|-------------|------|-------------------|-----------|
| `targets` | array | `[]` | Lista de entidades alvo a que é possível apontar |
| `cardinality_min` | number | `0` | Número mínimo de referências obrigatórias |
| `cardinality_max` | number | `1` | Número máximo de referências permitidas (`null` = ilimitado) |

### Propriedades de cada elemento em `targets`

| Propriedade | Tipo | Valor por omissão | Descrição |
|-------------|------|-------------------|-----------|
| `target_entity` | string | `""` | Nome da entidade alvo (deve existir em `all_entities`) |
| `target_display_atts` | array | `[]` | Atributos da entidade alvo a exibir (funcionalidade futura, baseada em lookups — por implementar) |

## Armazenamento

Os dados de um pointer são guardados como uma **relation** aninhada, com a mesma estrutura de uma associação:

```json
{
  "pot": "relation",
  "columns": {
    "id": "id",
    "entity": "string",
    "foreign_key": "string"
  },
  "options": {},
  "rel_options": {},
  "items": [
    ["1", "projects", "42"]
  ]
}
```

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | id | Identificador único do registo de referência |
| `entity` | string | Nome da entidade alvo referenciada |
| `foreign_key` | string | Chave (id) do registo na entidade alvo |

## Comportamento Visual

### Operação Ver (View) e similares

O pointer apresenta-se de forma idêntica a uma associação:

- **`cardinality_max === 1`**: Apresenta a referência inline (nome da entidade e chave, ou display atts quando implementados).
- **`cardinality_max` ilimitado (`null`)**: Mostra a contagem de referências com botão "View" para abrir a lista completa.

### Operação Novo / Editar (New / Edit) e similares

O pointer reutiliza a mesma interface visual das associações:

- **`cardinality_max === 1`**: Botões "Select" e "Clear" inline para selecionar ou limpar a referência.
- **`cardinality_max` ilimitado (`null`)**: Contagem de referências com botão "View" para gerir a lista, utilizando SelectMany.

### SelectOne e SelectMany

As operações de seleção para pointer são adaptações das correspondentes nas associações:

1. **Origem das entidades disponíveis**: As entidades para seleção vêm de `targets[].target_entity` (em vez de `counterparts[].entity` nas associações).
2. **Sem verificação de contrapartes**: Não se verifica a existência de um atributo correspondente no lado oposto, pois as referências são unidirecionais.
3. **Sem gravação bidirecional**: Ao selecionar ou remover uma referência, a operação afeta apenas o lado do pointer — não há sincronização com a entidade referenciada.
4. **Sem duplicados**: Mantém-se a regra de não permitir introduzir referências duplicadas (mesma combinação de `entity` + `foreign_key`).

## Validação na Inicialização

Na inicialização da relação, para cada coluna pointer:

- **Verificar existência de target entities**: Para cada elemento em `targets`, confirmar que `target_entity` existe em `all_entities`. Se não existir, emitir `console.error`.
- **Não se verificam contrapartes**: Ao contrário das associações, não é necessário verificar a existência de atributos do outro lado, nem confirmar referências recíprocas.

## Helpers a Implementar

| Função | Descrição |
|--------|-----------|
| `isPointerAtt(att)` | Retorna `true` se `attribute_kind` inclui `'pointer'` |
| `getPointerConfig(att)` | Retorna a configuração `{ targets, cardinality_min, cardinality_max }` com valores por omissão |
| `createEmptyPointerRelation()` | Cria uma relation vazia com colunas `{id, entity, foreign_key}` |
| `getNextPointerId(pointerRelation)` | Retorna o próximo id numérico para novos registos |

## Regras de Negócio

1. Um pointer não cria nem remove registos na entidade referenciada — apenas guarda a referência.
2. A eliminação de um registo pointer remove apenas a referência no próprio atributo, sem afetar a entidade alvo.
3. `target_display_atts` será funcional quando os lookups estiverem implementados — até lá, a apresentação usa a informação base (`entity` + `foreign_key`).
4. Não é permitido criar referências duplicadas (mesma combinação `entity` + `foreign_key`) dentro do mesmo atributo pointer.
5. As restrições de `cardinality_min` e `cardinality_max` devem ser respeitadas da mesma forma que nas associações (desabilitar botões quando max atingido, warnings quando abaixo de min).
