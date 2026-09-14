import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MENU_CATEGORIES, MENU_ITEMS } from '../../core/data';
import type { MenuCategory, MenuCategoryId, MenuItem } from '../../core/models';
import { MenuItemCard } from '../../shared/menu-item-card/menu-item-card';
import { Reveal } from '../../shared/a11y/reveal';

type Filter = MenuCategoryId | 'all';

interface MenuGroup {
  readonly category: MenuCategory;
  readonly items: readonly MenuItem[];
}

@Component({
  selector: 'app-menu-section',
  templateUrl: './menu-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuItemCard, Reveal],
})
export class MenuSection {
  protected readonly categories = MENU_CATEGORIES;
  protected readonly activeFilter = signal<Filter>('all');

  /** Grouped once — the filter selects from this, it never re-filters items. */
  private readonly allGroups: readonly MenuGroup[] = MENU_CATEGORIES.map((category) => ({
    category,
    items: MENU_ITEMS.filter((item) => item.category === category.id),
  }));

  protected readonly visibleGroups = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all'
      ? this.allGroups
      : this.allGroups.filter((group) => group.category.id === filter);
  });

  protected readonly visibleCount = computed(() =>
    this.visibleGroups().reduce((sum, group) => sum + group.items.length, 0),
  );

  protected setFilter(filter: Filter): void {
    this.activeFilter.set(filter);
  }
}
