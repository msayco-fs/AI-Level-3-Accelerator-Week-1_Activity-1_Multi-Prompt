import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHOP, STORY_STATS } from '../../core/data';
import { MediaFrame } from '../../shared/ui/media-frame/media-frame';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaFrame],
})
export class Hero {
  protected readonly shop = SHOP;
  protected readonly stats = STORY_STATS;
}
