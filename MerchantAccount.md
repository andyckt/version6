# Merchant Account Data Structure & Interface:

#### Right now, we only have data structure for users and a user account interface. But we don't have Merchant account data structure and merchant account interface. This is what we will be doing.

Important:
all merchant account have route /merchant/[username]

As you know, in post card detail page, we have a tagged account section, with different icons for different types. So when creating a new merchant account, do you think it's a good idea to add a new field to store to clarify what account type it is (user' | 'restaurant' | 'hotel' | 'attraction' | 'barandclub' | 'shopping) so that it will render and display the correct icon on the tagged account section on the post card detail page.





### SingleShopRestaurantProfile Data Strucuture
this is for restaurant that only has one branch
it will have the common fields and plus the following fields:

profileinterface = 1 // this is explained at the section of "What does profile interface do?"

**Opening Hours** // for example Monday to Friday 11:00-14:00 16:00-21:30 Saturday and Sunday 11:00-22:00

**Price per person** : integer   // for example around 120 Chinese Yuan

**Need booking?** string // for example can walk in, or need booking, or can book or walk in

**Peak time**: // conditioanl rendering, it is optional to put this field, for example 8pm - 10pm

**Chinese Address** : string // for example 88食堂·烤肉酱蟹(韩国街店) 井亭大厦b座104室, we store this because users can show this to their taxi driver

**English address** : string //meanwhile, users can also see English address

**Nearest subway station** // for example: 10号線龍柏新村站3出口 - walk 800m

**Telephone** // conditional rendering, merchants can optioanlly add a telephone numbers, can be more than one, for example 021-54337255 / 13585946606


### MultipleBranchMerchantProfile Data Strucuture
this is for merchant that has multiple branches, like a restauant that has multiple branches, or a franchise bar that has multiple branches
it will have the common fields and plus the following fields:
profileinterface = 2

**Price per person** : integer   // for example around 120 Chinese Yuan 

**Need booking?** string // for example can walk in, or need booking, or can book or walk in

**Peak time**: // conditioanl rendering, it is optional to put this field, for example 8pm - 10pm

Since this is a data structure for multiple branch merchants, they will have several different branches, each with different Chinese address, English address, phone number
for example

**Branch 1**
- **Branch 1 district:** string // for example, Huangpu District
- **Branch 1 Opening Hours** // for example Monday to Friday 11:00-14:00 16:00-21:30 Saturday and Sunday 11:00-22:00.
- **Branch 1 Chinese Address**: string // for example 88食堂·烤肉酱蟹(韩国街店) 井亭大厦b座104室] 
- **Branch 1 English address**: string
- **Branch 1 Nearest subway station** // for example: 10号線龍柏新村站3出口 - walk 800m
- **Branch 1 Telephone** // conditional rendering, merchants can optioanlly add a telephone numbers, can be more than one, for example 021-54337255 / 13585946606

Branch 2
- **Branch 2 district:** string // for example, Huangpu District
- **Branch 2 Opening Hours** // for example Monday to Friday 11:00-14:00 16:00-21:30 Saturday and Sunday 11:00-22:00.
- **Branch 2 Chinese Address**: string // for example 88食堂·烤肉酱蟹(韩国街店) 井亭大厦b座104室
- **Branch 2 English address**: string
- **Branch 2 Nearest subway station** // for example: 10号線龍柏新村站3出口 - walk 800m
- **Branch 2 Telephone** // conditional rendering, merchants can optioanlly add a telephone numbers, can be more than one, for example 021-54337255 / 13585946606

Branch 3
Branch 4
... etc, but how many branches are not fixed, different from different companies

### AttractionProfile Data structure
this is attraction profile, like theme parks, museum, etc
it will have the common fields and plus the following fields:

profileinterface = 3
    
**Opening Hours** // for example Monday to Friday 11:00-14:00 16:00-21:30 Saturday and Sunday 11:00-22:00
    
**Ticket price**: integer // for example around 120 Chinese Yuan
    
**Need booking?** string // for example can walk in, or need booking, or can book or walk in

**Peak time**: // conditioanl rendering, it is optional to put this field, for example 8pm - 10pm

**Chinese Address** : string // for example 88食堂·烤肉酱蟹(韩国街店) 井亭大厦b座104室, we store this because users can show this to their taxi driver

**English address** : string //meanwhile, users can also see English address

**Nearest subway station** // for example: 10号線龍柏新村站3出口 - walk 800m

**Telephone** // conditional rendering, merchants can optioanlly add a telephone numbers, can be more than one, for example 021-54337255 / 13585946606

### Street Data Structure
this is street profile, like the famous streets in Shanghai
it will have the common fields and plus the following fields:
profileinterface = 4

**Chinese Address** : string // for example 88食堂·烤肉酱蟹(韩国街店) 井亭大厦b座104室, we store this because users can show this to their taxi driver

**English address** : string //meanwhile, users can also see English address

**Nearest subway station** // for example: 10号線龍柏新村站3出口 - walk 800m

no need to telephone because this is to store a street

### Building Data structure
this is for some shopping malls or a building that have different merchants inside

it will have the common fields and plus the following fields:

profileinterface = 5

**Opening Hours** // for example Monday to Friday 11:00-14:00 16:00-21:30 Saturday and Sunday 11:00-22:00.

**Need booking?** string // for example can walk in, or need booking, or can book or walk in

**Peak time**: // conditioanl rendering, it is optional to put this field, for example 8pm - 10pm

**Chinese Address** : string // for example 88食堂·烤肉酱蟹(韩国街店) 井亭大厦b座104室, we store this because users can show this to their taxi driver

**English address** : string //meanwhile, users can also see English address

**Nearest subway station** // for example: 10号線龍柏新村站3出口 - walk 800m

**Telephone** // conditional rendering, merchants can optioanlly add a telephone numbers, can be more than one, for example 021-54337255 / 13585946606


### Hotel Data Structure
this is for hotel merchants
it will have the common fields and plus the following fields:

profileinterface = 6
    
**Price** ：integer // for example, 800 Chinese Yuan per night
    
**Chinese Address** : string // for example 88食堂·烤肉酱蟹(韩国街店) 井亭大厦b座104室, we store this because users can show this to their taxi driver

**English address** : string //meanwhile, users can also see English address

**Nearest subway station** // for example: 10号線龍柏新村站3出口 - walk 800m

**Telephone** // conditional rendering, merchants can optioanlly add a telephone numbers, can be more than one, for example 021-54337255 / 13585946606

### BarClub Data Structure
this is  for bar and club merchants
for this, it will have the common fields and extend the SingleRestaurant Data Structure and plus the following fields:

profileinterface = 7

**nearby midnight food**: @username, @username // it will tag some restaurants that are opneed at very late, by using @username tagger them, and it will display it in a seperate section
    
**entryfee**: // for example, 150 Chinese Yuan entry fee
    
**ClubCategory**: // e.g Hiphope, Pop songs, can be more than one



## What does profile interface do?
important to read:
You might have noticed different data structure is storing a different value for profileinterface, they correspond to a different profile interface because I want different interface for different types of merchants
SingleShopRestaurantProfile.tsx = 1
MultipleBranchMerchantProfile.tsx = 2
AttractionProfile.tsx = 3
StreetProfile.tsx = 4
BuildingProfile.tsx = 5
HotelProfile.tsx = 6
BarProfile.tsx = 7




## Samples for different types of merchants: