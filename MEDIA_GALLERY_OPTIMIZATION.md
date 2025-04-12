# MediaGallery Optimization

## Dynamic Variant Selection Implementation

We've optimized the MediaGallery component to use the most appropriate image variants based on context, significantly improving performance while maintaining visual quality.

### Key Improvements

1. **Dynamic Variant Selection**
   - Uses different image variants based on display context:
     - Thumbnail (300px) for initial loading
     - Medium (800px) for main gallery view
     - Large (1600px) for high-resolution modal view
   - Automatically adapts to mobile vs. desktop contexts

2. **Progressive Loading**
   - Initial render uses smaller thumbnail variant (faster)
   - Seamlessly transitions to higher quality once loaded
   - Visual effects (slight blur/scale) during transition prevent jarring changes

3. **Preloading Strategy**
   - Preloads adjacent images in the carousel
   - Uses a two-step loading approach:
     1. Load thumbnails first (quick initial display)
     2. Then load medium variants (smooth transition to quality)

4. **Responsive Adaptation**
   - Detects device size and adapts accordingly
   - Adjusts sizes attribute to instruct browsers how to select variants

### Implementation Details

#### Variant URL Resolution

The component implements a smart URL resolution system that works with both new and legacy data:

```javascript
const getVariantUrl = (item, variant = 'medium') => {
  // Modern media objects with variants structure
  if (item.variants && item.variants[variant]?.url) {
    return item.variants[variant].url;
  }
  
  // Legacy URLs with pattern matching
  if (typeof item.url === 'string') {
    if (item.url.includes('/medium/')) {
      return item.url.replace('/medium/', `/${variant}/`);
    }
    // Additional patterns...
  }
  
  return item.url; // Fallback
};
```

#### Progressive Loading

```javascript
// Show thumbnail first, then transition to medium
<Image
  src={initialLoading 
    ? getVariantUrl(currentItem, 'thumbnail') 
    : getVariantUrl(currentItem, 'medium')}
  className={`transition-opacity duration-300 ${
    initialLoading ? 'opacity-90 scale-[1.02] blur-[2px]' : 'opacity-100 scale-100 blur-0'
  }`}
  // Other attributes...
/>
```

#### Preloading Adjacent Images

```javascript
// Preload previous and next images for smoother navigation
useEffect(() => {
  const prevIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
  const nextIndex = currentIndex === totalItems - 1 ? 0 : currentIndex + 1;
  
  [prevIndex, nextIndex].forEach(index => {
    // Load thumbnail first, then medium
    const img = new globalThis.Image();
    img.src = getVariantUrl(item, 'thumbnail');
    img.onload = () => {
      const mediumImg = new globalThis.Image();
      mediumImg.src = getVariantUrl(item, 'medium');
    };
  });
}, [currentIndex, media, totalItems]);
```

### Performance Benefits

1. **Initial Load Time**
   - ~60% smaller initial payload (300px vs. 800px)
   - Faster Time to First Contentful Paint (FCP)

2. **Bandwidth Savings**
   - Uses appropriate sizes for each context
   - High-resolution images only loaded when needed

3. **Perceived Performance**
   - Progressive loading feels faster to users
   - Smooth transitions hide loading delays
   - Preloading creates seamless carousel navigation

4. **Device Adaptation**
   - Mobile devices receive appropriately sized content
   - High-DPI screens still get excellent quality

### User Experience Improvements

1. **Smoother Transitions**
   - Subtle transition effects between quality levels
   - No jarring quality jumps between images

2. **Better High-Resolution Experience**
   - Large variant (1600px) provides excellent zoom quality
   - Dedicated loading indicator for high-res view

3. **Adaptive Sizing**
   - Images sized appropriately for the device
   - Maintains aspect ratios where possible

### Future Enhancements

1. **Network-Aware Variant Selection**
   - Adapt to slow connections by using smaller variants
   - Use Network Information API for smart adaptation

2. **Advanced Preloading**
   - Analyze user behavior to predict which images to preload
   - Pause preloading when device is on low battery

3. **AVIF Format Support**
   - Add next-gen image format support for even better compression
   - Potential 50% size reduction over WebP 