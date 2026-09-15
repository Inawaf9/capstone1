package com.nawaf.ecommerce.Controller;

import com.nawaf.ecommerce.Api.ApiResponse;
import com.nawaf.ecommerce.Model.User;
import com.nawaf.ecommerce.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getUsers(){
        return ResponseEntity.status(200).body(userService.getUsers());
    }

    @PostMapping("/new")
    public ResponseEntity<?> newUser(@Valid @RequestBody User user, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(new ApiResponse((errors.getFieldError().getDefaultMessage())));

        int createCase = userService.newUser(user);

        return switch (createCase) {
            case 1 -> ResponseEntity.status(400).body(new ApiResponse("ID already exist"));
            case 2 -> ResponseEntity.status(400).body(new ApiResponse("Username already exist"));
            case 3 -> ResponseEntity.status(400).body(new ApiResponse("Email already exist"));
            default -> ResponseEntity.status(201).body(new ApiResponse("Create new User successfully"));
        };
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @Valid @RequestBody User user, Errors errors){
        if(errors.hasErrors()) return ResponseEntity
                .status(400)
                .body(new ApiResponse((errors.getFieldError().getDefaultMessage())));

        int updateCase = userService.updateUser(id, user);

        return switch (updateCase) {
            case 1 -> ResponseEntity.status(400).body(new ApiResponse("User not found"));
            case 2 -> ResponseEntity.status(400).body(new ApiResponse("Cannot change user id"));
            case 3 -> ResponseEntity.status(400).body(new ApiResponse("Username already exist"));
            case 4 -> ResponseEntity.status(400).body(new ApiResponse("Email already exist"));
            default -> ResponseEntity.status(200).body(new ApiResponse("User updated successfully"));
        };
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id){
        int deleteCase = userService.deleteUser(id);

        return switch (deleteCase) {
            case 1 -> ResponseEntity.status(400).body(new ApiResponse("User not found"));
            default -> ResponseEntity.status(200).body(new ApiResponse("User deleted successfully"));
        };
    }

    @PostMapping("/buy-product/{userId}/{productId}/{merchantId}")
    public ResponseEntity<?> buyProduct(@PathVariable String userId, @PathVariable String productId, @PathVariable String merchantId){
        int buyCase = userService.buyProduct(userId,productId,merchantId);

        return switch (buyCase) {
            case 1 -> ResponseEntity.status(400).body(new ApiResponse("User not found"));
            case 2 -> ResponseEntity.status(400).body(new ApiResponse("Product not found"));
            case 3 -> ResponseEntity.status(400).body(new ApiResponse("Stock not found"));
            case 4 -> ResponseEntity.status(400).body(new ApiResponse("Stock is zero"));
            case 5 -> ResponseEntity.status(400).body(new ApiResponse("User don't have enough money"));
            default -> ResponseEntity.status(200).body(new ApiResponse("User Bought product successfully"));
        };
    }

    @PostMapping("/buy-product/{userId}/{productId}/{merchantId}/{quantity}")
    public ResponseEntity<?> buyMoreThanOneProduct(@PathVariable String userId, @PathVariable String productId, @PathVariable String merchantId, @PathVariable int quantity){
        if(quantity <= 0) return ResponseEntity
                .status(400)
                .body(new ApiResponse("Quantity must be positive number"));

        int buyCase = userService.buyMoreThanOneProduct(userId,productId,merchantId, quantity);

        return switch (buyCase) {
            case 1 -> ResponseEntity.status(400).body(new ApiResponse("User not found"));
            case 2 -> ResponseEntity.status(400).body(new ApiResponse("Product not found"));
            case 3 -> ResponseEntity.status(400).body(new ApiResponse("Stock not found"));
            case 4 -> ResponseEntity.status(400).body(new ApiResponse("Stock is zero"));
            case 5 -> ResponseEntity.status(400).body(new ApiResponse("Merchant stock less than quantity"));
            case 6 -> ResponseEntity.status(400).body(new ApiResponse("User don't have enough money"));
            default -> ResponseEntity.status(200).body(new ApiResponse("User Bought product successfully"));
        };
    }

    @PostMapping("/transfer/{userId}/{receiverId}/{amount}")
    public ResponseEntity<?> transferBalance(@PathVariable String userId, @PathVariable String receiverId, @PathVariable double amount) {
        int transferCase = userService.transferBalance(userId, receiverId, amount);

        return switch (transferCase) {
            case 1 -> ResponseEntity.status(404).body(new ApiResponse("User not found"));
            case 2 -> ResponseEntity.status(404).body(new ApiResponse("Receiver not found"));
            case 3 -> ResponseEntity.status(400).body(new ApiResponse("User doesn't have enough balance"));
            case 4 -> ResponseEntity.status(400).body(new ApiResponse("Same user cannot be a receiver"));
            case 5 -> ResponseEntity.status(400).body(new ApiResponse("Amount must be positive"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Balance transferred successfully"));
        };
    }

    @PutMapping("/charge/{id}/{amount}")
    public ResponseEntity<?> chargeBalance(@PathVariable String id, @PathVariable double amount){
        if(amount <= 0) return ResponseEntity
                .status(400)
                .body(new ApiResponse("Amount must be positive number"));

        int chargeCase = userService.chargeBalance(id, amount);

        return switch (chargeCase) {
            case 1 -> ResponseEntity.status(400).body(new ApiResponse("User not found"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Balance Charged successfully"));
        };
    }

    @PutMapping("/change-role-to-admin/{adminId}/{customerId}")
    public ResponseEntity<?> changeCustomerRoleToAdmin(@PathVariable String adminId, @PathVariable String customerId){
        int changeCase = userService.changeCustomerRoleToAdmin(adminId, customerId);

        return switch (changeCase) {
            case 1 -> ResponseEntity.status(404).body(new ApiResponse("Admin not found"));
            case 2 -> ResponseEntity.status(404).body(new ApiResponse("Customer not found"));
            case 3 -> ResponseEntity.status(403).body(new ApiResponse("Not authorized to change role"));
            case 4 -> ResponseEntity.status(400).body(new ApiResponse("User already admin"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Role changed successfully"));
        };
    }

    @PostMapping("/buy-gift/{senderId}/{receiverId}/{productId}/{merchantId}")
    public ResponseEntity<?> buyProductAsGift(@PathVariable String senderId, @PathVariable String receiverId, @PathVariable String productId, @PathVariable String merchantId) {
        int giftCase = userService.buyProductAsGift(senderId, receiverId, productId, merchantId);

        return switch (giftCase) {
            case 1 -> ResponseEntity.status(404).body(new ApiResponse("Sender not found"));
            case 2 -> ResponseEntity.status(404).body(new ApiResponse("Receiver not found"));
            case 3 -> ResponseEntity.status(400).body(new ApiResponse("Cannot send gift to yourself"));
            case 4 -> ResponseEntity.status(404).body(new ApiResponse("Product not found"));
            case 5 -> ResponseEntity.status(404).body(new ApiResponse("Merchant stock not found"));
            case 6 -> ResponseEntity.status(400).body(new ApiResponse("Product is out of stock"));
            case 7 -> ResponseEntity.status(400).body(new ApiResponse("Sender doesn't have enough money"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Gift purchased successfully"));
        };
    }

    @PutMapping("/products/fix-invalid-categories/{adminId}")
    public ResponseEntity<?> setProductsDontHaveCategoryToNull(@PathVariable String adminId){
        int setCase = userService.setProductsDontHaveCategoryToNull(adminId);

        return switch (setCase) {
            case 1 -> ResponseEntity.status(400).body(new ApiResponse("Admin not found"));
            case 2 -> ResponseEntity.status(400).body(new ApiResponse("not authorize"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Set all product don't have category to null successfully"));
        };
    }

    @PutMapping("/stocks/fix-invalid-references/{adminId}")
    public ResponseEntity<?> setInvalidStockReferencesToNull(@PathVariable String adminId) {
        int setCase = userService.setInvalidStockReferencesToNull(adminId);

        return switch (setCase) {
            case 1 -> ResponseEntity.status(404).body(new ApiResponse("Admin not found"));
            case 2 -> ResponseEntity.status(403).body(new ApiResponse("Not authorized"));
            default -> ResponseEntity.status(200).body(new ApiResponse("Invalid stock references set to null successfully"));
        };
    }

    @GetMapping("/system-summary")
    public ResponseEntity<?> systemSummary() {
        return ResponseEntity.status(200).body(userService.systemSummary());
    }
}
