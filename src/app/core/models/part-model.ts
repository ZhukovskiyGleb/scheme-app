export class PartModel {
    static create(params: { [field: string]: any }): PartModel {
        return new PartModel(params.id, params.title, params.description);
    }

    constructor(public id: number,
                public title: string,
                public description: string) {}
}
