import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NAV_LINKS, SHOP } from '../../core/data';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly shop = SHOP;
  protected readonly links = NAV_LINKS;
  protected readonly year = new Date().getFullYear();
}
