"use client";
import { useEffect, useState } from "react";

interface TestResults {
  direct?: string;
  env?: string;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResults>({});

  useEffect(() => {
    const runTests = async () => {
      console.log("=== DIRECTUS API TESTS ===");
      
      // Test 1: Environment variable
      console.log("1. NEXT_PUBLIC_DIRECTUS_URL:", process.env.NEXT_PUBLIC_DIRECTUS_URL);
      
      // Test 2: Direct fetch to basic endpoint
      try {
        const response = await fetch("https://admin.tamamat.com/items/header_config");
        const data = await response.json();
        console.log("2. Direct fetch SUCCESS:", data);
        setResults(prev => ({ ...prev, direct: "SUCCESS" }));
      } catch (error) {
        console.error("2. Direct fetch FAILED:", error);
        setResults(prev => ({ ...prev, direct: "FAILED" }));
      }

      // Test 3: Using environment variable
      try {
        const url = process.env.NEXT_PUBLIC_DIRECTUS_URL;
        const response = await fetch(`${url}/items/header_config`);
        const data = await response.json();
        console.log("3. Env variable fetch SUCCESS:", data);
        setResults(prev => ({ ...prev, env: "SUCCESS" }));
      } catch (error) {
        console.error("3. Env variable fetch FAILED:", error);
        setResults(prev => ({ ...prev, env: "FAILED" }));
      }
    };

    runTests();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Directus API Tests</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(results, null, 2)}
      </pre>
      <p className="mt-4">Check browser console for detailed results</p>
    </div>
  );
}
