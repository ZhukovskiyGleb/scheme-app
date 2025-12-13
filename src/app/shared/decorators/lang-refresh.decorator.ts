import {LocalizationService} from "../../core/services/localization/localization.service";
import {ChangeDetectorRef} from "@angular/core";
import {Subscription} from "rxjs";

const LANG_SUBSCRIPTION_KEY = '__langRefreshSubscription';

export function LangRefresher(constructor: any) {
  const onInit: Function = constructor.prototype.ngOnInit;
  const onAfterContentInit: Function = constructor.prototype.ngAfterContentInit;
  const onAfterViewInit: Function = constructor.prototype.ngAfterViewInit;
  const onDestroy: Function = constructor.prototype.ngOnDestroy;

  function setupLangRefresh(context: any) {
    // Check if already set up for this instance
    if (context[LANG_SUBSCRIPTION_KEY]) return;

    let loc: LocalizationService | null = null;
    let cdr: ChangeDetectorRef | null = null;

    // Find LocalizationService and ChangeDetectorRef in component properties
    for (let propName in context) {
      const property = context[propName];
      if (property instanceof LocalizationService) {
        loc = property;
      }
      // ChangeDetectorRef is typically injected with a name like 'cdr', 'cd', 'changeDetector', etc.
      if (property && typeof property.markForCheck === 'function' && typeof property.detectChanges === 'function') {
        cdr = property;
      }
    }

    if (loc) {
      context[LANG_SUBSCRIPTION_KEY] = loc.languageChanged
        .subscribe(
          () => {
            if (cdr) {
              cdr.markForCheck();
              cdr.detectChanges();
            }
          }
        );
    }
  }

  constructor.prototype.ngOnInit = function () {
    setupLangRefresh(this);

    if (onInit && (typeof onInit === 'function')) {
      onInit.apply(this, arguments);
    }
  }

  constructor.prototype.ngAfterContentInit = function () {
    setupLangRefresh(this);

    if (onAfterContentInit && (typeof onAfterContentInit === 'function')) {
      onAfterContentInit.apply(this, arguments);
    }
  }

  constructor.prototype.ngAfterViewInit = function () {
    setupLangRefresh(this);

    if (onAfterViewInit && (typeof onAfterViewInit === 'function')) {
      onAfterViewInit.apply(this, arguments);
    }
  }

  constructor.prototype.ngOnDestroy = function () {
    const subscription: Subscription = this[LANG_SUBSCRIPTION_KEY];
    if (subscription) {
      subscription.unsubscribe();
      this[LANG_SUBSCRIPTION_KEY] = null;
    }
    if (onDestroy && (typeof onDestroy === 'function')) {
      onDestroy.apply(this, arguments);
    }
  }
}
