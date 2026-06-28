\# Product Specification



\## Princípios



\- Baixo atrito.

\- Utilidade acima da precisão.

\- Aprendizado contínuo.

\- Transparência.

\- IA como assistente.



\---



\## Regras de Negócio



\### Casas



\- Uma casa pode possuir múltiplos moradores.

\- Todos compartilham os mesmos dados.



\### Produtos



\- Produtos representam itens genéricos.

\- A marca não diferencia um produto.

\- O sistema deve normalizar produtos semelhantes.



Exemplo:



Leite Tirol



Leite Parmalat



↓



Leite Integral



\---



\### Compras



\- Toda compra pode ser registrada.

\- Inicialmente manual.

\- Futuramente via nota fiscal.



\---



\### Consumo



\- Opcional.

\- O sistema deve funcionar mesmo sem registros de consumo.



\---



\### Ajuste de inventário



\- Pode ser realizado a qualquer momento.

\- Serve para recalibrar o estoque estimado.



\---



\### Estoque



\- O sistema mantém uma estimativa da quantidade disponível.

\- Deve existir um nível de confiança dessa estimativa.



\---



\### Lista de compras



Gerada automaticamente considerando:



\- estoque estimado;

\- histórico;

\- padrões aprendidos;

\- previsão de consumo.



\---



\### Aprendizado



O sistema aprende:



\- frequência;

\- consumo;

\- sazonalidade;

\- mudanças de hábito;

\- recorrência.



\---



\### Exceções (pode ser mais pra frente)



Deve identificar:



\- compras fora do padrão;

\- alterações de consumo;

\- mudanças de comportamento.



\---



\### Inteligência Artificial



Pode:



\- interpretar notas;

\- categorizar;

\- normalizar;

\- sugerir validade;

\- explicar recomendações.



Toda sugestão deve ser editável.



Correções feitas pelo usuário devem ser reaproveitadas futuramente.



\---



\## Requisitos Funcionais



\- Login.

\- Casas.

\- Compras.

\- Produtos.

\- Consumo.

\- Ajuste de inventário.

\- Lista automática.

\- Recomendações.

\- Histórico.

\- Explicações.



\---



\## Fora do Escopo



\- ERP doméstico.

\- Controle perfeito de estoque.

\- Obrigatoriedade de registrar todos os consumos.

