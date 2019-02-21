export function AutoUnsubscribe(constructor) {
    const original: Function = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function () {
        for (let propName in this) {
            const property = this[propName];
            if (property &&
                (typeof property.unsubscribe === 'function')) {
                    property.unsubscribe();
                }
        }
        if (original &&
            (typeof original === 'function')) {
                original.apply(this, arguments);
            }
    }
}