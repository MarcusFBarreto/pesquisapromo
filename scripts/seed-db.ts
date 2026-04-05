import { adminDb } from "../lib/firebase-admin";

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Brands
  const brands = [
    { id: "b1", name: "Brastemp", official: true },
    { id: "b2", name: "Samsung", official: true },
    { id: "b3", name: "Faber-Castell", official: true },
  ];

  for (const brand of brands) {
    await adminDb.collection("brands").doc(brand.id).set(brand);
  }
  console.log("✅ Brands seeded");

  // 2. Seed Partners
  const partners = [
    {
      id: "p1",
      slug: "loja-eletro-piloto",
      name: "Eletro Piloto",
      category: "Casa e Eletro",
      tagline: "Sua casa tecnológica",
      description: "Referência em eletrodomésticos na Cidade Piloto.",
      city: "Cidade Piloto",
      region: "CE",
      whatsapp: "85999990001",
      featured: true,
      verified: true,
      brands: ["b1", "b2"],
      staffIds: [],
      reputationScore: 100
    },
    {
      id: "p2",
      slug: "papelaria-central",
      name: "Papelaria Central",
      category: "Papelaria e Gráfica",
      tagline: "Tudo para seu escritório",
      description: "A maior variedade de materiais na Cidade Piloto.",
      city: "Cidade Piloto",
      region: "CE",
      whatsapp: "85999990002",
      featured: false,
      verified: true,
      brands: ["b3"],
      staffIds: [],
      reputationScore: 100
    }
  ];

  for (const partner of partners) {
    await adminDb.collection("partners").doc(partner.id).set(partner);
  }
  console.log("✅ Partners seeded");

  // 3. Seed Products
  const products = [
    { id: "pr1", name: "Geladeira Frost Free", brandId: "b1", categoryId: "Casa e Eletro", description: "375 litros" },
    { id: "pr2", name: "Smartphone Galaxy S21", brandId: "b2", categoryId: "Casa e Eletro", description: "128GB" },
    { id: "pr3", name: "Lápis de Cor - 24 cores", brandId: "b3", categoryId: "Papelaria e Gráfica", description: "EcoLápis" },
  ];

  for (const product of products) {
    await adminDb.collection("products").doc(product.id).set(product);
  }
  console.log("✅ Products seeded");

  console.log("🌈 Seeding complete!");
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
