# Requisitos - Sistema ShowHide (Atributos Att)

## Definição

O sistema **showhide** permite controlar a visibilidade de atributos att em formulários, com base em condições dinâmicas ligadas ao valor de outras colunas. É definido como um subobjeto dentro da definição de cada atributo att.

## Configuração

Cada atributo att pode incluir um subobjeto `showhide` na sua definição:

```json
{
  "attribute_kind": ["text"],
  "name": "Campo Condicional",
  "showhide": {
    "is_show": true,
    "conditions_and": [],
    "conditions_or": []
  }
}
```

### Propriedades

| Propriedade | Tipo | Default | Descrição |
|---|---|---|---|
| `is_show` | boolean | `true` | Quando `true`, o campo começa **escondido** e torna-se visível quando as condições são verificadas. Quando `false`, o campo começa **visível** e fica escondido quando as condições são verificadas. |
| `conditions_and` | array | `[]` | Lista de condições combinadas com operador lógico **AND** (todas devem ser verdadeiras). |
| `conditions_or` | array | `[]` | Lista de condições combinadas com operador lógico **OR** (pelo menos uma deve ser verdadeira). |

### Comportamento de `is_show`

- **`is_show: true`** (valor por omissão): O atributo começa escondido e passa a estar visível quando as condições se verificam. Útil para campos que só devem aparecer em determinadas circunstâncias (ex: associado a uma tabsheet ou a uma seleção específica).

- **`is_show: false`**: O atributo começa visível e fica escondido quando as condições se verificam. Útil para campos que não fazem sentido serem preenchidos em determinadas condições.

## Formato das Condições

Cada condição é um subobjeto com o seguinte formato:

```json
{
  "column": "nome_da_coluna",
  "value": ["valor1", "valor2"]
}
```

| Propriedade | Tipo | Descrição |
|---|---|---|
| `column` | string | Nome da coluna cujo valor é avaliado pela condição. |
| `value` | array | Array com um ou mais valores possíveis. A condição é verdadeira se o valor atual da coluna corresponder a qualquer um dos valores listados. Se o array estiver vazio, a condição é ignorada. |

## Combinação de Condições

- As condições podem ser combinadas com `conditions_and` **ou** `conditions_or`, mas **não faz sentido combinar ambos ao mesmo tempo**.
- `conditions_and`: Todas as condições devem ser verdadeiras para que o resultado da avaliação seja verdadeiro.
- `conditions_or`: Pelo menos uma condição deve ser verdadeira para que o resultado da avaliação seja verdadeiro.

## Dependências entre Colunas

Ao inicializar uma relação, o sistema deve construir um mapa de dependências (`columnDependencies`) que registe quais colunas são referenciadas em condições showhide de outros atributos. Quando o valor de uma coluna referenciada é alterado (em formulários new/edit), o sistema deve reavaliar a visibilidade dos campos dependentes e mostrá-los ou escondê-los conforme o resultado das condições.

## Contexto de Utilização

- O sistema showhide funciona de forma autónoma — pode ser usado em qualquer atributo att, independentemente de haver ou não tabsheets.
- É frequentemente usado em conjunto com o kind **tabsheet**, onde cada opção da tabsheet altera a visibilidade de grupos de campos.
- A funcionalidade showhide é avaliada em tempo real nos formulários de operação (new, edit, e similares).

## Validação no Integrity Check

A operação "Integrity Check" deve verificar:

- Se a coluna indicada em cada condição (`column`) existe efetivamente na relação.
- Se existirem referências a colunas inexistentes, deve ser reportado como um erro/warning.

## Exemplo Completo

```json
{
  "columns": {
    "tipo": "select",
    "campo_empresa": {
      "attribute_kind": ["text"],
      "name": "Nome da Empresa",
      "showhide": {
        "is_show": true,
        "conditions_and": [
          { "column": "tipo", "value": ["empresa", "organizacao"] }
        ]
      }
    },
    "campo_particular": {
      "attribute_kind": ["text"],
      "name": "Nome Particular",
      "showhide": {
        "is_show": true,
        "conditions_or": [
          { "column": "tipo", "value": ["particular"] }
        ]
      }
    },
    "campo_universal": {
      "attribute_kind": ["text"],
      "name": "Campo Sem Sentido para Empresas",
      "showhide": {
        "is_show": false,
        "conditions_and": [
          { "column": "tipo", "value": ["empresa"] }
        ]
      }
    }
  },
  "options": {
    "tipo": {
      "particular": "Particular",
      "empresa": "Empresa",
      "organizacao": "Organização"
    }
  }
}
```

Neste exemplo:
- `campo_empresa` só aparece quando `tipo` é "empresa" ou "organizacao".
- `campo_particular` só aparece quando `tipo` é "particular".
- `campo_universal` está visível por defeito, mas esconde-se quando `tipo` é "empresa".
