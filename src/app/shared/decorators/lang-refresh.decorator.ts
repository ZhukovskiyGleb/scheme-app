import {LocalizationService} from "../../core/services/localization/localization.service";
import {Subscription} from "rxjs";

export function LangRefresher(constructor) {
  const onInit: Function = constructor.prototype.ngOnInit;
  const onDestroy: Function = constructor.prototype.ngOnDestroy;

  let subscription: Subscription;

  constructor.prototype.ngOnInit = function () {
    for (let propName in this) {
      const property = this[propName];
      if (property instanceof LocalizationService) {
        const loc: LocalizationService = property;
        subscription = loc.languageChanged
          .subscribe(
            () => {
              
            }
          );
      }
    }

    if (onInit &&
      (typeof onInit === 'function')) {
      onInit.apply(this, arguments);
    }
  }

  constructor.prototype.ngOnDestroy = function () {
    if (subscription) {
      subscription.unsubscribe();
    }
    if (onDestroy &&
      (typeof onDestroy === 'function')) {
      onDestroy.apply(this, arguments);
    }
  }
}
