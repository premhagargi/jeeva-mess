# **App Name**: Jeeva Eats

## Core Features:

- Simulated User Authentication: Provide separate login screens for Student and Admin roles with mock validation for Student ID/Password and Admin Username/Password.
- Student Menu & Cart System: Display a daily South Indian menu with placeholder items, descriptions, and prices. Allow students to add/remove items, adjust quantities, and view the total in a temporary cart.
- Mock Order Placement: Upon checkout, create and store a mock order object with order ID, student details, items, total, and 'Pending' status using in-memory JSON data.
- Student Order History: Students can view a list of their past mock orders, including order ID, items, total price, date, and current status.
- Admin Order Management Table: Display a comprehensive table of all mock orders for administrators, showing order details, student information, time, total, and status.
- Admin Order Status Update: Admins can update the status of any mock order to 'Dispatched' or 'Cancelled', with immediate UI reflection.
- Role-Based Sidebar Navigation: Implement persistent sidebar navigation for both Student (Dashboard, Menu, Cart, Orders) and Admin (Dashboard, Orders) roles.

## Style Guidelines:

- Primary color: Deep Royal Maroon (#71171F) for highlights and calls to action.
- Background color: A warm, creamy off-white (#F9F8F3) for the main application backdrop.
- Accent colors: Pure black (#000000) for high-contrast text and foreground elements. Light neutral gray (#E5E5E5) for borders and secondary text. Very light gray (#F2F2F2) for section backgrounds.
- Primary font family: 'Inter' (sans-serif). Headlines will use a bold weight with tight tracking and uppercase styling. Body text will be regular/medium weight for high readability. Meta/detail text will be small caps, bold, with wide tracking for a premium feel. Note: currently only Google Fonts are supported.
- Utilize a minimalist, clean set of icons consistent with a modern dashboard aesthetic, complementing the crisp, sharp UI elements.
- Employ grid-based layouts with strict alignment. Favor spaciousness with generous padding and margins. Product cards will use a floating layout, with minimal `1px` solid borders using the muted gray, without soft shadows.
- Incorporate subtle animations for UI feedback, such as a gentle vertical hover lift on product cards, and loading skeletons for data fetching. Display toast notifications for important user actions like order placement.