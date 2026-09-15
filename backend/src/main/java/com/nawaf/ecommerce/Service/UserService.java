package com.nawaf.ecommerce.Service;

import com.nawaf.ecommerce.Model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final MerchantStockService merchantStockService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final MerchantService merchantService;

    private final List<User> users = new ArrayList<>();


    public List<User> getUsers(){
        return users;
    }

    // Case 0: User added successfully
    // Case 1: ID already exist
    // Case 2: Username already exist
    // Case 3: Email already exist
    public int newUser(User user){
        for(User u : users){
            if(u.getId().equals(user.getId())) return 1;
            if(u.getUsername().equals(user.getUsername())) return 2;
            if (u.getEmail().equals(user.getEmail())) return 3;
        }

        users.add(user);
        return 0;
    }

    // Case 0: User updated successfully
    // Case 1: User not found
    // Case 2: Cannot change id
    // Case 3: Username already exist
    // Case 4: Email already exist
    public int updateUser(String id, User user) {
        User oldUser = getUser(id);

        if (oldUser == null) return 1;
        if (!user.getId().equals(id)) return 2;

        for (User u : users) {
            if (u.getUsername().equals(user.getUsername())
                    && !u.getId().equals(id)) {
                return 3;
            }

            if (u.getEmail().equals(user.getEmail())
                    && !u.getId().equals(id)) {
                return 4;
            }
        }

        int index = users.indexOf(oldUser);
        users.set(index, user);

        return 0;
    }

    // Case 0: User deleted successfully
    // Case 1: User not found
    public int deleteUser(String id) {
        User user = getUser(id);

        if (user == null) return 1;

        users.remove(user);

        return 0;
    }

    public User getUser(String id){
        for(User user : users){
            if(user.getId().equals(id)) return user;
        }
        return null;
    }

    // Case 0: User buy product successfully
    // Case 1: User not found
    // Case 2: Product not found
    // Case 3: Merchant stock not found
    // Case 4: Merchant stock is zero
    // Case 5: User don't have enough money
    public int buyProduct(String userId, String productId, String merchantId){
        User user = getUser(userId);
        Product product = productService.getProduct(productId);
        MerchantStock merchantStock = merchantStockService.getMerchantStockByProductIdAndMerchantId(merchantId, productId);

        if(user == null) return 1;
        if(product == null) return 2;
        if(merchantStock == null)return 3;
        if(merchantStock.getStock() <= 0) return 4;
        if(user.getBalance() < product.getPrice()) return 5;

        merchantStock.setStock(merchantStock.getStock() - 1);
        user.setBalance(user.getBalance() - product.getPrice());

        return 0;
    }
}
