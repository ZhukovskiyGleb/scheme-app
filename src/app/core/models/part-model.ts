class IPartParams {
    id: number;
    title: string;
    type: number;
    subtype: number;
    properties: IPartProperty[];
    description: string;
    owner: string;
}

export class IPartProperty {
    name: string;
    value: string;
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
                public type: number = params.type,
                public subtype: number = params.subtype,
                public properties: IPartProperty[] = params.properties || [],
                public description: string = params.description,
                public owner: string = params.owner) {}
}
