package com.nawaf.ecommerce.Model;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MerchantStock {
    @NotEmpty(message = "Id required")
    @Pattern(regexp = "^s.*$", message = "ID must start with 's'")
    private String id;

    @NotEmpty(message = "Merchant id required")
    private String merchantId;

    @NotEmpty(message = "Product id required")
    private String productId;

    @NotNull(message = "Stock required")
    @Min(value = 10, message = "Stock must be at least 10")
    private int stock;
}
