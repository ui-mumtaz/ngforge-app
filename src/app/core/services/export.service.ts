import { Injectable, inject } from '@angular/core';
import JSZip from 'jszip';
import { GeneratedOutput } from '../models/angular.models';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly toast = inject(ToastService);

  async downloadZip(output: GeneratedOutput): Promise<void> {
    const zip = new JSZip();
    const folderName = output.fileName.replace(/\.(component|service|directive|pipe|guard|interceptor)$/, '');
    let subDir = 'components';
    if (output.type === 'Service') subDir = 'services';
    else if (output.type === 'Directive') subDir = 'directives';
    else if (output.type === 'Pipe') subDir = 'pipes';
    else if (output.type === 'Guard/Interceptor') subDir = 'guards';

    const basePath = `src/app/${subDir}/${folderName}`;
    const noMarkup = output.type === 'Service' || output.type === 'Pipe' || output.type === 'Guard/Interceptor';

    zip.file(`${basePath}/${output.fileName}.ts`, output.ts.trim());
    if (output.spec?.trim()) {
      zip.file(`${basePath}/${output.fileName}.spec.ts`, output.spec.trim());
    }
    if (output.html?.trim() && !noMarkup) {
      zip.file(`${basePath}/${output.fileName}.html`, output.html.trim());
    }
    if (output.scss?.trim() && !noMarkup) {
      zip.file(`${basePath}/${output.fileName}.scss`, output.scss.trim());
    }

    const readme = `# ${output.title}
Architected with NgForge (Angular Standalone Architecture).

## Overview
- Type: ${output.type}
- Component: \`${output.componentName}\`
- Features: ${output.tags.join(', ')}

## Usage Guide
${output.usage}
`;
    zip.file('README.md', readme);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${output.fileName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.toast.show(`Downloaded ${output.fileName}.zip`, 'success');
  }

  combinedFilesText(output: GeneratedOutput): string {
    return `// File: ${output.fileName}.ts\n${output.ts}\n\n// File: ${output.fileName}.html\n${output.html}\n\n// File: ${output.fileName}.scss\n${output.scss}\n\n// File: ${output.fileName}.spec.ts\n${output.spec}\n\n// Usage Guide\n${output.usage}`;
  }
}
