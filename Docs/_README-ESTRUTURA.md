# 📁 Estrutura e Padrão de Páginas (AG5)
**Cliente:** Auto Peças Cinco Rodas

---

## 🗺️ Mapa de Páginas e Profundidades
- `index.html` (raiz) -> Profundidade: raiz (caminhos diretos)
- `politica-de-privacidade.html` (raiz) -> Profundidade: raiz (caminhos diretos)
- `termos-e-condicoes.html` (raiz) -> Profundidade: raiz (caminhos diretos)

---

## 📌 Template Canônico
O código base de header, footer, mobile drawer, cookies e WhatsApp deve sempre partir do arquivo:
[Docs/_nav-footer-template.html](file:///c:/Users/mauri/Documents/00%20Processo%20Landing%20Pages/01%20-%20LP%20-%20Projeto%20Novo/lp-auto-peca-cinco-rodas/Docs/_nav-footer-template.html)

### Regra de Substituição do Placeholder `{{BASE}}`:
- Para arquivos na **raiz** (como as políticas atuais): substituir por `""` (vazio).
- Para arquivos em **subpastas** (ex: `blog/post.html`): substituir por `"../"`.

---

## 🛡️ Itens Obrigatórios em Toda Página
1. **Favicon:** Linkado no `<head>` de todas as páginas:
   ```html
   <link rel="icon" type="image/x-icon" href="Assets/favicon-cinco-rodas.ico" />
   <link rel="shortcut icon" type="image/x-icon" href="Assets/favicon-cinco-rodas.ico" />
   ```
2. **Nav e Hamburger:** Idênticos, apontando para as seções na home com o prefixo da home page (`index.html#secao`) nas subpáginas.
3. **Rodapé:** Sincronizado com os links de auto peças e contatos.
4. **Cookie Banner & Drawer Mobile:** Inclusão obrigatória de todos os elementos e JS.
5. **WhatsApp Premium Widget:** Presente e ativo com avatar e bubble.

---

📌 **Nota de Manutenção:** Ao editar o nav/footer na home page, lembre-se de re-sincronizar todas as páginas secundárias utilizando este README e o template canônico como referência.
