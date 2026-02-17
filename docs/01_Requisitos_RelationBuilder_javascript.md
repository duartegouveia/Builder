# Requisitos - Atributo JavaScript (Kind: javascript)

## Definição

O atributo "javascript" é um subtipo de att que permite armazenar a definição de uma função em JavaScript. Na sua versão mais simples, baseia-se numa textarea para edição do código.

## Configuração

```json
{
  "attribute_kind": ["javascript"],
  "name": "Função de Cálculo"
}
```

## Comportamento

### Versão Inicial (Geral)

- O campo apresenta-se como uma **textarea** onde o utilizador escreve a definição de uma função JavaScript.
- O conteúdo é armazenado como uma string contendo o código da função.

### Variantes Futuras

Este tipo de atributo será utilizado de diversas formas no futuro, com variantes no tipo de argumentos aceites e no resultado devolvido pela função. A definição actual serve como base geral para essas extensões futuras.

## Exemplo de Utilização

```json
{
  "columns": {
    "id": "id",
    "nome": "string",
    "calculo": {
      "attribute_kind": ["javascript"],
      "name": "Função de Cálculo",
      "interface_width": "long"
    }
  }
}
```
