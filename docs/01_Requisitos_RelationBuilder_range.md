# Requisitos - Atributo Range (Kind: range)

## Definição

O atributo "range" é um tipo de campo que permite ao utilizador selecionar um valor numérico dentro de um intervalo definido, utilizando um controlo deslizante (slider).

## Configuração

Os campos range usam `"range"` como nome único no `attribute_kind`:

```json
{
  "attribute_kind": ["range"],
  "name": "Prioridade",
  "short_name": "Prio",
  "range": {
    "min": 0,
    "max": 100
  }
}
```

### Propriedades da configuração `range`

| Propriedade | Tipo    | Valor por omissão | Descrição                                      |
|-------------|---------|--------------------|-------------------------------------------------|
| `min`       | number  | `0`                | Valor mínimo do intervalo                       |
| `max`       | number  | `null`             | Valor máximo do intervalo (null = indefinido)   |

## Comportamento

### Operação Ver (View) e similares

Na visualização (tabela, cards, detail panel em modo view), o campo range apresenta o valor como um número simples, tal como se fosse um campo numérico comum.

### Operação Novo / Editar (New / Edit) e similares

Nas operações de edição, o campo range apresenta:

1. **Labels de min/max** — Acima do slider, mostrar os valores mínimo (alinhado à esquerda) e máximo (alinhado à direita), caso existam.

2. **Slider (input range)** — Elemento HTML `<input type="range">` configurado com:
   - `min` conforme a configuração (por omissão: 0)
   - `max` conforme a configuração (se null/indefinido, usar um valor razoável como 100)

3. **Input numérico** — À direita do slider, um `<input type="number">` que:
   - É actualizado automaticamente quando o utilizador move o slider
   - Quando o utilizador altera o valor no input numérico, o slider é actualizado correspondentemente
   - Sincronização bidirecional entre slider e input numérico

### Layout visual (Edit)

```
  0                    100
  ├──────────●──────────┤  [ 42 ]
  min label              max label    numeric input
```

## Armazenamento

O valor é armazenado como número (tipo base: `float`) na célula da relação.
