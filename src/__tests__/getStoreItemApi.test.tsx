import { getStoreItem } from "../test_thingy/getStoreItem";

test("Fetching an non-existant storeItem", async () => {
    await expect(getStoreItem(-1)).rejects.toBe("StoreItem not found");
});

test("Fetching a storeItem with wrong id type", async () => {
    await expect(getStoreItem("hi")).rejects.toBe("Invalid storeItem id");
});

test("Fetching a storeItem with the correct structure", async () => {
    const storeItem = await getStoreItem(1);

    expect(storeItem).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        genre: expect.any(String),
        price: expect.any(Number),
        details: expect.any(String),
    });
});