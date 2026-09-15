package com.nawaf.ecommerce.Service;

import com.nawaf.ecommerce.Model.Merchant;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MerchantService {

    private final List<Merchant> merchants = new ArrayList<>();

    public List<Merchant> getMerchants() {
        return merchants;
    }

    public Merchant getMerchant(String id) {
        for (Merchant merchant : merchants) {
            if (merchant.getId().equals(id)) return merchant;
        }
        return null;
    }

    // Case 0: Merchant added successfully
    // Case 1: ID already exist
    // Case 2: Merchant name already exist
    public int newMerchant(Merchant merchant) {
        if (getMerchant(merchant.getId()) != null) return 1;

        for (Merchant m : merchants) {
            if (m.getName().equals(merchant.getName())) return 2;
        }

        merchants.add(merchant);
        return 0;
    }

    // Case 0: Merchant updated successfully
    // Case 1: Merchant not found
    // Case 2: Cannot change id
    // Case 3: Merchant name already exist
    public int updateMerchant(String id, Merchant merchant) {
        Merchant oldMerchant = getMerchant(id);

        if (oldMerchant == null) return 1;
        if (!merchant.getId().equals(id)) return 2;

        for (Merchant m : merchants) {
            if (m.getName().equals(merchant.getName())
                    && !m.getId().equals(id)) {
                return 3;
            }
        }

        int index = merchants.indexOf(oldMerchant);
        merchants.set(index, merchant);

        return 0;
    }

    // Case 0: Merchant deleted successfully
    // Case 1: Merchant not found
    public int deleteMerchant(String id) {
        Merchant merchant = getMerchant(id);

        if (merchant == null) return 1;

        merchants.remove(merchant);
        return 0;
    }
}