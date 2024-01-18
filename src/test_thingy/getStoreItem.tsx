import { Item } from "@/models/item";

export async function getStoreItem(id: string | number): Promise<Item> {
    const res = await fetch(`/api/storeItems/fetchById?Id=${id}`);
    if (res.status === 404) throw "StoreItem not found";
    if (res.status === 400) throw "Invalid storeItem id";
    const storeItem = await res.json();
    return storeItem.storeItem;
}