![CS2 HUB Logo](https://res.cloudinary.com/dbhsorjvc/image/upload/h_80/v1702408600/CS2%20STASH/fmbxdwdh6705npfii0ul.webp)

CS2 HUB is a dynamic web application designed for gaming enthusiasts, particularly those interested in exploring and acquiring a variety of skins for their games. Our platform offers an engaging and user-friendly interface, making it easy for users to browse, purchase, and manage their skin collections.

## Hosting

- **Backend Server**: Hosted on Render - [https://backend-sergi-casiano.onrender.com/](https://backend-sergi-casiano.onrender.com/) (Render enters "sleeping mode" for non-active projects. A brief wait is required for the server to wake up.)
- **Frontend UI**: Hosted on Vercel - [https://sergi-casiano-final-project-front-202309-mad.vercel.app/](https://sergi-casiano-final-project-front-202309-mad.vercel.app/)
- **Frontend Repository**: [https://github.com/isdi-coders-2023/Sergi-Casiano-Final-Project-front-202309-mad](https://github.com/isdi-coders-2023/Sergi-Casiano-Final-Project-front-202309-mad)

The backend API, built with Node.js, Express, and TypeScript, manages a wide range of skins for various games. The API employs JWT for secure authentication and ensures optimal performance and user experience.

Our comprehensive testing strategy, including 100% coverage with Jest, guarantees a reliable and stable platform. Additionally, skin images are efficiently managed and optimized using Firebase and Sharp.

## Installation

1. Clone the repository: `git clone https://github.com/isdi-coders-2023/Sergi-Casiano-Final-Project-back-202309-mad.git`
2. Install dependencies: `npm install`
3. Create a `.env` file and set the environment variables as per `sample.env`
4. Start the server: `npm run start:dev`

## Main Features

The API endpoints can be accessed using HTTP requests to the appropriate URLs, as listed in the table below:

### Users Endpoints

| Method | URL             | Description                                              |
| ------ | --------------- | -------------------------------------------------------- |
| POST   | /users/register | Register a new user with required fields.                |
| PATCH  | /users/login    | Authenticate a user with username or email and password. |
| GET    | /users          | Retrieve a list of users.                                |
| GET    | /users/:id      | Retrieve a user by their ID.                             |

### Skins Endpoints

| Method | URL        | Description                                                |
| ------ | ---------- | ---------------------------------------------------------- |
| GET    | /skins     | Retrieve the list of available skins.                      |
| GET    | /skins/:id | Retrieve detailed information about a specific skin.       |
| POST   | /skins     | Add a new skin to the collection. Requires admin rights.   |
| PATCH  | /skins/:id | Update details of an existing skin. Requires admin rights. |
| DELETE | /skins/:id | Delete a skin from the collection. Requires admin rights.  |

## Contribution

To contribute to CS2 HUB:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request.

We welcome contributions from the community and look forward to improving CS2 HUB together!

---

CS2 HUB - Your ultimate destination for game skins.
