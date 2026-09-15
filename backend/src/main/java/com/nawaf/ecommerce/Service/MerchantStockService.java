package com.nawaf.ecommerce.Service;

import com.nawaf.ecommerce.Model.MerchantStock;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MerchantStockService {

    private final MerchantService merchantService;
    private final ProductService productService;

    private final List<MerchantStock> merchantStockList = new ArrayList<>();

    public List<MerchantStock> getMerchantStockList() {
        return merchantStockList;
    }

    public MerchantStock getMerchantStock(String id) {
        for (MerchantStock merchantStock : merchantStockList) {
            if (merchantStock.getId().equals(id)) {
                return merchantStock;
            }
        }
        return null;
    }

    public MerchantStock getMerchantStockByProductIdAndMerchantId(String merchantId, String productId) {

        for (MerchantStock merchantStock : merchantStockList) {
            if (productId.equals(merchantStock.getProductId())
                    && merchantId.equals(merchantStock.getMerchantId())) {
                return merchantStock;
            }
        }
        return null;
    }

    // Case 0: Merchant stock added successfully
    // Case 1: ID already exist
    // Case 2: Merchant not found
    // Case 3: Product not found
    public int newMerchantStock(MerchantStock merchantStock) {
        if (getMerchantStock(merchantStock.getId()) != null) {
            return 1;
        }

        if (merchantService.getMerchant(merchantStock.getMerchantId()) == null) {
            return 2;
        }

        if (productService.getProduct(merchantStock.getProductId()) == null) {
            return 3;
        }

        merchantStockList.add(merchantStock);

        return 0;
    }

    // Case 0: Merchant stock updated successfully
    // Case 1: Merchant stock not found
    // Case 2: Cannot change merchant stock id
    // Case 3: Merchant not found
    // Case 4: Product not found
    public int updateMerchantStock(String id, MerchantStock merchantStock) {
        MerchantStock oldMerchantStock = getMerchantStock(id);

        if (oldMerchantStock == null) {
            return 1;
        }

        if (!merchantStock.getId().equals(id)) {
            return 2;
        }

        if (merchantService.getMerchant(merchantStock.getMerchantId()) == null) {
            return 3;
        }

        if (productService.getProduct(merchantStock.getProductId()) == null) {
            return 4;
        }

        int index = merchantStockList.indexOf(oldMerchantStock);

        merchantStockList.set(index, merchantStock);

        return 0;
    }

    // Case 0: Merchant stock deleted successfully
    // Case 1: Merchant stock not found
    public int deleteMerchantStock(String id) {
        MerchantStock merchantStock = getMerchantStock(id);

        if (merchantStock == null) {
            return 1;
        }

        merchantStockList.remove(merchantStock);

        return 0;
    }

    // Case 0: Stock updated successfully
    // Case 1: Merchant stock not found
    public int addStock(String merchantId, String productId, int quantity) {
        MerchantStock merchantStock =
                getMerchantStockByProductIdAndMerchantId(
                        merchantId, productId
                );

        if (merchantStock == null) {
            return 1;
        }

        merchantStock.setStock(
                merchantStock.getStock() + quantity
        );

        return 0;
    }
}