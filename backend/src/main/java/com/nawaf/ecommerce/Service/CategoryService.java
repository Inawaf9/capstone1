package com.nawaf.ecommerce.Service;

import com.nawaf.ecommerce.Model.Category;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {

    private final List<Category> categories = new ArrayList<>();

    public List<Category> getCategories() {
        return categories;
    }

    public Category getCategory(String id) {
        for (Category category : categories) {
            if (category.getId().equals(id)) return category;
        }
        return null;
    }

    // Case 0: Category added successfully
    // Case 1: ID already exist
    // Case 2: Category name already exist
    public int newCategory(Category category) {
        if (getCategory(category.getId()) != null) return 1;

        for (Category c : categories) {
            if (c.getName().equals(category.getName())) return 2;
        }

        categories.add(category);
        return 0;
    }

    // Case 0: Category updated successfully
    // Case 1: Category not found
    // Case 2: Cannot change id
    // Case 3: Category name already exist
    public int updateCategory(String id, Category category) {
        Category oldCategory = getCategory(id);

        if (oldCategory == null) return 1;
        if (!category.getId().equals(id)) return 2;

        for (Category c : categories) {
            if (c.getName().equals(category.getName())
                    && !c.getId().equals(id)) {
                return 3;
            }
        }

        int index = categories.indexOf(oldCategory);
        categories.set(index, category);

        return 0;
    }

    // Case 0: Category deleted successfully
    // Case 1: Category not found
    public int deleteCategory(String id) {
        Category category = getCategory(id);

        if (category == null) return 1;

        categories.remove(category);
        return 0;
    }
}