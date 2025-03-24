export function logStartup(component: string, info?: any) {
  if (typeof window !== 'undefined' && 
      window.location.search.includes('debug=true')) {
    console.log(`[RSVPY Debug] ${component} loaded`, info || '');
  }
}
