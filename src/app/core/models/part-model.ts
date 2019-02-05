class IPartParams {
    id: number;
    title: string;
    type: string;
    subtype: string;
    properties: string[];
    description: string;
    owner: string;
}

export class PartModel {
    static create(params: { [field: string]: any }): PartModel {
        if (!params.properties) {
            params.properties = [];
        }
        return new PartModel(params);
    }

    constructor(params: Partial<IPartParams>,
                public id: number = params.id,
                public title: string = params.title,
                public type: string = params.type,
                public subtype: string = params.subtype,
                public properties: string[] = params.properties,
                public description: string = params.description,
                public owner: string = params.owner) {}
}
