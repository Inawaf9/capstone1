package com.nawaf.ecommerce.Controller;

import com.nawaf.ecommerce.Api.ApiResponse;
import com.nawaf.ecommerce.Model.Merchant;
import com.nawaf.ecommerce.Service.MerchantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchant")
@RequiredArgsConstructor
public class MerchantController {

    private final MerchantService merchantService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getMerchants(){
        return ResponseEntity.status(200).body(merchantService.getMerchants());
    }

    @PostMapping("/new")
    public ResponseEntity<?> newMerchant(@Valid @RequestBody Merchant merchant, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(new ApiResponse(errors.getFieldError().getDefaultMessage()));

        int createCase = merchantService.newMerchant(merchant);

        return switch (createCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Id already exist"));
            default -> ResponseEntity.status(201).body(new ApiResponse("Create new merchant successfully"));
        };
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateMerchant(@PathVariable String id, @Valid @RequestBody Merchant merchant, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(new ApiResponse(errors.getFieldError().getDefaultMessage()));

        int updateCase = merchantService.updateMerchant(id, merchant);

        return switch (updateCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Merchant not found"));
            case 2 ->  ResponseEntity.status(400).body(new ApiResponse("Cannot change merchant id"));
//            case 3 ->  ResponseEntity.status(400).body(new ApiResponse("Merchant name already exist"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Merchant updated successfully"));
        };
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<?> deleteMerchant(@PathVariable String id){
        int deleteCase = merchantService.deleteMerchant(id);

        return switch (deleteCase){
            case 1 ->  ResponseEntity.status(400).body(new ApiResponse("Merchant not found"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Merchant deleted successfully"));
        };
    }
}
