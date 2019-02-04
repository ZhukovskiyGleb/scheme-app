export class PartModel {
    static create(params: { [field: string]: any }): PartModel {
        if (!params.properties) {
            params.properties = [];
        }
        return new PartModel(params.id, 
                             params.title,
                             params.properties, 
                             params.description,
                             params.owner);
    }

    constructor(public id: number,
                public title: string,
                public properties: string[],
                public description: string,
                public owner: string) {}
}
