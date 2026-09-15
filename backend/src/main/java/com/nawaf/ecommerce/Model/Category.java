package com.nawaf.ecommerce.Model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Category {
    @NotEmpty(message = "Id required")
    @Pattern(regexp = "^c.*$", message = "ID must start with 'c'")
    private String id;

    @NotEmpty(message = "Name required")
    @Size(min = 3, message = "Name must be 3 or more characters")
    private String name;
}
