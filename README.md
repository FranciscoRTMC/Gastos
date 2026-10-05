# Gastos

App web minimalista para registrar gastos diarios, semanales y mensuales en pesos argentinos (ARS).

- Sin base de datos: los datos se guardan en el `localStorage` del navegador.
- Vistas por día, semana (lunes a domingo) y mes, con navegación entre períodos.
- Resumen por categoría y gráfico de gastos por día.
- Exportación a JSON (respaldo) y CSV (compatible con Excel en español), e importación de respaldos JSON.

## Stack

Vite + React + TypeScript, Tailwind CSS v4, Recharts y date-fns.

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # build estático en dist/
npm run lint
```

El build es 100% estático (`base: './'`), por lo que se puede publicar en GitHub Pages, Vercel o Netlify.

> Los datos viven solo en el navegador donde se cargan. Exportá un respaldo JSON periódicamente para no perderlos.
