# Axis of Desire — E-Commerce Platform

E-commerce platform with wishlist and product reviews, Stripe checkout, order history and admin product controls.

> **Client project.** Not publicly deployed.

## Stack

- **Frontend** — React, Redux Toolkit, TailwindCSS
- **Backend** — Firebase / Firestore
- **Payments** — Stripe

## Features

- Wishlist and product reviews
- Secure Stripe checkout
- Order history management
- Admin product controls

## Architecture

React client (Redux Toolkit) with Firebase Authentication and Firestore for product, review and order data. Stripe handles checkout.

## My role

Frontend and integration work: the storefront and admin interfaces, Firestore data modelling for products, reviews and orders, and the Stripe checkout integration.

## Running locally

```bash
git clone https://github.com/AmirMaqbool0/Axis_Of_Desire.git
cd Axis_Of_Desire
npm install
npm run dev
```

Requires Node.js 18+. Create a `.env` file in the project root with your own values for: `Firebase config keys, STRIPE_PUBLISHABLE_KEY`.

---

Built by [Amir Maqbool](https://amirmaqbool.online) — Full Stack Developer (React · Next.js · Node.js · MongoDB), open to relocation to Germany.
