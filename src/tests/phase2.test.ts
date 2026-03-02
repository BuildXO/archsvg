import * as path from 'path';
import * as fs from 'fs';

import {
  example1_QuickGeneration,
  example2_LayoutModes,
  example3_Themes,
  example4_CustomConfiguration,
  example6_ExportOptions
} from '../examples/phase2-usage';

// Output directory (project-root/test-output)
const outDir = path.resolve(__dirname, '../../test-output');
fs.mkdirSync(outDir, { recursive: true });

function write(name: string, svg: string) {
  const file = path.join(outDir, `${name}.svg`);
  fs.writeFileSync(file, svg, { encoding: 'utf8' });
  console.log(`Wrote: ${file} (${svg.length} chars)`);
}

try {
  console.log('Running Phase 2 quick tests...');

  const svg1 = example1_QuickGeneration();
  write('example1_quick', svg1);

  const layouts = example2_LayoutModes();
  write('layouts_vertical', layouts.vertical);
  write('layouts_horizontal', layouts.horizontal);
  write('layouts_compact', layouts.compact);
  write('layouts_symmetric', layouts.symmetric);

  const themes = example3_Themes();
  write('theme_github_light', themes.githubLight);
  write('theme_github_dark', themes.githubDark);
  write('theme_minimal', themes.minimal);
  write('theme_blueprint', themes.blueprint);

  const custom = example4_CustomConfiguration();
  write('custom_configuration', custom);

  const exports = example6_ExportOptions();
  write('export_hq', exports.hqSvg);
  write('export_minimal', exports.minimalSvg);

  console.log('Phase 2 tests completed. Inspect files in project-root/test-output.');
} catch (err) {
  console.error('Phase 2 test runner failed:', err);
  process.exitCode = 2;
}
