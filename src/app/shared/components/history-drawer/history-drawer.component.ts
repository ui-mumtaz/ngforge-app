import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { HistoryService } from '../../../core/services/history.service';
import { HistoryListComponent } from '../history-list/history-list.component';

const CLOSE_TRANSITION_MS = 200;

@Component({
  selector: 'app-history-drawer',
  imports: [HistoryListComponent],
  templateUrl: './history-drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryDrawerComponent implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  readonly history = inject(HistoryService);

  @ViewChild('drawerTemplate') private drawerTemplate?: TemplateRef<unknown>;

  private overlayRef?: OverlayRef;
  private closeTimer?: ReturnType<typeof setTimeout>;

  /** Drives the CSS slide-in/out transform; stays true for the duration of the close animation. */
  readonly visible = signal(false);

  constructor() {
    effect(() => {
      if (this.history.isDrawerOpen()) {
        this.open();
      } else {
        this.startClose();
      }
    });
  }

  private open(): void {
    if (!this.drawerTemplate) return;
    clearTimeout(this.closeTimer);

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'ngforge-backdrop',
        positionStrategy: this.overlay.position().global().left('0').top('0'),
        height: '100%',
        scrollStrategy: this.overlay.scrollStrategies.block(),
      });
      this.overlayRef.backdropClick().subscribe(() => this.history.closeDrawer());
      this.overlayRef.attach(new TemplatePortal(this.drawerTemplate, this.viewContainerRef));
    }

    requestAnimationFrame(() => this.visible.set(true));
  }

  private startClose(): void {
    this.visible.set(false);
    this.closeTimer = setTimeout(() => {
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
    }, CLOSE_TRANSITION_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.closeTimer);
    this.overlayRef?.dispose();
  }
}
