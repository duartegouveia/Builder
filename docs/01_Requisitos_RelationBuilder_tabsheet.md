# Requisitos - Atributo Tabsheet (Kind: tabsheet)

## Definição

O atributo "tabsheet" é um tipo **meramente visual** — não guarda qualquer valor no registo. A sua função é apresentar uma tabsheet visual com diversas opções (separadores/tabs) que permitem organizar uma interface com muitos atributos em secções.

## Configuração

O kind "tabsheet" é definido como um atributo att:

```json
{
  "attribute_kind": ["tabsheet"],
  "name": "Secções"
}
```

As opções que aparecem na tabsheet são definidas nas `options` da relação, da mesma forma que funcionam os campos de tipo select.

## Comportamento

### Visualização

- A tabsheet apresenta-se como um conjunto de separadores (tabs) horizontais.
- O utilizador pode clicar nos diferentes separadores para alternar entre secções.
- A tabsheet actual **não é persistida** — é um controlo puramente visual e de navegação.

### Relação com ShowHide

- A tabsheet só faz sentido quando usada em conjunto com a funcionalidade **showhide** dos atributos att.
- Cada atributo att pode incluir o subobjeto `showhide` para definir em que condições (i.e., em que tab) deve ser visível.
- A funcionalidade **showhide pode ser usada sem tabsheet** — é uma funcionalidade independente que a tabsheet aproveita.

## Finalidade

As tabsheets são utilizadas para definir **secções em interfaces com muitos atributos**, organizando-os visualmente em grupos lógicos. O utilizador navega entre secções sem que haja impacto nos dados — apenas na apresentação.

## Exemplo de Utilização

```json
{
  "columns": {
    "id": "id",
    "seccao": {
      "attribute_kind": ["tabsheet"],
      "name": "Secção"
    },
    "nome": {
      "attribute_kind": ["text"],
      "name": "Nome",
      "showhide": {
        "is_show": true,
        "conditions_or": [
          { "column": "seccao", "value": ["geral"] }
        ]
      }
    },
    "morada": {
      "attribute_kind": ["text"],
      "name": "Morada",
      "showhide": {
        "is_show": true,
        "conditions_or": [
          { "column": "seccao", "value": ["contactos"] }
        ]
      }
    },
    "telefone": {
      "attribute_kind": ["text"],
      "name": "Telefone",
      "showhide": {
        "is_show": true,
        "conditions_or": [
          { "column": "seccao", "value": ["contactos"] }
        ]
      }
    }
  },
  "options": {
    "seccao": {
      "geral": "Geral",
      "contactos": "Contactos"
    }
  }
}
```

Neste exemplo, a tabsheet "Secção" apresenta dois separadores — "Geral" e "Contactos". Os campos `nome` aparecem quando a tab "Geral" está activa, enquanto `morada` e `telefone` aparecem quando "Contactos" está activa.
