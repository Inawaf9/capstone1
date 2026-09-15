package com.nawaf.ecommerce.Model;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Product {
    @NotEmpty(message = "Id required")
    @Pattern(regexp = "^p.*$", message = "ID must start with 'p'")
    private String id;

    @NotEmpty(message = "Name required")
    @Size(min = 3, message = "Name must be 3 or more characters")
    private String name;

    @NotNull(message = "Price required")
    @Positive(message = "Price must be positive number")
    private double price;

    @NotEmpty(message = "Category id required")
    private String categoryId;
}
