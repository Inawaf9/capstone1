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
}
