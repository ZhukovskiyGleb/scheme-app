class IPartParams {
    id: number = 0;
    title: string = '';
    type: number = 0;
    subtype: number = 0;
    properties: IPartProperty[] = [];
    description: string = '';
    link: string = '';
    owner: string = '';
}

export class IPartProperty {
    name: string = '';
    value: string = '';
}

export class PartModel {
    static create(params: { [field: string]: any }): PartModel {
        if (!params['properties']) {
            params['properties'] = [];
        }
        return new PartModel(params);
    }

    constructor(params: Partial<IPartParams>,
                public id: number = params.id || 0,
                public title: string = params.title || '',
                public type: number = params.type || 0,
                public subtype: number = params.subtype || 0,
                public properties: IPartProperty[] = params.properties || [],
                public description: string = params.description || '',
                public link: string = params.link || '',
                public owner: string = params.owner || '') {}
}
