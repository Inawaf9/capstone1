package com.nawaf.ecommerce.Model;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class User {
    @NotEmpty(message = "Id required")
    @Pattern(regexp = "^u.*$", message = "ID must start with 'u'")
    private String id;

    @NotEmpty(message = "Username required")
    @Size(min = 5, message = "Username must be 5 or more characters")
    private String username;

    @NotEmpty(message = "Email required")
    @Email(message = "Enter valid email")
    private String email;

    @NotEmpty(message = "Password required")
    @Size(min = 6, message = "Password must be 6 or more characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,}$", message = "Must be exactly 6 characters and include uppercase, lowercase, number, and special character")
    private String password;

    @NotEmpty(message = "Role required")
    @Pattern(regexp = "(?i)^(customer|admin)$", message = "Role must be either customer or admin")
    private String role;

    @NotNull(message = "Balance required")
    @Positive(message = "Balance must be positive number")
    private double balance;
}
