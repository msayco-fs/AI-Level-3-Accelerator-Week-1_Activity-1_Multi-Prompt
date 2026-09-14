import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { Hero } from './sections/hero/hero';
import { MenuSection } from './sections/menu/menu-section';
import { About } from './sections/about/about';
import { Gallery } from './sections/gallery/gallery';
import { Testimonials } from './sections/testimonials/testimonials';
import { Contact } from './sections/contact/contact';
import { CartDrawer } from './shared/cart-drawer/cart-drawer';
import { CartService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Header, Hero, MenuSection, About, Gallery, Testimonials, Contact, Footer, CartDrawer],
})
export class App {
  /** Drives the cart drawer's `@defer (when ...)` trigger. */
  protected readonly cart = inject(CartService);
}
