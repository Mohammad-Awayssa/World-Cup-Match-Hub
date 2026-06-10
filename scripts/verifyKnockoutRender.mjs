import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import matchesDocument from '../src/data/matches.json' with { type: 'json' };

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const { KnockoutStage } = await server.ssrLoadModule('/src/components/group/KnockoutStage.jsx');
  const markup = renderToStaticMarkup(
    React.createElement(KnockoutStage, { matches: matchesDocument.matches }),
  );

  if (!markup.includes('Road to the Final') || !markup.includes('Runner-up Group A')) {
    throw new Error('Knockout markup is missing expected content.');
  }

  console.log(`Knockout render verified (${markup.length} characters).`);
} finally {
  await server.close();
}
