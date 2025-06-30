const API_BASE_URL = 'http://localhost:3001/api';

// Index products using backend API
export async function indexProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/index-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to index products');
    }
    
    const result = await response.json();
    console.log('Products indexed successfully:', result.message);
  } catch (error) {
    console.error('Error indexing products:', error);
    throw error;
  }
}

// Search products using backend API
export async function searchProducts(queryText) {
  try {
    const response = await fetch(`${API_BASE_URL}/search-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: queryText }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    
    const result = await response.json();
    return result.results;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

