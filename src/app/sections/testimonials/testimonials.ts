import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TESTIMONIALS } from '../../core/data';
import { MediaFrame } from '../../shared/ui/media-frame/media-frame';
import { Reveal } from '../../shared/a11y/reveal';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaFrame, Reveal],
})
export class Testimonials {
  protected readonly reviews = TESTIMONIALS;
  protected readonly stars = [1, 2, 3, 4, 5] as const;

  /** Fallback avatar when no photo is supplied. */
  protected initials(author: string): string {
    return author
      .split(' ')
      .map((part) => part[0] ?? '')
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
