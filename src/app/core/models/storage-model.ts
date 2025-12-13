export interface IPartStorage {
    id: number;
    amount: number;
  }

export interface ICaseStorage {
    title: string;
    parts: IPartStorage[];
  }
  
export interface IBoxStorage {
    id: number;
    title: string;
    cases: ICaseStorage[];
  }

export class StorageModel {
    private readonly boxes: IBoxStorage[];

    constructor() {
        this.boxes = [];
    }

    addBox(box:IBoxStorage): void {
        this.boxes.push(box);
    }

    get boxList(): IBoxStorage[] {
        return this.boxes;
    }
}
