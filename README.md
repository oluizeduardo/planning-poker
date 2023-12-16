# Planning Poker
Planning Poker is a way to estimate a relative effort for a given task.

# Technologies applied
- Backend
    - NodeJS
    - [Express](https://expressjs.com/)
- Frontend
    - [Bootstrap](https://getbootstrap.com/)
    - [SweetAlert](https://sweetalert.js.org/)
- Quality
    - Static analysis
        - [ESLint](https://eslint.org/)
- CICD
    - [GitHub Actions](https://docs.github.com/en/actions)
- Deploy
    - [Render](https://render.com/)
  

# Environment Variables
A `.env` file is required on the root folder and must contain the following key and values:

| Key           | Value        |
| ------------- |:-------------|
| `PORT`        | The port where the application is running.<br>Ex: `3000`      |

# How to run locally
- Clone this project.
    - `git clone https://github.com/oluizeduardo/planning-poker.git`
- Install all the dependencies.
    - `npm install`
- Run the server.
    - `npm run dev`

# Links
- Homepage (local): http://localhost:3000

# Code analysis
[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/summary/new_code?id=oluizeduardo_planning-poker)

