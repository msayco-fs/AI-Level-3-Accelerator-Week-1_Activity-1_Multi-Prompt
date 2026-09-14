import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MediaFrame } from '../../shared/ui/media-frame/media-frame';
import { Reveal } from '../../shared/a11y/reveal';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaFrame, Reveal],
})
export class About {
  protected readonly pillars = [
    {
      title: 'One source, one grade',
      body: 'Every tin is first-harvest Uji leaf from a single family farm, stone-milled the week it ships. We do not blend grades to hit a price point.',
    },
    {
      title: 'Whisked, not blended',
      body: 'No powder dumped into a jug. Each bowl is sifted and whisked with a bamboo chasen at 80°C — the only way to get foam without bitterness.',
    },
    {
      title: 'Baked before open',
      body: 'The kitchen starts at five. If something sells out by two, that is the day\u2019s batch gone. We would rather run out than hold over.',
    },
  ];
}
