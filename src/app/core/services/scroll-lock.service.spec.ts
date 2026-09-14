import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ScrollLockService } from './scroll-lock.service';

describe('ScrollLockService', () => {
  let lock: ScrollLockService;

  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    TestBed.resetTestingModule();
    lock = TestBed.inject(ScrollLockService);
  });

  it('hides overflow on lock', () => {
    lock.lock();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores overflow on release', () => {
    lock.lock();
    lock.release();
    expect(document.body.style.overflow).toBe('');
  });

  it('stays locked until every holder releases', () => {
    lock.lock(); // cart drawer
    lock.lock(); // lightbox opened on top
    lock.release(); // lightbox closed
    expect(document.body.style.overflow).toBe('hidden');
    lock.release(); // drawer closed
    expect(document.body.style.overflow).toBe('');
  });

  it('ignores an unbalanced release', () => {
    lock.release();
    lock.lock();
    expect(document.body.style.overflow).toBe('hidden');
    lock.release();
    expect(document.body.style.overflow).toBe('');
  });

  it('preserves a pre-existing inline overflow value', () => {
    document.body.style.overflow = 'scroll';
    TestBed.resetTestingModule();
    const fresh = TestBed.inject(ScrollLockService);
    fresh.lock();
    expect(document.body.style.overflow).toBe('hidden');
    fresh.release();
    expect(document.body.style.overflow).toBe('scroll');
  });
});
