package com.nawaf.ecommerce.Controller;

import com.nawaf.ecommerce.Api.ApiResponse;
import com.nawaf.ecommerce.Model.MerchantStock;
import com.nawaf.ecommerce.Service.MerchantStockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stock")
@RequiredArgsConstructor
public class MerchantStockController {

    private final MerchantStockService merchantStockService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getMerchantStockList(){
        return ResponseEntity
                .status(200)
                .body(merchantStockService.getMerchantStockList());
    }

    @PostMapping("/new")
    public ResponseEntity<?> newMerchantStock(@Valid @RequestBody MerchantStock merchantStock, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(new ApiResponse(errors.getFieldError().getDefaultMessage()));

        int createCase = merchantStockService.newMerchantStock(merchantStock);

        return switch (createCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Id already exist"));
            case 2 ->  ResponseEntity.status(400).body(new ApiResponse("Merchant not found"));
            case 3 ->  ResponseEntity.status(400).body(new ApiResponse("Product not found"));
            default -> ResponseEntity.status(201).body(new ApiResponse("Create new Merchant stock successfully"));
        };
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateMerchantStock(@PathVariable String id, @Valid @RequestBody MerchantStock merchantStock, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(new ApiResponse(errors.getFieldError().getDefaultMessage()));

        int updateCase = merchantStockService.updateMerchantStock(id, merchantStock);

        return switch (updateCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Merchant stock not found"));
            case 2 ->  ResponseEntity.status(400).body(new ApiResponse("Cannot change merchant stock id"));
            case 3 ->  ResponseEntity.status(400).body(new ApiResponse("Merchant not found"));
            case 4 ->  ResponseEntity.status(400).body(new ApiResponse("Product not found"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Merchant stock updated successfully"));
        };
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMerchantStock(@PathVariable String id){
        int deleteCase = merchantStockService.deleteMerchantStock(id);

        return switch (deleteCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Merchant stock not found"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Merchant stock deleted successfully"));
        };
    }

    @PutMapping("/update-stock/{merchantId}/{productId}/{quantity}")
    public ResponseEntity<?> addStock(@PathVariable String merchantId, @PathVariable String productId, @PathVariable int quantity){
        if(quantity <= 0) return ResponseEntity
                .status(400)
                .body(new ApiResponse("Quantity must be positive"));

        int addStockCase = merchantStockService.addStock(merchantId, productId, quantity);

        return switch (addStockCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Merchant stock not found"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Merchant stock updated stock successfully"));
        };
    }
}
