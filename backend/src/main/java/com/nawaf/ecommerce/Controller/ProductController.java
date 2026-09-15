package com.nawaf.ecommerce.Controller;

import com.nawaf.ecommerce.Api.ApiResponse;
import com.nawaf.ecommerce.Model.Product;
import com.nawaf.ecommerce.Service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getProducts(){
        return ResponseEntity
                .status(200)
                .body(productService.getProducts());
    }

    @PostMapping("/new")
    public ResponseEntity<?> newProduct(@Valid @RequestBody Product product, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(new ApiResponse(errors.getFieldError().getDefaultMessage()));

        int createCase = productService.newProduct(product);

        return switch (createCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Id already exist"));
            case 2 ->  ResponseEntity.status(400).body(new ApiResponse("Category not found"));
            default -> ResponseEntity.status(201).body(new ApiResponse("Create new product successfully"));
        };
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @Valid @RequestBody Product product, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(errors.getFieldError().getDefaultMessage());

        int updateCase = productService.updateProduct(id, product);

        return switch (updateCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Product not found"));
            case 2 ->  ResponseEntity.status(400).body(new ApiResponse("Cannot change product id"));
            case 3 ->  ResponseEntity.status(400).body(new ApiResponse("Category not found"));
            default -> ResponseEntity.status(201).body(new ApiResponse("Product updated successfully"));
        };
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id){
        int deleteCase = productService.deleteProduct(id);

        return switch (deleteCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Product not found"));
            default -> ResponseEntity.status(201).body(new ApiResponse("Product deleted successfully"));
        };
    }

    @PutMapping("/discount-category/{categoryId}/{percentage}")
    public ResponseEntity<?> discountCategory(@PathVariable String categoryId, @PathVariable double percentage){
        if(percentage <= 0) return ResponseEntity
                .status(400)
                .body(new ApiResponse("Percentage must be positive number"));

        int discountCase = productService.discountCategory(categoryId, percentage);

        return switch (discountCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Product not found in this category"));
            case 2 ->  ResponseEntity.status(400).body(new ApiResponse("Discount range between 1 and 100"));
            default -> ResponseEntity.status(201).body(new ApiResponse("Applied discount successfully"));
        };
    }
}
