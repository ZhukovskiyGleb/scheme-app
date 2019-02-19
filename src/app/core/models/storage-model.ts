export interface ICaseStorage {
    id: number;
    amount: number;
  }
  
export interface IBoxStorage {
    id: number,
    title: string;
    cases: ICaseStorage[];
  }

export class StorageModel {
    private boxes: IBoxStorage[];

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
