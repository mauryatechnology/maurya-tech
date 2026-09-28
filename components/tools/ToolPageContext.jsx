'use client';

import React, { createContext, useContext } from 'react';

/**
 * Lets a server page tell the shared CalculatorContainer how it is being rendered
 * without threading props through every calculator:
 *  - breadcrumbs: [{ name, href }] shown above the title
 *  - embedded: true when the calculator sits inside a page that owns the H1
 *    (e.g. programmatic salary pages) — the title renders as an H2 instead.
 */
const ToolPageContext = createContext({ breadcrumbs: null, embedded: false });

export function ToolPageProvider({ breadcrumbs = null, embedded = false, children }) {
  return <ToolPageContext.Provider value={{ breadcrumbs, embedded }}>{children}</ToolPageContext.Provider>;
}

export function useToolPage() {
  return useContext(ToolPageContext);
}
