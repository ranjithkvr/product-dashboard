// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PriceChart from './component/PriceChart';
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  CircularProgress,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { Product, Category } from './interface/types';
import Grid from '@mui/material/Grid';

const App: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'product' | 'category'>('category');
  const [reportRunning, setReportRunning] = useState<boolean>(false);
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchByCategories = async () => {
      try {
        const response = await axios.get<string[]>('https://dummyjson.com/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchByCategories();
  }, []);

  // Fetch products when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      setLoadingProducts(true);
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`https://dummyjson.com/products/category/${selectedCategory}`);
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoadingProducts(false);
        }
      };

      fetchProducts();
    } else {
      // Reset products if no category is selected
      setProducts([]);
      setFilteredProducts([]);
    }
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
    setSelectedProducts([]);
    setFilteredProducts([]);
    setFiltersChanged(false);
  };

  // Handle product selection change
  const handleProductChange = (event: SelectChangeEvent<number[]>) => {
    setSelectedProducts(event.target.value as number[]);
    setFiltersChanged(true);
  };

  // Filter products based on selected products
  const filterProducts = () => {
    const filtered = products.filter(product => selectedProducts.includes(product.id));
    setFilteredProducts(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedProducts([]);
    setFilteredProducts([]);
    setChartType('category');
    setReportRunning(false);
    setFiltersChanged(false);
  };

  // Run report and show column chart
  const runReport = () => {
    filterProducts();
    setChartType('product');
    setReportRunning(true);
    setFiltersChanged(false);
  };

  // Prepare chart data for all categories
  const categoryChartData: Category[] = categories.map((category, index) => ({
    name: category,
  }));

  const productChartData: Product[] = filteredProducts;

  return (
    <Container>
       <Grid container spacing={2}  style={{ backgroundColor: `black`,color:`white`,padding:`10px`, fontSize:`10px` }}>
       <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Product Filter Dashboard
      </Typography>
      </Grid>
      </Grid>
      {loading || loadingProducts ? (
        <CircularProgress />
      ) : (
        <>
 <Grid container spacing={2}>
 <Grid item xs={3}>
 <Button
            variant="text"
            color="secondary"
            onClick={clearFilters}
            style={{ margin: '10px 0', float:'right' }}
          >
            Clear Filters
          </Button>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map(category => (
                <MenuItem key={category.name} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Products</InputLabel>
            <Select
              multiple
              value={selectedProducts}
              onChange={handleProductChange}
              renderValue={(selected) => {
                const productNames = selected.map(id => {
                  const product = products.find(p => p.id === id);
                  return product ? product.title : '';
                }).filter(name => name !== ''); // Remove empty names
                return productNames.join(', ');
              }}
              label="Products"
            >
              {products.map(product => (
                <MenuItem key={product.id} value={product.id}>
                  <Checkbox checked={selectedProducts.includes(product.id)} />
                  <ListItemText primary={product.title} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={runReport}
            disabled={!filtersChanged || reportRunning}
          >
            Run Report
          </Button>
          

          </Grid>
          <Grid item xs={9} style={{marginTop:'30px'}}>

          {/* <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
            {chartType === 'category' ? 'All Categories' : 'Filtered Products'}
          </Typography> */}
          <PriceChart
            data={chartType === 'category' ? categoryChartData : productChartData}
            chartType={chartType}
          />
          {chartType === 'product' && (
            <ul>
              {filteredProducts.map(product => (
                <li key={product.id}>
                  {product.name}: ${product.price}
                </li>
              ))}
            </ul>
          )}

</Grid>
           
           </Grid>
        </>
      )}
    </Container>
  );
};

export default App;
