import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const CATEGORIES = [
  { id: "recommended", name: "Recommended", icon: "★" },
  { id: "starters", name: "Starters", icon: "🥗" },
  { id: "mains", name: "Main Course", icon: "🍛" },
  { id: "breads", name: "Breads", icon: "🫓" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "drinks", name: "Beverages", icon: "🥤" },
];

const PRODUCTS = [
  { id: "1", category: "recommended", name: "Paneer Tikka", description: "Char-grilled paneer with peppers and house spices.", price: 220, emoji: "🧀" },
  { id: "2", category: "recommended", name: "Chicken Biryani", description: "Fragrant basmati rice, tender chicken and aromatic spices.", price: 280, emoji: "🍗" },
  { id: "3", category: "recommended", name: "Butter Naan", description: "Soft tandoor-baked naan finished with butter.", price: 55, emoji: "🫓" },
  { id: "4", category: "starters", name: "Veg Spring Rolls", description: "Crispy rolls stuffed with seasoned vegetables.", price: 160, emoji: "🥟" },
  { id: "5", category: "starters", name: "Chicken 65", description: "Crispy, spicy fried chicken with curry leaves.", price: 240, emoji: "🍗" },
  { id: "6", category: "starters", name: "Gobi Manchurian", description: "Crispy cauliflower tossed in a tangy Indo-Chinese sauce.", price: 170, emoji: "🥦" },
  { id: "7", category: "mains", name: "Veg Pulao", description: "Basmati rice cooked with vegetables and whole spices.", price: 190, emoji: "🍚" },
  { id: "8", category: "mains", name: "Butter Chicken", description: "Creamy tomato gravy with tender tandoori chicken.", price: 290, emoji: "🍛" },
  { id: "9", category: "mains", name: "Paneer Butter Masala", description: "Paneer cubes in a rich tomato and butter gravy.", price: 250, emoji: "🥘" },
  { id: "10", category: "breads", name: "Garlic Naan", description: "Tandoor naan topped with garlic, coriander and butter.", price: 70, emoji: "🫓" },
  { id: "11", category: "breads", name: "Tandoori Roti", description: "Whole-wheat roti baked fresh in the tandoor.", price: 35, emoji: "🫓" },
  { id: "12", category: "breads", name: "Laccha Paratha", description: "Flaky layered paratha cooked with a light buttery finish.", price: 65, emoji: "🥞" },
  { id: "13", category: "desserts", name: "Gulab Jamun", description: "Warm milk-solid dumplings soaked in cardamom syrup.", price: 90, emoji: "🍩" },
  { id: "14", category: "desserts", name: "Gajar Halwa", description: "Slow-cooked carrot pudding with nuts and cardamom.", price: 110, emoji: "🥕" },
  { id: "15", category: "desserts", name: "Ice Cream", description: "Creamy vanilla ice cream with chocolate drizzle.", price: 100, emoji: "🍨" },
  { id: "16", category: "drinks", name: "Mango Lassi", description: "Chilled yogurt drink blended with ripe mango.", price: 95, emoji: "🥭" },
  { id: "17", category: "drinks", name: "Fresh Lime Soda", description: "Refreshing lime, soda and a touch of sweetness.", price: 70, emoji: "🍋" },
  { id: "18", category: "drinks", name: "Masala Chai", description: "Indian tea brewed with ginger and warming spices.", price: 50, emoji: "☕" }
];

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cart, setCart] = useState({});

  const toggleCart = (productId) => {
    setCart((current) => {
      const next = { ...current };
      if (next[productId]) {
        delete next[productId];
      } else {
        next[productId] = 1;
      }
      return next;
    });
  };

  const value = useMemo(() => {
    const items = PRODUCTS.filter((product) => cart[product.id]);
    const count = items.length;
    const total = items.reduce((sum, product) => sum + product.price, 0);
    return { cart, items, count, total, toggleCart };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  return useContext(CartContext);
}

function CategoryPanel({ activeCategory, onCategoryPress }) {
  const categoryScrollRef = useRef(null);
  const categoryOffsets = useRef({});

  const handleCategoryLayout = (id, event) => {
    categoryOffsets.current[id] = event.nativeEvent.layout.x;
  };

  const selectCategory = (category) => {
    onCategoryPress(category.id);
    if (Platform.OS !== "web") {
      const x = categoryOffsets.current[category.id] || 0;
      categoryScrollRef.current?.scrollTo({ x: Math.max(0, x - 12), animated: true });
    }
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.webSidebar}>
        <Text style={styles.categoryTitle}>Categories</Text>
        {CATEGORIES.map((category) => {
          const active = activeCategory === category.id;
          return (
            <Pressable
              key={category.id}
              onPress={() => selectCategory(category)}
              style={[styles.webCategory, active && styles.webCategoryActive]}
            >
              <Text style={[styles.categoryIcon, active && styles.categoryIconActive]}>
                {category.icon}
              </Text>
              <Text style={[styles.webCategoryText, active && styles.webCategoryTextActive]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.mobileCategoryPanel}>
      <Text style={styles.categoryTitle}>Categories</Text>
      <ScrollView
        ref={categoryScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mobileCategoryScroll}
      >
        {CATEGORIES.map((category) => {
          const active = activeCategory === category.id;
          return (
            <Pressable
              key={category.id}
              onLayout={(event) => handleCategoryLayout(category.id, event)}
              onPress={() => selectCategory(category)}
              style={[styles.mobileCategory, active && styles.mobileCategoryActive]}
            >
              <Text style={styles.mobileCategoryIcon}>{category.icon}</Text>
              <Text style={[styles.mobileCategoryText, active && styles.mobileCategoryTextActive]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ProductCard({ product }) {
  const { cart, toggleCart } = useCart();
  const added = Boolean(cart[product.id]);

  return (
    <View style={styles.productCard}>
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>{product.emoji}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹{product.price}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={added ? `Remove ${product.name}` : `Add ${product.name}`}
            onPress={() => toggleCart(product.id)}
            style={[styles.addButton, added && styles.removeButton]}
          >
            <Text style={[styles.addButtonText, added && styles.removeButtonText]}>
              {added ? "−" : "+"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function CategorySection({ category, products, onLayout }) {
  return (
    <View onLayout={onLayout} style={styles.section}>
      <View style={styles.sectionHeadingRow}>
        <View>
          <Text style={styles.sectionTitle}>{category.name}</Text>
          <Text style={styles.sectionSubtitle}>{products.length} items</Text>
        </View>
        <Text style={styles.sectionIcon}>{category.icon}</Text>
      </View>
      <View style={styles.productGrid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
    </View>
  );
}

function CartBar() {
  const { count, total } = useCart();

  if (count === 0) return null;

  return (
    <View style={styles.cartBar}>
      <View>
        <Text style={styles.cartCount}>{count} {count === 1 ? "item" : "items"} added</Text>
        <Text style={styles.cartTotal}>₹{total}</Text>
      </View>
      <Pressable style={styles.viewCartButton}>
        <Text style={styles.viewCartText}>View Cart</Text>
        <Text style={styles.viewCartArrow}>›</Text>
      </Pressable>
    </View>
  );
}

function AppContent() {
  const { height } = useWindowDimensions();
  const [activeCategory, setActiveCategory] = useState("recommended");
  const scrollRef = useRef(null);
  const sectionOffsets = useRef({});
  const programmaticScrollRef = useRef(false);

  const handleScroll = (event) => {
    // Keep the clicked category highlighted while the animated
    // scroll is moving through intermediate sections.
    if (programmaticScrollRef.current) {
      return;
    }

    const y = event.nativeEvent.contentOffset.y;
    const activationPoint = y + 280;

    let current = "recommended";

    CATEGORIES.forEach((category) => {
      const offset = sectionOffsets.current[category.id];

      if (offset !== undefined && offset <= activationPoint) {
        current = category.id;
      }
    });

    if (current !== activeCategory) {
      setActiveCategory(current);
    }
  };

  const scrollToCategory = (id) => {
    const offset = sectionOffsets.current[id];

    if (offset !== undefined) {
      // Highlight the category immediately when it is clicked.
      setActiveCategory(id);

      // Ignore intermediate onScroll events caused by the animated jump.
      programmaticScrollRef.current = true;

      scrollRef.current?.scrollTo({
        y: Math.max(0, offset - 12),
        animated: true,
      });

      // Release the lock after the animated scroll settles.
      setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 800);
    }
  };

  const setSectionOffset = (id, event) => {
    sectionOffsets.current[id] = event.nativeEvent.layout.y;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>FOOD MENU</Text>
            <Text style={styles.headerTitle}>Choose your favourites</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeIcon}>🛍</Text>
          </View>
        </View>

        <View style={styles.mainLayout}>
          <CategoryPanel
            activeCategory={activeCategory}
            onCategoryPress={scrollToCategory}
          />

          <View style={styles.content}>
            <ScrollView
              ref={scrollRef}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={Platform.OS === "web"}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: Math.max(120, height * 0.12) },
              ]}
            >
              <Text style={styles.introTitle}>What are you craving?</Text>
              <Text style={styles.introText}>
                Explore the menu and tap + to add an item. Tap − to remove it.
              </Text>

              {CATEGORIES.map((category) => {
                const products = PRODUCTS.filter((item) => item.category === category.id);
                return (
                  <CategorySection
                    key={category.id}
                    category={category}
                    products={products}
                    onLayout={(event) => setSectionOffset(category.id, event)}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>

        <CartBar />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F6F1",
  },
  page: {
    flex: 1,
    backgroundColor: "#F8F6F1",
  },
  header: {
    minHeight: 88,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECE8DF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    color: "#C96B35",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#25231F",
  },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF1E7",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBadgeIcon: {
    fontSize: 20,
  },
  mainLayout: {
    flex: 1,
    flexDirection: Platform.OS === "web" ? "row" : "column",
  },
  webSidebar: {
    width: 235,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 28,
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#ECE8DF",
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6E6A62",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  webCategory: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  webCategoryActive: {
    backgroundColor: "#FFF0E5",
  },
  categoryIcon: {
    width: 30,
    fontSize: 17,
    textAlign: "center",
  },
  categoryIconActive: {
    color: "#C96B35",
  },
  webCategoryText: {
    flex: 1,
    fontSize: 14,
    color: "#5F5B54",
    fontWeight: "600",
    marginLeft: 7,
  },
  webCategoryTextActive: {
    color: "#B85D2D",
    fontWeight: "800",
  },
  mobileCategoryPanel: {
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ECE8DF",
  },
  mobileCategoryScroll: {
    paddingHorizontal: 18,
    gap: 9,
  },
  mobileCategory: {
    minWidth: 105,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 13,
    backgroundColor: "#F6F3ED",
    alignItems: "center",
  },
  mobileCategoryActive: {
    backgroundColor: "#C96B35",
  },
  mobileCategoryIcon: {
    fontSize: 17,
    marginBottom: 3,
  },
  mobileCategoryText: {
    fontSize: 11,
    color: "#615D56",
    fontWeight: "700",
  },
  mobileCategoryTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  introTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#25231F",
    marginBottom: 5,
  },
  introText: {
    fontSize: 14,
    color: "#777269",
    marginBottom: 26,
    lineHeight: 21,
  },
  section: {
    marginBottom: 34,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2A2824",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#8A857C",
    marginTop: 3,
  },
  sectionIcon: {
    fontSize: 24,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  productCard: {
    flexGrow: 1,
    flexBasis: Platform.OS === "web" ? 285 : 280,
    maxWidth: Platform.OS === "web" ? 360 : 500,
    minHeight: 148,
    margin: 6,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE8DF",
    flexDirection: "row",
    shadowColor: "#2C241B",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  productImage: {
    width: 86,
    height: 86,
    borderRadius: 14,
    backgroundColor: "#FFF1E7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  productEmoji: {
    fontSize: 40,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#292722",
  },
  productDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: "#817B72",
    marginTop: 4,
    marginBottom: 5,
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: "#25231F",
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#C96B35",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    backgroundColor: "#F2E3D9",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 25,
    lineHeight: 28,
    fontWeight: "500",
  },
  removeButtonText: {
    color: "#B85D2D",
  },
  cartBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    minHeight: 68,
    borderRadius: 17,
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: "#27231F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  cartCount: {
    color: "#F4EDE5",
    fontSize: 12,
    fontWeight: "700",
  },
  cartTotal: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },
  viewCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C96B35",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 11,
  },
  viewCartText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  viewCartArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    marginLeft: 6,
    lineHeight: 18,
  },
});
