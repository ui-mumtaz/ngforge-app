import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HistoryService } from '../../core/services/history.service';
import { GeneratorService } from '../generator/generator.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {
  readonly history = inject(HistoryService);
  readonly generator = inject(GeneratorService);

  openSample(sampleId: string): void {
    const sample = this.generator.sampleList.find(s => s.id === sampleId);
    if (sample) this.generator.loadSample(sample);
  }
}
