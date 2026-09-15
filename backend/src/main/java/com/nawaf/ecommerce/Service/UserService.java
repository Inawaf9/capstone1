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

    // Case 0: User buy product successfully
    // Case 1: User not found
    // Case 2: Product not found
    // Case 3: Merchant stock not found
    // Case 4: Merchant stock is zero
    // Case 5: Merchant stock less than quantity
    // Case 6: User don't have enough money
    public int buyMoreThanOneProduct(String userId, String productId, String merchantId, int quantity){
        User user = getUser(userId);
        Product product = productService.getProduct(productId);
        MerchantStock merchantStock = merchantStockService.getMerchantStockByProductIdAndMerchantId(merchantId, productId);

        if(user == null) return 1;
        if(product == null) return 2;
        if(merchantStock == null)return 3;
        if(merchantStock.getStock() <= 0) return 4;
        if(merchantStock.getStock() < quantity) return 5;
        if(user.getBalance() < (product.getPrice() * quantity)) return 6;

        merchantStock.setStock(merchantStock.getStock() - quantity);
        user.setBalance(user.getBalance() - (product.getPrice() * quantity));

        return 0;
    }

    // Case 0: Balance transferred successfully
    // Case 1: User not found
    // Case 2: Receiver not found
    // Case 3: User doesn't have enough balance
    // Case 4: Same user cannot be a receiver
    // Case 5: Amount must be positive
    public int transferBalance(String userId, String receiverId, double amount) {
        if (userId.equals(receiverId)) return 4;
        if (amount <= 0) return 5;

        User foundUser = getUser(userId);
        User foundReceiver = getUser(receiverId);

        if (foundUser == null) return 1;
        if (foundReceiver == null) return 2;
        if (foundUser.getBalance() < amount) return 3;

        foundUser.setBalance(foundUser.getBalance() - amount);
        foundReceiver.setBalance(foundReceiver.getBalance() + amount);

        return 0;
    }

    // Case 0: User balance charged successfully
    // Case 1: User not found
    public int chargeBalance(String id, double amount){
        User foundUser = getUser(id);

        if(foundUser == null) return 1;

        foundUser.setBalance(foundUser.getBalance() + amount);

        return 0;
    }

    // Case 0: Change role successfully
    // Case 1: Admin not found
    // Case 2: Customer not found
    // Case 3: Not authorize to change role
    // Case 4: User already admin
    public int changeCustomerRoleToAdmin(String adminId, String customerId){
        User admin  = getUser(adminId);
        User customer = getUser(customerId);

        if(admin == null) return 1;
        if(customer == null) return 2;
        if(!admin.getRole().equals("admin")) return 3;
        if(customer.getRole().equals("admin")) return 4;

        customer.setRole("admin");

        return 0;
    }
}
