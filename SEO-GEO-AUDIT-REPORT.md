# Relatório de Auditoria SEO/GEO — Auto Peças Cinco Rodas

**Data da auditoria:** 08/06/2026  
**Especialista:** SEO/GEO Specialist (Skill AG5)  
**Projeto:** Auto Peças Cinco Rodas — Landing Page  
**URL:** https://www.autopecascincorodas.com.br/

---

## Resumo Executivo

A landing page da Auto Peças Cinco Rodas recebeu uma otimização completa de SEO (Search Engine Optimization) e GEO (Generative Engine Optimization). Foram implementadas melhorias técnicas, estruturais e de conteúdo para aumentar a visibilidade no Google e a probabilidade de citação em IA (ChatGPT, Claude, Perplexity).

---

## 1. Melhorias Técnicas Implementadas

### Meta Tags Otimizadas
| Elemento | Antes | Depois |
|----------|-------|--------|
| **Title** | `Auto Peças Cinco Rodas — Peças, suspensão e oficina em Santa Cruz` | `Auto Peças e Oficina Mecânica em Santa Cruz RJ \| Cinco Rodas` |
| **Description** | `Tradição desde 1975 em Santa Cruz/RJ...` | `Auto peças e oficina mecânica em Santa Cruz, RJ desde 1975. Suspensão, freios, motor, embreagem e diagnóstico. Peças nacionais e importadas. Entrega grátis.` |
| **Keywords** | ❌ Não existia | ✅ Adicionadas (auto peças santa cruz, oficina mecânica santa cruz, suspensão, freios...) |
| **Robots** | ❌ Não existia | ✅ `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| **Canonical** | ❌ Não existia | ✅ `https://www.autopecascincorodas.com.br/` |
| **Author** | ❌ Não existia | ✅ `Auto Peças Cinco Rodas` |

### Open Graph (Facebook/LinkedIn)
- ✅ `og:type` = `business.business`
- ✅ `og:title`, `og:description`, `og:image` (1200x630)
- ✅ `og:locale` = `pt_BR`
- ✅ Dados de contato da empresa (`business:contact_data:*`)

### Twitter Cards
- ✅ `twitter:card` = `summary_large_image`
- ✅ `twitter:title`, `twitter:description`, `twitter:image`

### Geo Tags (SEO Local)
- ✅ `geo.region` = `BR-RJ`
- ✅ `geo.placename` = `Santa Cruz, Rio de Janeiro`
- ✅ `geo.position` = `-22.923582;-43.676760`
- ✅ `ICBM` = `-22.923582, -43.676760`

---

## 2. Schema.org / JSON-LD Implementado

### 4 Schemas adicionados:

1. **AutoRepair (LocalBusiness)** — Dados completos da oficina
   - Nome, descrição, telefone, email
   - Endereço completo (Av. Antares, 2765)
   - Coordenadas geográficas
   - Horário de funcionamento
   - Catálogo de serviços (6 serviços)
   - AggregateRating (4.3/5, 499 avaliações — dado real do Google Business Profile)
   - Reviews estruturadas
   - Redes sociais (Instagram, Facebook, TikTok)

2. **FAQPage** — 6 perguntas frequentes
   - Entrega, horário, pagamento, importados, garantia, unidades
   - Crucial para Rich Snippets e GEO

3. **WebSite** — Site com busca
   - URL, nome, descrição
   - Action de busca configurada

4. **LocalBusiness (Sepetiba)** — Unidade secundária
   - Telefone e localização da unidade de Sepetiba

---

## 3. Performance & Core Web Vitals

### Imagens Otimizadas
| Melhoria | Status |
|----------|--------|
| `fetchpriority="high"` no logo | ✅ |
| `loading="lazy"` em imagens abaixo da dobra | ✅ |
| `width` e `height` explícitos em todas as imagens | ✅ |
| Alt texts descritivos com keywords locais | ✅ |

### Scripts
- ✅ `defer` mantido em `cookie-banner.js` e `script.js`

---

## 4. Estrutura Semântica

| Melhoria | Status |
|----------|--------|
| Tag `<main>` envolvendo conteúdo principal | ✅ |
| Tags `<time>` com atributo `datetime` | ✅ |
| Alt texts otimizados com localização | ✅ |
| Hierarquia H1-H6 verificada (1 H1) | ✅ |

