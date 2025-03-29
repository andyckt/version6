# Merchant Account Interface:

#### Right now, we have 7 different data structure for merchant accounts:
- **SingleLocationMerchant**
- **MultiLocationMerchant**
- **AttractionMerchant**
- **StreetMerchant**
- **BuildingMerchant**
- **HotelMerchant**
- **BarClubMerchant**

  Currently we have this:
  export enum ProfileInterface {
  SingleShopRestaurant = 1,
  MultipleBranchMerchant = 2,
  Attraction = 3,
  Street = 4,
  Building = 5,
  Hotel = 6,
  BarClub = 7
}

What I want is each of the data structures should have an unique merchant account page interface.
The value profileinterface correspond to a different profile interface file.SingleShopRestaurantProfile.tsx = 1
MultipleBranchMerchantProfile.tsx = 2
AttractionProfile.tsx = 3
StreetProfile.tsx = 4
BuildingProfile.tsx = 5
HotelProfile.tsx = 6
BarProfile.tsx = 7


- **Mentioned Grid** Create MentionedGrid.tsx, this is to show post cards that mentioned this account. Please refer to ContentGrid.tsx. This is a file for the content grid on the home interface. I want you to use the exact same grid design, but this time we display posts cards that mentioned this account, and also no need the 8 gifs category filter this time.