export interface TreeNodeItem<T = unknown> {
    id: string;
    name: string;
    raw: T;
    children?: TreeNodeItem<T>[];
}
