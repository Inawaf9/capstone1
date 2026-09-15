package com.nawaf.ecommerce.Controller;

import com.nawaf.ecommerce.Api.ApiResponse;
import com.nawaf.ecommerce.Model.Category;
import com.nawaf.ecommerce.Service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getCategories(){
        return ResponseEntity.status(200).body(categoryService.getCategories());
    }

    @PostMapping("/new")
    public ResponseEntity<?> newCategory(@Valid @RequestBody Category category, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(new ApiResponse(errors.getFieldError().getDefaultMessage()));

        int createCase = categoryService.newCategory(category);

        return switch (createCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Id already exist"));
            case 2 ->  ResponseEntity.status(400).body(new ApiResponse("Category name already exist"));
            default -> ResponseEntity.status(201).body(new ApiResponse("Create new Category successfully"));
        };
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable String id, @Valid @RequestBody Category category, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(new ApiResponse(errors.getFieldError().getDefaultMessage()));

        int updateCase = categoryService.updateCategory(id, category);

        return switch (updateCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Category not found"));
            case 2 ->  ResponseEntity.status(400).body(new ApiResponse("Cannot change category id"));
            case 3 ->  ResponseEntity.status(400).body(new ApiResponse("Category name already exist"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Category updated successfully"));
        };
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable String id){
        int deleteCase = categoryService.deleteCategory(id);

        return switch (deleteCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Category not found"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Category updated successfully"));
        };
    }

}
