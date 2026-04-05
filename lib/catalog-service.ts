import { adminDb } from "./firebase-admin";
import { Product, Brand } from "./types";

export async function getBrands(): Promise<Brand[]> {
  const snapshot = await adminDb.collection("brands").get();
  return snapshot.docs.map(doc => doc.data() as Brand);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const snapshot = await adminDb.collection("products")
    .where("categoryId", "==", categoryId)
    .get();
  return snapshot.docs.map(doc => doc.data() as Product);
}

export async function getProduct(id: string): Promise<Product | null> {
  const doc = await adminDb.collection("products").doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as Product;
}
