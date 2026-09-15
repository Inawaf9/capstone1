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

    // Case 0: Gift purchased successfully
    // Case 1: Sender not found
    // Case 2: Receiver not found
    // Case 3: Cannot gift yourself
    // Case 4: Product not found
    // Case 5: Merchant stock not found
    // Case 6: Merchant stock is zero
    // Case 7: Sender doesn't have enough money
    public int buyProductAsGift(String senderId, String receiverId, String productId, String merchantId) {
        User sender = getUser(senderId);
        User receiver = getUser(receiverId);

        if (sender == null) return 1;
        if (receiver == null) return 2;
        if (senderId.equals(receiverId)) return 3;

        Product product = productService.getProduct(productId);

        if (product == null) return 4;

        MerchantStock merchantStock = merchantStockService.getMerchantStockByProductIdAndMerchantId(merchantId, productId);

        if (merchantStock == null) return 5;
        if (merchantStock.getStock() <= 0) return 6;
        if (sender.getBalance() < product.getPrice()) return 7;

        sender.setBalance(sender.getBalance() - product.getPrice());
        merchantStock.setStock(merchantStock.getStock() - 1);

        return 0;
    }

    // Case 0: Invalid category set to null successfully
    // Case 1: Admin not found
    // Case 2: Not authorized
    public int setProductsDontHaveCategoryToNull(String adminId) {
        User admin = getUser(adminId);

        if (admin == null) return 1;
        if (!admin.getRole().equals("admin")) return 2;

        List<Product> products = productService.getProducts();

        for (Product product : products) {

            if (categoryService.getCategory(product.getCategoryId()) == null) {
                product.setCategoryId(null);
            }
        }

        return 0;
    }

    // Case 0: Invalid stock references set to null successfully
    // Case 1: Admin not found
    // Case 2: Not authorized
    public int setInvalidStockReferencesToNull(String adminId) {
        User admin = getUser(adminId);

        if (admin == null) return 1;
        if (!admin.getRole().equals("admin")) return 2;

        List<MerchantStock> stocks = merchantStockService.getMerchantStockList();

        for (MerchantStock stock : stocks) {
            if (productService.getProduct(stock.getProductId()) == null) {
                stock.setProductId(null);
            }

            if (merchantService.getMerchant(stock.getMerchantId()) == null) {
                stock.setMerchantId(null);
            }
        }

        return 0;
    }

    public Map<String, Object> systemSummary() {

        int totalCustomers = 0;
        int totalAdmins = 0;

        for (User user : users) {
            if (user.getRole().equalsIgnoreCase("customer")) {
                totalCustomers++;
            } else if (user.getRole().equalsIgnoreCase("admin")) {
                totalAdmins++;
            }
        }

        List<Product> products = productService.getProducts();
        List<Merchant> merchants = merchantService.getMerchants();
        List<Category> categories = categoryService.getCategories();
        List<MerchantStock> stocks = merchantStockService.getMerchantStockList();

        int totalStock = 0;
        int outOfStock = 0;

        for (MerchantStock stock : stocks) {
            totalStock += stock.getStock();

            if (stock.getStock() == 0) {
                outOfStock++;
            }
        }

        double totalPrice = 0;

        for (Product product : products) {
            totalPrice += product.getPrice();
        }

        double averagePrice = 0;

        if (!products.isEmpty()) {
            averagePrice = totalPrice / products.size();
        }

        Map<String, Object> summary = new HashMap<>();

        summary.put("totalUsers", users.size());
        summary.put("totalCustomers", totalCustomers);
        summary.put("totalAdmins", totalAdmins);
        summary.put("totalProducts", products.size());
        summary.put("totalCategories", categories.size());
        summary.put("totalMerchants", merchants.size());
        summary.put("totalStock", totalStock);
        summary.put("outOfStock", outOfStock);
        summary.put("averagePrice", averagePrice);

        return summary;
    }
}
