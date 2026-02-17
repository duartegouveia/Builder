# Requisitos - Atributo i18n (Kind: i18n)

## Definição

O atributo "i18n" é um tipo de campo que permite armazenar texto multilingue — o mesmo conteúdo traduzido em vários idiomas. O valor é guardado como um objeto cujas chaves são códigos de idioma (2 letras) e cujos valores são as traduções correspondentes.

## Configuração

Os campos i18n usam `"i18n"` como nome único no `attribute_kind`:

```json
{
  "attribute_kind": ["i18n"],
  "name": "Descrição"
}
```

## Armazenamento

O valor de um campo i18n é guardado como um **objeto** com códigos de idioma como chaves:

```json
{
  "pt": "Olá mundo",
  "en": "Hello world",
  "es": "Hola mundo",
  "fr": "Bonjour le monde",
  "de": "Hallo Welt"
}
```

### Propriedades do objeto i18n

| Propriedade | Tipo   | Descrição                                              |
|-------------|--------|--------------------------------------------------------|
| `{código}`  | string | Texto traduzido para o idioma identificado pelo código |

Os códigos de idioma correspondem às chaves definidas no dicionário `ALL_LANGUAGES` do sistema. As chaves são sempre strings de 2 caracteres (ex.: `pt`, `en`, `es`, `fr`, `it`, `de`).

### Valor por omissão

O valor por omissão para um campo i18n é `{}` (objeto vazio).

## Detecção automática

A função `isI18nObject(obj)` identifica automaticamente um objeto como sendo do tipo i18n se:
- O objeto não é null, não é array
- Tem **pelo menos uma chave** (objetos vazios `{}` **não** são considerados i18n)
- **Todas** as chaves são strings de 2 caracteres que existem no dicionário `ALL_LANGUAGES`

**Nota importante:** Um objeto vazio `{}` é o valor por omissão, mas **não é detetado como i18n** pela função `isI18nObject`. Isto é intencional — a auto-deteção de tipo (usada por exemplo na inferência de tipos ao importar dados) só classifica um objeto como i18n quando este já contém pelo menos uma tradução. Campos explicitamente definidos com `attribute_kind: ["i18n"]` são sempre tratados como i18n, independentemente do conteúdo.

## Resolução de texto: `getI18nText(value, lang)`

Para obter o texto num idioma específico, utiliza-se a função `getI18nText` com a seguinte cadeia de fallback:

1. Idioma pedido (`lang`)
2. Inglês (`en`)
3. Primeiro valor disponível no objeto
4. String vazia (`""`)

Se o valor não for um objeto (for uma string simples), é devolvido diretamente.

## Comportamento

### Operação Ver (View) — Tabela e Detail

Na visualização, o campo i18n apresenta **todas as entradas** formatadas como lista:

```
pt: Olá mundo
en: Hello world
es: Hola mundo
```

Cada entrada mostra o código do idioma em **negrito**, seguido de dois pontos e o texto correspondente. As entradas são separadas por quebras de linha (`<br>`).

Se o objeto estiver vazio, a célula apresenta-se vazia.

### Operação Novo / Editar (New / Edit)

Nas operações de edição, o campo i18n apresenta um **editor dinâmico** com as seguintes características:

1. **Entradas editáveis** — Cada tradução é apresentada como uma linha com:
   - Um **`<select>`** para escolher o código de idioma (mostra `código — nome do idioma`, ex.: `pt — Português`)
   - Um **`<input type="text">`** para o texto da tradução
   - Um **botão de remover** (✕) para eliminar essa entrada

2. **Botão adicionar** — Um botão `+ Add` permite adicionar uma nova entrada de idioma.

3. **Filtragem de idiomas** — Nos selects de cada entrada, os idiomas já utilizados noutras entradas são **filtrados/ocultados** automaticamente, impedindo duplicação de idiomas.

4. **Sincronização** — Qualquer alteração (mudança de idioma, edição de texto, adição ou remoção de entrada) atualiza imediatamente o valor do objeto i18n.

5. **Refresh dos selects** — Quando um idioma é selecionado ou alterado, todos os selects das outras entradas são atualizados para refletir os idiomas disponíveis.

### Layout visual (Edit)

```
  ┌─────────────────────────────────────────────┐
  │  [pt — Português ▼]  [ Olá mundo        ] ✕ │
  │  [en — English   ▼]  [ Hello world      ] ✕ │
  │  [es — Español   ▼]  [ Hola mundo       ] ✕ │
  │                                    [+ Add]   │
  └─────────────────────────────────────────────┘
```

## Exemplo de Utilização

```json
{
  "columns": {
    "id": "id",
    "codigo": "string",
    "descricao": {
      "attribute_kind": ["i18n"],
      "name": "Descrição",
      "short_name": "Desc"
    }
  },
  "items": [
    [1, "PROD001", {"pt": "Mesa de escritório", "en": "Office desk", "fr": "Bureau"}],
    [2, "PROD002", {"pt": "Cadeira ergonómica", "en": "Ergonomic chair"}]
  ]
}
```

## Regras de Negócio

1. O campo i18n armazena um objeto com códigos de idioma (2 letras) como chaves e traduções como valores.
2. Cada idioma só pode aparecer uma vez por campo — o editor impede duplicações filtrando os selects.
3. A resolução de texto segue a cadeia de fallback: idioma pedido → `en` → primeiro valor disponível.
4. A detecção automática (`isI18nObject`) exige que todas as chaves do objeto sejam códigos de idioma válidos do dicionário `ALL_LANGUAGES`.
5. O editor permite adicionar, editar e remover traduções dinamicamente.
6. O valor por omissão é `{}` (objeto vazio).
