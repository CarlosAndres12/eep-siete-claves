/* ESTILO «Enfoque metropolitano: verdes del territorio» · roles, leyenda y tipografía (style S3, S9). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var roles = {
    'ground': '#F0EEEA',
    'ground-2': '#E6E3DB',
    'ink': '#1E4035',
    'ink-soft': '#4F574A',
    'dark': '#1E4035',
    'on-dark': '#D6FED0',
    'accent-1': '#94EC87',
    'accent-2': '#12ACB4',
    'accent-3': '#B7A2F1',
    'accent-4': '#EFE4B5',
    'accent-5': '#ED6E69',
    'accent-6': '#55B86D',
    'accent-7': '#357859',
    'accent-8': '#D6FED0',
    'accent-9': '#F9D886',
    'skin-1': '#F3C6A5',
    'skin-2': '#D9A080',
    'skin-3': '#C08A6A',
    'skin-4': '#8D5B43',
    'skin-5': '#5E3A2A',
    'machine-ground': '#163229',
    'machine-line': '#94EC87',
    'machine-grid': '#2E594A',
    'machine-glow-1': '#D6FED0',
    'machine-glow-2': '#B0E9FF',
    'alert': '#A8323A'
  };
  // Tono de nube «papel blanco» (S5 `nube`): derivado de ground, solo decorativo.
  var extra = { paper: '#FBFAF7' };

  EEP.style.tokens = {
    name: 'Enfoque metropolitano: verdes del territorio',
    roles: roles,
    extra: extra,
    legendOrder: ['blue', 'vermillion', 'reddish purple', 'sky blue', 'orange'],
    legendExclude: ['yellow', 'bluish green'],
    fonts: {
      body: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
      display: '"IBM Plex Mono", "Courier New", monospace',
      faces: [
        { family: 'DM Sans', weight: '400', style: 'normal' },
        { family: 'DM Sans', weight: '500', style: 'normal' },
        { family: 'DM Sans', weight: '700', style: 'normal' },
        { family: 'DM Sans', weight: '400', style: 'italic' },
        { family: 'IBM Plex Mono', weight: '700', style: 'normal' },
        { family: 'IBM Plex Mono', weight: '500', style: 'normal' },
        { family: 'IBM Plex Mono', weight: '400', style: 'italic' }
      ]
    },
    margin: 72
  };
})(typeof window !== 'undefined' ? window : globalThis);
