# Image Handling in ContentGrid Component

## Question

> For the content grid, I wonder what is the size of the frame, or the aspect ratio. For example, if I have two images I want to display, one is landscape, one is vertical, how should I do it well?

## Current Implementation

In the ContentGrid component, images are displayed with a fixed aspect ratio of 3:4 (portrait orientation):

```tsx
<div className="relative aspect-[3/4] overflow-hidden">
  <BlurImage 
    src={post.media && post.media.length > 0 
      ? post.media[0].url 
      : (post.image || 'https://picsum.photos/600/600?random=default')} 
    alt={post.title}
    aspectRatio="aspect-[3/4]"
    sizes="(max-width: 768px) 50vw, 33vw"
    className={
      post.media && post.media.length > 0 && post.media[0].width && post.media[0].height
        ? post.media[0].width > post.media[0].height 
          ? "object-cover" // landscape images
          : "object-cover" // portrait images
        : "object-cover" // Default
    }
  />
</div>
```

The ContentGrid handles image display with the following characteristics:

1. **Fixed 3:4 aspect ratio container** for all images regardless of orientation
2. **Object-cover styling** to ensure the image fills the container while maintaining aspect ratio 
3. **Consistent grid layout** with a 2-column structure (mobile and desktop)
4. **No differentiation** between landscape and portrait images in terms of display space

## Options for Handling Mixed Image Orientations

### Option 1: Maintain Current Approach with Smarter Cropping

The current approach ensures grid consistency but may crop important parts of landscape images. You could improve this by:

1. Keep the fixed 3:4 container
2. For landscape images, add logic to position the crop intelligently:

```tsx
// For landscape images
className="object-cover object-[center_20%]" // Focus on upper part of image
```

**Pros**:
- Maintains grid consistency
- Simple implementation
- No layout shifts

**Cons**:
- Still crops landscape images significantly
- May lose important image content

### Option 2: Varying Aspect Ratios Based on Image Orientation

To preserve more of each image's content:

```tsx
<div className={`relative ${
  post.media && post.media.length > 0 && post.media[0].width && post.media[0].height
    ? post.media[0].width > post.media[0].height 
      ? "aspect-[4/3]" // landscape container for landscape images
      : "aspect-[3/4]" // portrait container for portrait images
    : "aspect-[3/4]" // Default
  } overflow-hidden`}
>
  <BlurImage 
    src={post.media[0].url}
    alt={post.title}
    aspectRatio=""  // Remove this prop as we're setting aspect ratio on parent
    sizes="(max-width: 768px) 50vw, 33vw"
    className="object-cover"
  />
</div>
```

**Pros**:
- Better preserves image content
- Still maintains structured grid
- Moderate implementation complexity

**Cons**:
- Varying heights in the grid
- May create visual inconsistency

### Option 3: Pinterest-Style Masonry Grid

For the most natural presentation of mixed orientations:

1. Replace the current grid with a masonry layout
2. Keep image natural proportions but standardize widths
3. Use libraries like `react-masonry-css` or CSS Grid masonry layout:

```tsx
// CSS Grid masonry approach
<div className="grid grid-cols-2 gap-x-1 gap-y-1 auto-rows-[10px]">
  {filteredPosts.map((post) => {
    // Calculate grid row span based on aspect ratio
    const aspectRatio = post.media && post.media.length > 0 && post.media[0].width && post.media[0].height
      ? post.media[0].width / post.media[0].height
      : 0.75; // Default to portrait
    
    // Calculate row span (height in grid rows)
    // A landscape image might span fewer rows than a portrait one
    const rowSpan = Math.ceil(30 / aspectRatio); // 30 is arbitrary, adjust as needed
    
    return (
      <div 
        key={post.id}
        className="group..."
        style={{ 
          gridRowEnd: `span ${rowSpan}`,
        }}
      >
        {/* Post content */}
      </div>
    );
  })}
</div>
```

**Pros**:
- Best preservation of image content
- Modern, Pinterest-like visual effect
- Efficient use of space

**Cons**:
- More complex implementation
- Potentially more difficult to scan in a grid pattern
- May require additional libraries

### Option 4: Adaptive Sizing with Grid Areas

Using CSS Grid layout areas to create a more dynamic grid:

```tsx
// In your CSS
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
}

.post-card.landscape {
  grid-column: span 2; /* Make landscape images span full width */
}

// In your component
<div className="posts-grid">
  {filteredPosts.map((post) => {
    const isLandscape = post.media && post.media.length > 0 && 
      post.media[0].width && post.media[0].height && 
      post.media[0].width > post.media[0].height;
    
    return (
      <div 
        key={post.id}
        className={`post-card ${isLandscape ? 'landscape' : ''}`}
      >
        <div className={`relative ${isLandscape ? 'aspect-[16/9]' : 'aspect-[3/4]'}`}>
          <BlurImage 
            src={post.media[0].url}
            alt={post.title}
            className="object-cover"
          />
        </div>
        {/* Rest of post content */}
      </div>
    );
  })}
</div>
```

**Pros**:
- Landscape images get more prominence
- Maintains natural aspect ratios
- Creates visual interest

**Cons**:
- Less consistent layout
- May lead to fewer images visible in viewport
- More complex implementation

## Recommendation

For the best balance of grid consistency and image integrity while keeping your current design approach, **Option 2 - Varying Aspect Ratios** is recommended. This maintains your grid structure while better respecting the original image proportions.

For a more modern, visually dynamic approach that better showcases images of different orientations, **Option 3 (Masonry)** would be ideal, though it requires more implementation work.

## Implementation Considerations

Whichever approach you choose, consider these additional factors:

1. **Performance**: Masonry layouts can be more JavaScript-intensive
2. **Mobile experience**: Test thoroughly on smaller screens
3. **Lazy loading**: Ensure images load efficiently as user scrolls
4. **User testing**: Get feedback on which layout users find most appealing
5. **Content focus**: Consider which approach best highlights your specific content 