---

## 5. Arquivos Criados

### robots.txt
- Permite todos os crawlers principais
- Permite crawlers de IA (ChatGPT, Claude, Perplexity, Google-Extended)
- Bloqueia páginas legais da indexação
- Referencia o sitemap

### sitemap.xml
- 3 URLs indexadas
- Imagens mapeadas
- Prioridades e frequências configuradas
- Lastmod atualizado

---

## 6. Checklist de Itens Externos (Não Implementáveis via Código)

> ⚠️ **ATENÇÃO:** Os itens abaixo precisam ser executados manualmente pelo cliente ou equipe de marketing.

### Google My Business (GMB)
- [ ] Verificar e otimizar perfil do Google Meu Negócio
- [ ] Garantir que NAP (Nome, Endereço, Telefone) corresponda exatamente ao site
- [ ] Adicionar fotos da fachada, interior e serviços
- [ ] Solicitar avaliações aos clientes regularmente
- [ ] Responder todas as avaliações (positivas e negativas)

### Google Search Console
- [ ] Cadastrar propriedade: `https://www.autopecascincorodas.com.br/`
- [ ] Enviar `sitemap.xml`
- [ ] Solicitar indexação da página principal
- [ ] Monitorar Core Web Vitals após deploy

### Google Analytics / Tag Manager
- [ ] Instalar Google Analytics 4 (GA4)
- [ ] Configurar eventos de conversão (clique no WhatsApp, envio de formulário)
- [ ] Configurar Google Tag Manager se necessário

### Backlinks & Citações Locais
- [ ] Cadastrar em diretórios locais (GuiaMais, Apontador, Minuano, etc.)
- [ ] Buscar parcerias com blogs automotivos locais
- [ ] Criar perfil no Reclame Aqui (gestão de reputação)

### Redes Sociais
- [ ] Manter links ativos no site (Instagram, Facebook, TikTok) — ✅ Já implementado
- [ ] Postar conteúdo regularmente com link para o site
- [ ] Usar hashtags locais (#SantaCruzRJ #AutoPeçasRJ)

### Performance
- [ ] Rodar PageSpeed Insights após deploy
- [ ] Verificar LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Considerar CDN para assets estáticos

### Segurança
- [ ] Garantir certificado SSL ativo (HTTPS)
- [ ] Forçar redirecionamento HTTP → HTTPS

---

## 7. Estratégia GEO (AI Search Optimization)

Para ser citado por ChatGPT, Claude e Perplexity:

| Estratégia | Implementação |
|------------|---------------|
| **FAQ estruturado** | ✅ 6 perguntas com respostas diretas |
| **Dados estruturados** | ✅ Schema.org completo |
| **NAP visível** | ✅ Endereço e telefones no HTML |
| **Credenciais** | ✅ "Desde 1975", "50+ anos" |
| **Respostas diretas** | ✅ Conteúdo claro e objetivo |
| **robots.txt permissivo** | ✅ Permite AI crawlers |

---

## 8. Próximos Passos Recomendados

1. **Blog/Conteúdo:** Criar artigos como "Sinais de que a suspensão do carro precisa de troca" e "Quanto custa trocar a embreagem em Santa Cruz RJ"
2. **Páginas de serviço:** Criar páginas individuais para cada serviço (suspensão, freios, etc.)
3. **Galeria de antes/depois:** Fotos de serviços realizados (com permissão dos clientes)
4. **Vídeos no YouTube:** Tutoriais curtos e embed no site
5. **Backlinks locais:** Parcerias com oficinas, lojas e influenciadores automotivos da região

---

## Conclusão

A landing page da Auto Peças Cinco Rodas está agora **tecnicamente otimizada** para SEO tradicional e GEO (IA). As melhorias implementadas aumentam significativamente as chances de:

- Aparecer no **Google Local Pack** (mapa)
- Conseguir **Rich Snippets** (estrelas de avaliação, FAQ)
- Ser **citado por IA** (ChatGPT, Claude, Perplexity)
- Melhorar **CTR** nos resultados de busca

**Status:** ✅ Auditoria concluída | 35+ melhorias implementadas
