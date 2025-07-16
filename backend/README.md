
# Mittweida Backend

This is the backend for the Mittweida project, built with [NestJS](https://nestjs.com/) and TypeScript.

## Project Structure

```folder
backend/
├── src/                # Main source code
│   ├── carousel/       # Carousel feature (controller, service, model)
│   ├── features/       # Features API
│   ├── places/         # Places and place-types
│   ├── review/         # Reviews API
│   ├── routes/         # Routes API
│   ├── app.*           # Main app module, controller, service
│   └── main.ts         # Entry point
├── data/               # CSV data files and images
├── test/               # E2E tests
├── package.json        # Dependencies and scripts
├── tsconfig*.json      # TypeScript configs
└── README.md           # Project documentation
```

## Getting Started

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Run the development server:**

   ```sh
   npm run start:dev
   ```

3. **Build for production:**

   ```sh
   npm run build
   npm run start:prod
   ```

4. **Run tests:**

   ```sh
   npm run test
   npm run test:e2e
   npm run test:cov
   ```

## API Endpoints

The backend exposes RESTful endpoints for:

- Carousel
- Features
- Places & Place Types
- Reviews
- Routes

See the source code in `src/` for details on each module and controller.

## Data

CSV files in `data/` provide seed data for places, features, reviews, and routes. Images are stored in `data/images/`.

## Deployment

For deployment instructions, see the [NestJS deployment docs](https://docs.nestjs.com/deployment).

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord](https://discord.gg/G7Qnnhy)
- [NestJS Devtools](https://devtools.nestjs.com)

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
