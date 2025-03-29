# Travel Platform Metadata Guide

## Current Implementation Status

### ✅ Implemented Features

1. **Root Layout Metadata**
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'Travel Platform',
  description: 'Discover authentic travel experiences',
}
```

### 🚧 Planned Features

1. **Dynamic Page-Specific Metadata**

#### Post Pages
```typescript
export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  const post = await getPost(params.id);
  return {
    title: `${post.title} | Travel Platform`,
    description: post.description?.substring(0, 160),
    openGraph: {
      images: post.media?.[0]?.url || post.image,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [`@${post.username}`],
    }
  }
}
```

#### User Profiles
```typescript
export const generateMetadata = async ({ params }: { params: { username: string } }) => {
  const user = await getUser(params.username);
  return {
    title: `${user.displayName} (@${user.username}) | Travel Platform`,
    description: `Follow ${user.displayName}'s travel adventures. ${user.bio}`,
    openGraph: {
      images: user.profileImage,
      type: 'profile',
    }
  }
}
```

2. **Rich Snippets & Structured Data**

#### Travel Posts Schema
```typescript
const travelPostSchema = {
  "@context": "https://schema.org",
  "@type": "TravelBlog",
  "headline": post.title,
  "author": {
    "@type": "Person",
    "name": post.author,
    "url": `https://yourplatform.com/user/${post.username}`
  },
  "image": post.media.map(m => m.url),
  "datePublished": post.createdAt,
  "location": {
    "@type": "Place",
    "name": post.location
  }
}
```

#### Merchant Pages Schema
```typescript
const merchantSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": merchant.displayName,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": merchant.location.englishAddress,
    "addressRegion": merchant.district[0]
  },
  "openingHours": merchant.businessInfo.openingHours,
  "priceRange": "$$",
  "telephone": merchant.location.telephone[0]
}
```

3. **Social Media Optimization**

#### Twitter Cards
```typescript
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    site: '@yourplatform',
    creator: '@authorhandle',
    images: [post.media[0].url],
    title: post.title,
    description: post.description
  }
}
```

#### Facebook/Instagram Optimization
```typescript
export const metadata = {
  openGraph: {
    type: 'article',
    locale: 'en_US',
    site_name: 'Your Travel Platform',
    images: [
      {
        url: post.media[0].url,
        width: 1200,
        height: 630,
        alt: post.title,
      }
    ]
  }
}
```

4. **Localization & Alternate Languages**
```typescript
export const metadata = {
  alternates: {
    canonical: `https://yourplatform.com/post/${post.id}`,
    languages: {
      'en-US': '/en-US/post/123',
      'zh-CN': '/zh-CN/post/123',
      'ja-JP': '/ja-JP/post/123'
    }
  }
}
```

5. **Advanced SEO Features**

#### Dynamic Sitemap Generation
```typescript
// pages/sitemap.xml.ts
export async function generateSitemapXml() {
  const posts = await getAllPosts();
  const users = await getAllUsers();
  const merchants = await getAllMerchants();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts.map(post => `
        <url>
          <loc>https://yourplatform.com/post/${post.id}</loc>
          <lastmod>${post.updatedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
      // Add users and merchants...
    </urlset>`;
}
```

6. **Performance Metadata**
```typescript
export const metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  themeColor: '#ffd100',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ]
  }
}
```

7. **Security & Bot Control**
```typescript
export const metadata = {
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code'
  }
}
```

8. **Analytics & Tracking Integration**
```typescript
export const metadata = {
  other: {
    'google-analytics': 'UA-XXXXX-Y',
    'facebook-domain-verification': 'your-fb-domain-verification',
    'pinterest-verify': 'your-pinterest-verification'
  }
}
```

9. **Content Discovery**
```typescript
export const metadata = {
  category: 'Travel',
  keywords: ['travel', 'adventure', 'exploration', ...post.hashtags],
  author: post.author,
  publisher: 'Your Travel Platform',
  archives: ['/archives/2024', '/archives/2023'],
  assets: ['/assets/images', '/assets/videos'],
  bookmarks: '/bookmarks',
  coverage: post.location,
  generator: 'Next.js',
  applicationName: 'Travel Platform'
}
```

10. **Progressive Web App Support**
```json
// public/manifest.json
{
  "name": "Travel Platform",
  "short_name": "Travel",
  "description": "Discover authentic travel experiences",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffd100",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

11. **Content Monetization Metadata**
```typescript
export const metadata = {
  monetization: {
    paymentPointer: '$ilp.example.com/123456789',
  },
  'apple-itunes-app': 'app-id=myAppStoreID',
  'google-play-app': 'app-id=myPlayStoreID'
}
```

12. **Cache Control & Performance**
```typescript
export const metadata = {
  cacheControl: {
    'max-age': '86400',
    private: true,
    'must-revalidate': true
  },
  preload: [
    {
      as: 'image',
      href: post.media[0].url,
      type: 'image/jpeg'
    }
  ],
  prefetch: [
    '/api/related-posts',
    '/api/user-profile'
  ]
}
```

## Implementation Priority

1. High Priority (Immediate Impact)
   - Dynamic page metadata for posts and user profiles
   - OpenGraph and Twitter card metadata
   - Basic structured data
   - Favicon and manifest setup

2. Medium Priority (SEO Enhancement)
   - Sitemap generation
   - Rich snippets for merchants
   - Alternate language support
   - Performance metadata

3. Low Priority (Future Enhancement)
   - Content monetization metadata
   - Advanced cache control
   - Analytics integration
   - PWA features

## Best Practices

1. **Testing**
   - Use [metatags.io](https://metatags.io) for social preview testing
   - Validate structured data with [Google's Rich Results Test](https://search.google.com/test/rich-results)
   - Check mobile-friendliness with [Google's Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

2. **Maintenance**
   - Regularly update sitemaps
   - Monitor Google Search Console for issues
   - Keep metadata in sync with content changes
   - Review and update schema markup periodically

3. **Performance**
   - Optimize image sizes for social sharing
   - Use CDN for faster asset delivery
   - Implement lazy loading where appropriate
   - Monitor Core Web Vitals

## Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) 