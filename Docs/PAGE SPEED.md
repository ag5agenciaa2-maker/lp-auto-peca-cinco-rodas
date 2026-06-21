# Relatório de Otimização PageSpeed / Lighthouse

**Empresa:** Auto Peças Cinco Rodas  
**Data:** 08/06/2026  
**Skill:** PageSpeed Lighthouse Audit Refiner v2.2

---

## Resumo Executivo

A landing page foi auditada e otimizada seguindo o checklist completo do Lighthouse. Foram aplicadas correções em **Performance**, **Acessibilidade**, **Best Practices** e **SEO**.

---

## 1. Performance

### Correções Aplicadas

| Problema | Solução | Impacto |
|----------|---------|---------|
| Google Fonts render-blocking | Async-load com `preload` + `onload` trick | ↓ FCP/LCP |
| CSS não crítico (cookie-banner) bloqueando | Async-load com `preload` + `onload` | ↓ FCP/LCP |
| Scroll listener sem `requestAnimationFrame` | Adicionado rAF batching | ↓ TBT/INP |
| `document.body.style.overflow` inline (forced reflow) | Substituído por `classList.add('no-scroll')` | ↓ TBT/INP |
| Stagger de animação com `style.transitionDelay` inline | Substituído por `dataset.delay` + classes CSS | ↓ TBT |
| CSS crítico inline no `<head>` | Adicionado fallback de fonte para LCP imediato | ↓ FCP |

### Código: CSS crítico inline
```html
<style>
  .hero__title { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1); }
  .reveal.is-in { opacity: 1; transform: translateY(0); }
</style>
```

### Código: rAF batching no scroll
```js
/* PageSpeed fix: rAF batching evita forced reflow */
let rafPending = false;
const onScroll = () => {
  if (!nav || rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    nav.classList.toggle('is-stuck', window.scrollY > 50);
  });
};
```

### Código: body.no-scroll (sem forced reflow)
```css
/* PageSpeed fix: body no-scroll para modais/drawers sem forced reflow */
body.no-scroll { overflow: hidden; }
```

---

## 2. Acessibilidade

### Correções Aplicadas

| Problema | Solução | Impacto |
|----------|---------|---------|
| 64 SVGs sem `aria-hidden` | Adicionado `aria-hidden="true"` em todos os SVGs decorativos | ↑ Accessibility |
| Ícones dentro de links sem `aria-hidden` | Todos os SVGs internos agora têm `aria-hidden="true"` | ↑ Accessibility |

### Status dos SVGs
- **Total de SVGs:** 64
- **Com `aria-hidden="true"`:** 64 ✅
- **Com `aria-label`:** 21 (links/botões com ícones)

---

## 3. Best Practices

### Correções Aplicadas

| Problema | Solução | Impacto |
|----------|---------|---------|
| Links `target="_blank"` com `rel="noopener"` apenas | Substituído por `rel="noopener noreferrer"` em todos os links | ↑ Security |

**Total de links corrigidos:** 27

---

## 4. SEO

### Status (já otimizado na Skill SEO anterior)

| Item | Status |
|------|--------|
| `meta description` | ✅ Presente e otimizado |
| `canonical` | ✅ Presente |
| `robots.txt` | ✅ Sem `Disallow: /` indevido |
| `title` | ✅ Descritivo e otimizado |
| `lang="pt-BR"` | ✅ Presente |
| Structured data (JSON-LD) | ✅ Presente com `@graph` |
| Headings hierarchy | ✅ H1 → H2 → H3 correto |

---

## Checklist de Auditoria — Resultado Final

### Performance
- [x] Google Fonts com `&display=swap` + carregamento async
- [x] CSS não crítico com carregamento async
- [x] CSS crítico inline no `<head>`
- [x] Scroll listener com `{ passive: true }` + `requestAnimationFrame`
- [x] Animações de stagger usando `dataset` em vez de `style` inline
- [x] Modais/drawers usam `classList` em vez de `style.overflow` inline
- [ ] ~~Imagem LCP com preload~~ (LCP é texto, não imagem)
- [x] `width` e `height` em todas as `<img>`
- [x] `loading="lazy"` em imagens abaixo do fold
- [x] Scripts com `defer` antes do `</body>`

### Acessibilidade
- [x] `lang` no `<html>`
- [x] `<title>` descritivo
- [x] `alt` em todas as imagens
- [x] Todos os SVGs com `aria-hidden="true"` ou `aria-label`
- [x] Ícones decorativos dentro de links com `aria-hidden="true"`
- [x] `<iframe>` com `title`
- [ ] Touch targets ≥ 44×44px (verificar em teste real)
- [ ] Contraste WCAG 4.5:1 (verificar em teste real)

### Best Practices
- [x] Todos os `target="_blank"` com `rel="noopener noreferrer"`
- [x] Nenhum recurso HTTP em página HTTPS

### SEO
- [x] `<meta name="description">` presente
- [x] `<link rel="canonical">` presente
- [x] `robots.txt` válido
- [x] Hierarquia de headings correta
- [x] Structured data presente

---

## Recomendações Pendentes (Requerem Infra/Deploy)

### Alta Prioridade
1. **Compressão de imagens:** Verificar se todas as imagens WebP estão otimizadas (quality 80-85)
2. **Gzip/Brotli:** Ativar compressão no servidor
3. **Cache HTTP:** Configurar cache longo para assets estáticos
4. **HTTP/2 ou HTTP/3:** Verificar suporte no servidor

### Média Prioridade
5. **CDN:** Considerar CDN para assets estáticos
6. **Imagens responsivas:** Gerar variantes menores para mobile se imagens > 200KB
7. **Preconnect para domínios externos:** `https://assets.cdn.filesafe.space` (vídeos)

### Testar Após Deploy
8. Rodar **PageSpeed Insights** (mobile e desktop)
9. Rodar **Lighthouse** no Chrome DevTools
10. Verificar **Core Web Vitals** no Search Console

---

## Métricas Esperadas

| Métrica | Antes (Estimado) | Depois (Esperado) |
|---------|-----------------|-------------------|
| **FCP** | ~1.8s | ~1.2s |
| **LCP** | ~2.5s | ~1.8s |
| **TBT** | ~250ms | ~150ms |
| **CLS** | ~0.05 | ~0.02 |
| **INP** | ~200ms | ~150ms |
| **Performance Score** | ~75-80 | ~90-95 |
| **Accessibility Score** | ~85 | ~95-100 |
| **Best Practices Score** | ~90 | ~100 |
| **SEO Score** | ~95 | ~100 |

---

> **Nota:** Os scores reais só podem ser confirmados após deploy em ambiente de produção com HTTPS ativo.
