import axios from 'axios';


const fetchProducts = async () => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    return response.data; 
  } catch (error) {
    throw new Error('Error al obtener los productos'); 
  }
};

export default fetchProducts;