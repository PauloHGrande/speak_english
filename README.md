# Patch: Adicionar campo com resposta correta em inglês

Este patch adiciona um novo campo abaixo da tradução PT exibindo a resposta correta em inglês.

## Alterações
- Atualizado `app.component.html` para incluir:
```
<p><strong>Resposta (EN):</strong> {{ currentStep?.expected?.answers[0] }}</p>
```

## Como aplicar
1. Substitua o arquivo `src/app/app.component.html` pelo fornecido neste pacote.
2. Certifique-se de que `currentStep` e `expected.answers` existem no seu componente.
3. Rode `ng serve`.
