import Head from "next/head";
import Header from "@/components/Header";
import UserProfile from "@/components/UserProfile";
import ProductCard from "@/components/ProductCard";

// Issue: unused variable
const UNUSED_PAGE_CONSTANT = "home page";

export default function Home() {
  // Issue: unused variable
  const unusedTitle = "Welcome to our store";

  // Issue: console.log
  console.log("Home page rendered");

  // Issue: var usage
  var pageClass = "home-page";

  // Issue: unused expression
  ("some unused expression");

  const sampleUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };

  const sampleProduct = {
    id: 1,
    name: "Sample Product",
    price: 29.99,
    description: "A great product",
  };

  return (
    <div className={pageClass}>
      <Head>
        <title>NextJS Auto-Fix Test</title>
        <meta name="description" content="Testing auto-fix workflow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome" subtitle="Test Site" />
        <UserProfile user={sampleUser} />
        <ProductCard product={sampleProduct} />
      </main>
    </div>
  );
}
