# Requisitos - Atributo QR Code (Kind: qr_code)

## Definição

O atributo "qr_code" é um atributo **automático** que gera e apresenta um código QR associado ao registo. O valor é uma string composta por identificadores do projeto, entidade e registo, mais um número aleatório.

## Configuração

```json
{
  "attribute_kind": ["qr_code"],
  "name": "QR Code"
}
```

## Valor do Campo

O valor do campo qr_code é uma string com o formato:

```
projeto;entidade;id;random
```

| Componente | Descrição |
|---|---|
| `projeto` | Variável global que identifica o projeto. Por omissão: `"teste"`. |
| `entidade` | Nome da entidade (relação) actual. |
| `id` | ID do registo actual na entidade. |
| `random` | Número aleatório para garantir unicidade. |

Exemplo: `"teste;company;42;847291"`

## Comportamento nos Modos de Operação

### Modo View

- Apresenta graficamente o QR Code gerado a partir da string do valor.
- Tamanho de apresentação: **50px × 50px**.

### Modos New, Edit (e similares)

- O campo **não aparece** nas operações new, edit e similares.
- O valor é gerado automaticamente — o utilizador não o preenche.

## Restrições

O kind qr_code **não suporta**:

| Funcionalidade | Suportado |
|---|---|
| Pesquisa simples | Não |
| Pesquisa avançada | Não |
| Estatísticas | Não |
| Ordenação | Não |
| Filtragem | Não |
| Paper Form | Não |

## Scan de QR Code

Existirá uma opção geral da aplicação para fazer **scan de um código QR**. Ao ler o código:

1. A aplicação interpreta a string (`projeto;entidade;id;random`).
2. Abre a entidade correcta.
3. Mostra o registo correspondente ao `id` como seleccionado.

Esta funcionalidade é o principal caso de uso do kind qr_code — permite navegação rápida para um registo específico através da leitura física do código.

## Exemplo de Utilização

```json
{
  "columns": {
    "id": "id",
    "nome": "string",
    "qr": {
      "attribute_kind": ["qr_code"],
      "name": "Código QR"
    }
  }
}
```
