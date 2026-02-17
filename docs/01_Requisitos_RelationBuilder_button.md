# Requisitos - Atributo Button (Kind: button)

## Definição

O atributo "button" é um tipo de campo puramente visual que serve para despoletar ações preprogramadas em JavaScript. Este kind **não corresponde a nenhum dado guardado** — é apenas um elemento de interface. No entanto, o código JavaScript executado ao clicar no botão pode produzir mudanças nos dados, nomeadamente mudanças de estados ou outras operações sobre o registo.

Tal como todos os atributos, os botões podem estar visíveis apenas em determinadas operações (View, New, Edit), sendo isto configurável através das opções usuais do att (ex.: `visible_in`).

## Configuração

Os campos button usam `"button"` como nome único no `attribute_kind`:

```json
{
  "attribute_kind": ["button"],
  "name": "Aprovar",
  "short_name": "Apr",
  "button": {
    "view": "aprovarRegistoView",
    "new": "",
    "edit": "aprovarRegistoEdit"
  }
}
```

### Propriedades da configuração `button`

O subobjeto `.button` contém 3 subatributos, todos do tipo **string**:

| Propriedade | Tipo   | Valor por omissão | Descrição                                                                 |
|-------------|--------|-------------------|---------------------------------------------------------------------------|
| `view`      | string | `""`              | Referência para o código JavaScript a executar ao clicar no botão na operação **View** |
| `new`       | string | `""`              | Referência para o código JavaScript a executar ao clicar no botão na operação **New**  |
| `edit`      | string | `""`              | Referência para o código JavaScript a executar ao clicar no botão na operação **Edit** |

Cada uma destas strings guarda a referência (nome de função ou expressão) para o código JavaScript que será executado ao clicar no botão na respetiva operação.

Se a string estiver vazia para uma determinada operação, o botão não deve executar nenhuma ação nessa operação (pode estar oculto ou desativado, conforme a configuração de visibilidade do att).

## Comportamento

### Operação Ver (View)

Se `button.view` tiver uma referência válida, o botão é apresentado e, ao clicar, executa o código referenciado em `button.view`.

### Operação Novo (New)

Se `button.new` tiver uma referência válida, o botão é apresentado e, ao clicar, executa o código referenciado em `button.new`.

### Operação Editar (Edit)

Se `button.edit` tiver uma referência válida, o botão é apresentado e, ao clicar, executa o código referenciado em `button.edit`.

### Visibilidade por operação

A visibilidade do botão em cada operação segue as regras gerais do att (propriedades como `visible_in`, `readonly`, etc.). O subobjeto `button` define **qual código executar** em cada operação, mas a **visibilidade** é controlada pelas opções gerais do att.

## Armazenamento

O kind "button" **não armazena dados**. O valor da célula correspondente é sempre ignorado — o campo existe apenas como elemento visual na interface.

## Exemplo de Utilização

```json
{
  "columns": {
    "id": "id",
    "nome": "string",
    "estado": "string",
    "aprovar": {
      "attribute_kind": ["button"],
      "name": "Aprovar",
      "button": {
        "view": "aprovarRegisto",
        "new": "",
        "edit": "aprovarRegisto"
      }
    }
  }
}
```

Neste exemplo, o botão "Aprovar" aparece nas operações View e Edit (executando a função `aprovarRegisto`), mas não na operação New (string vazia).

## Estado de Implementação

Este kind está em fase de **requisitos** — a implementação ainda não foi realizada no código atual. O presente documento define o comportamento esperado para a futura implementação.

## Regras de Negócio

1. O kind "button" não gera nenhuma coluna de dados — é puramente visual.
2. O código JavaScript referenciado nas propriedades `view`, `new` e `edit` pode produzir efeitos colaterais nos dados (ex.: mudar estados), mas o próprio atributo não guarda valores.
3. A visibilidade do botão em cada operação é configurável pelas opções gerais do att, independentemente de existir ou não código definido no subobjeto `button`.
4. Se a referência de código estiver vazia para uma operação, o botão não deve executar nenhuma ação nessa operação.
