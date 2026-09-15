package com.nawaf.ecommerce.Service;

import com.nawaf.ecommerce.Model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final CategoryService categoryService;

    private final List<Product> products = new ArrayList<>();

    public List<Product> getProducts() {
        return products;
    }

    public Product getProduct(String id) {
        for (Product product : products) {
            if (product.getId().equals(id)) return product;
        }
        return null;
    }

    // Case 0: Product added successfully
    // Case 1: ID already exist
    // Case 2: Category not found
    public int newProduct(Product product) {
        if (getProduct(product.getId()) != null) return 1;

        if (categoryService.getCategory(product.getCategoryId()) == null) {
            return 2;
        }

        products.add(product);
        return 0;
    }

    // Case 0: Product updated successfully
    // Case 1: Product not found
    // Case 2: Cannot change product id
    // Case 3: Category not found
    public int updateProduct(String id, Product product) {
        Product oldProduct = getProduct(id);

        if (oldProduct == null) return 1;
        if (!product.getId().equals(id)) return 2;

        if (categoryService.getCategory(product.getCategoryId()) == null) {
            return 3;
        }

        int index = products.indexOf(oldProduct);
        products.set(index, product);

        return 0;
    }

    // Case 0: Product deleted successfully
    // Case 1: Product not found
    public int deleteProduct(String id) {
        Product product = getProduct(id);

        if (product == null) return 1;

        products.remove(product);
        return 0;
    }

    // Case 0: Discount applied successfully
    // Case 1: Product not found in category
    // Case 2: Discount must be between 1 and 100
    public int discountCategory(String categoryId, double percentage) {
        if (percentage <= 0 || percentage > 100) return 2;

        boolean productFound = false;
        percentage /= 100;

        for (Product product : products) {
            if (product.getCategoryId() != null
                    && product.getCategoryId().equals(categoryId)) {

                productFound = true;

                product.setPrice(
                        product.getPrice() - (product.getPrice() * percentage)
                );
            }
        }

        if (!productFound) return 1;

        return 0;
    }
}