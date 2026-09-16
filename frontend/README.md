# E-Commerce Frontend

<p align="center">
  <img src="public/tuwaiq-academy-logo.png" alt="Tuwaiq Academy" width="300" />
</p>

A simple frontend for a Java Spring Boot bootcamp project at Tuwaiq Academy. Built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

## Getting started

Run these commands inside the `frontend` folder:

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Start the Spring Boot backend separately on port **8080**, then open **http://localhost:3000**.

The backend URL is configured in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Restart the frontend after changing this value. The backend currently allows requests from `http://localhost:3000`.

## Using the app

1. Open **User records → Add user** to create a user if the backend is empty. Choose the `admin` role to access maintenance and promotion actions.
2. Enter that user's ID in the header and click **Set user**.
3. Add a category, a product in that category, a merchant, and a stock record.
4. Open **Products** to buy one or more units, or send a gift. Enter the required IDs manually.
5. Open **Account** to charge or transfer balance, manage user records, or promote a customer as an admin.

The selected User ID is saved in your browser and restored after refresh. Use **Account → Change / clear user** to switch users.

## Pages

| Page       | Features                                                            |
| ---------- | ------------------------------------------------------------------- |
| Home       | System statistics and admin actions to repair invalid references    |
| Products   | View, add, edit, delete, buy, gift, and discount products           |
| Categories | View, add, edit, delete, and apply category discounts               |
| Merchants  | Manage merchants, view inventory, manage stock records, and restock |

CRUD controls are available to everyone, including visitors without a selected user. Maintenance and customer promotion controls appear for admins. The shared footer displays the Tuwaiq Academy logo.

## Project structure

```text
app/          Pages, shared layout, and styles
components/   Forms, header, footer, and shadcn/ui components
lib/          API requests, model types, and utilities
public/       Static assets, including the academy logo
```

## Commands

| Command          | Purpose                      |
| ---------------- | ---------------------------- |
| `pnpm dev`       | Start the development server |
| `pnpm build`     | Create a production build    |
| `pnpm start`     | Serve the production build   |
| `pnpm lint`      | Check code quality           |
| `pnpm typecheck` | Check TypeScript types       |
| `pnpm format`    | Format the frontend code     |

## Notes

- User selection is a demo identity selector, not authentication. Role checks only control which buttons are visible.
- Backend data is stored in memory and resets when the backend restarts.
- Backend success and error messages are displayed without rewriting them.
- Purchases, discounts, and account actions refresh the displayed data from the backend.

## Reading the code

Each page loads its lists with `useState`, `useEffect`, and a named function such as `getProducts`. CRUD forms live in their page files and use one state variable per input. Their save functions use a simple `if` to choose the add or update endpoint. The small `FormDialog` only provides the shared shadcn dialog layout.

`lib/api.ts` contains one small fetch helper plus message and price formatting. Endpoint paths are written directly in the page or form that uses them, so you can follow a button to its Spring controller without another API layer. Both JSON and plain-text backend messages are kept unchanged. `components/current-user.tsx` shares the users and selected ID with the header, and finds the current user with `users.find`. Page refreshes use an `onSaved` prop.
