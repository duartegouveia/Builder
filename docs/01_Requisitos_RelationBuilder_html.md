# Requisitos - Atributo HTML (Subtipo de Att)

## Definição

O atributo "html" é um **subtipo de att** (não um tipo base de coluna) que permite ao utilizador introduzir e visualizar conteúdo HTML. Baseia-se numa textarea para edição e renderiza o HTML diretamente para visualização.

## Configuração

O kind "html" é definido dentro de um objeto att:

```json
{
  "attribute_kind": ["html"],
  "name": "Descrição Formatada",
  "short_name": "Desc"
}
```

## Comportamento nos Modos de Operação

### Modo New / Edit (e similares)

- O campo é apresentado como uma **textarea** onde o utilizador pode escrever conteúdo HTML livre.
- O utilizador introduz directamente o código HTML (tags, atributos, classes, etc.).

### Modo View (e similares)

- O conteúdo HTML é colocado dentro do div de valor do campo, permitindo que o **HTML seja renderizado** pelo browser.
- O utilizador vê o resultado visual do HTML (texto formatado, links, listas, etc.) em vez do código fonte.

## Pesquisa

### Pesquisa Simples e Pesquisa Avançada

- O conteúdo sobre o qual se pesquisa é o **texto visível** resultante da remoção de todas as tags HTML (incluindo os seus atributos, classes, etc.).
- A pesquisa funciona como se fosse sobre a parte textual do HTML, ignorando toda a marcação.
- Exemplo: Se o valor for `<p class="info"><strong>Olá</strong> mundo</p>`, a pesquisa opera sobre o texto `"Olá mundo"`.

## Exemplo de Utilização

```json
{
  "columns": {
    "id": "id",
    "nome": "string",
    "descricao": {
      "attribute_kind": ["html"],
      "name": "Descrição Rica",
      "short_name": "Desc",
      "interface_width": "long"
    }
  }
}
```
